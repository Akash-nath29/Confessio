import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

interface Confession {
  id: number;
  created_at: string;
  content: string;
  device_name: string | null;
}

export default function FeedScreen() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConfessions = useCallback(async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setConfessions(data as Confession[]);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions]);

  const renderItem = ({ item }: { item: Confession }) => (
    <View style={styles.item}>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.meta}>
        — {item.device_name || 'Anonymous'} at {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

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
    padding: 14,
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
  },
  content: { fontSize: 16, color: '#111' },
  meta: { fontSize: 12, color: '#666', marginTop: 8 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888' },
});
