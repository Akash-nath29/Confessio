import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAnonDeviceName } from '../lib/deviceName';
import { supabase } from '../lib/supabase';

interface Confession {
  id: number;
  created_at: string;
  content: string;
  device_name: string | null;
  upvote_count: number;
}

export default function FeedScreen() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [deviceName, setDeviceName] = useState<string>('');

  useEffect(() => {
    getAnonDeviceName().then(setDeviceName);
  }, []);

  const fetchConfessions = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setConfessions(data as Confession[]);
    setRefreshing(false);
  }, []);

  const fetchUserUpvotes = useCallback(async () => {
    if (!deviceName) return;
    const { data } = await supabase
      .from('upvotes')
      .select('confession_id')
      .eq('device_id', deviceName);
    if (data) {
      setUpvotedIds(new Set(data.map((row) => row.confession_id)));
    }
  }, [deviceName]);

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions]);

  useEffect(() => {
    if (deviceName) fetchUserUpvotes();
  }, [deviceName, fetchUserUpvotes]);

  const handleUpvote = async (confessionId: number) => {
    if (!deviceName) return;
    const hasUpvoted = upvotedIds.has(confessionId);

    // Optimistic UI update
    const newUpvotedIds = new Set(upvotedIds);
    if (hasUpvoted) {
      newUpvotedIds.delete(confessionId);
    } else {
      newUpvotedIds.add(confessionId);
    }
    setUpvotedIds(newUpvotedIds);

    // Update local count immediately
    setConfessions((prev) =>
      prev.map((c) =>
        c.id === confessionId
          ? { ...c, upvote_count: c.upvote_count + (hasUpvoted ? -1 : 1) }
          : c
      )
    );

    // Persist to database
    if (hasUpvoted) {
      await supabase
        .from('upvotes')
        .delete()
        .eq('confession_id', confessionId)
        .eq('device_id', deviceName);
    } else {
      await supabase.from('upvotes').insert({ confession_id: confessionId, device_id: deviceName });
    }
  };

  const renderItem = ({ item }: { item: Confession }) => {
    const hasUpvoted = upvotedIds.has(item.id);
    return (
      <View style={styles.item}>
        <View style={styles.itemContent}>
          <View style={styles.upvoteSection}>
            <Pressable
              onPress={() => handleUpvote(item.id)}
              style={[styles.upvoteButton, hasUpvoted && styles.upvoteButtonActive]}
            >
              <Ionicons
                name={hasUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                size={20}
                color={hasUpvoted ? '#ff4500' : '#666'}
              />
              <Text style={[styles.upvoteCount, hasUpvoted && styles.upvoteCountActive]}>
                {item.upvote_count}
              </Text>
            </Pressable>
          </View>
          <View style={styles.textSection}>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.meta}>
              — {item.device_name || 'Anonymous'} at {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={confessions}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchConfessions} />}
        renderItem={renderItem}
        contentContainerStyle={
          confessions.length === 0 ? [styles.listContent, styles.emptyContainer] : styles.listContent
        }
        ListEmptyComponent={<Text style={styles.emptyText}>No confessions yet. Be the first!</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f7' },
  listContent: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    padding: 14,
  },
  upvoteSection: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 4,
  },
  upvoteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  upvoteButtonActive: {
    backgroundColor: '#ffe8dc',
  },
  upvoteCount: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    color: '#666',
  },
  upvoteCountActive: {
    color: '#ff4500',
  },
  textSection: {
    flex: 1,
  },
  content: { fontSize: 16, color: '#111' },
  meta: { fontSize: 12, color: '#666', marginTop: 8 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888' },
});
