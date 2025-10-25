import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAnonDeviceName } from '../lib/deviceName';
import { supabase } from '../lib/supabase';
import { useTheme } from '../lib/theme';

interface Confession {
  id: number;
  created_at: string;
  content: string;
  device_name: string | null;
  upvote_count: number;
  comment_count: number;
  reactions: Record<string, number>; 
  userReaction?: string; 
}

interface Comment {
  id: number;
  confession_id: number;
  device_id: string;
  content: string;
  created_at: string;
}

export default function FeedScreen() {
  const { theme } = useTheme();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userReactions, setUserReactions] = useState<Map<number, string>>(new Map());
  const [upvotedIds, setUpvotedIds] = useState<Set<number>>(new Set());
  const [deviceName, setDeviceName] = useState<string>('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [selectedConfessionId, setSelectedConfessionId] = useState<number | null>(null);
  const [expandedReactionPanel, setExpandedReactionPanel] = useState<number | null>(null);
  
  // Comment-related state
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Map<number, Comment[]>>(new Map());
  const [newComment, setNewComment] = useState<Map<number, string>>(new Map());
  const [loadingComments, setLoadingComments] = useState<Set<number>>(new Set());

  useEffect(() => {
    getAnonDeviceName().then(setDeviceName);
  }, []);

  const fetchConfessions = useCallback(async () => {
    setRefreshing(true);
    
    const { data: confessionsData, error: confessionsError } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (confessionsError || !confessionsData) {
      setRefreshing(false);
      return;
    }

    const { data: reactionsData, error: reactionsError } = await supabase
      .from('reactions')
      .select('confession_id, reaction_type');

    const { data: upvotesData, error: upvotesError } = await supabase
      .from('upvotes')
      .select('confession_id');

    const reactionsMap: Map<number, Record<string, number>> = new Map();
    if (!reactionsError && reactionsData) {
      reactionsData.forEach((reaction) => {
        if (!reactionsMap.has(reaction.confession_id)) {
          reactionsMap.set(reaction.confession_id, {});
        }
        const confessionReactions = reactionsMap.get(reaction.confession_id)!;
        confessionReactions[reaction.reaction_type] = (confessionReactions[reaction.reaction_type] || 0) + 1;
      });
    }

    const upvotesMap: Map<number, number> = new Map();
    if (!upvotesError && upvotesData) {
      upvotesData.forEach((upvote) => {
        upvotesMap.set(upvote.confession_id, (upvotesMap.get(upvote.confession_id) || 0) + 1);
      });
    }

    const confessionsWithReactions = confessionsData.map((confession) => ({
      ...confession,
      reactions: reactionsMap.get(confession.id) || {},
      upvote_count: upvotesMap.get(confession.id) || 0,
    }));

    setConfessions(confessionsWithReactions as Confession[]);
    setRefreshing(false);
  }, []);

  const fetchUserReactions = useCallback(async () => {
    if (!deviceName) return;
    const { data } = await supabase
      .from('reactions')
      .select('confession_id, reaction_type')
      .eq('device_id', deviceName);
    if (data) {
      const reactionsMap = new Map<number, string>();
      data.forEach((row) => {
        reactionsMap.set(row.confession_id, row.reaction_type);
      });
      setUserReactions(reactionsMap);
    }
  }, [deviceName]);

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
    if (deviceName) {
      fetchUserReactions();
      fetchUserUpvotes();
    }
  }, [deviceName, fetchUserReactions, fetchUserUpvotes]);

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

  const handleReaction = async (confessionId: number, reactionType: string) => {
    if (!deviceName) return;
    const currentReaction = userReactions.get(confessionId);
    const isSameReaction = currentReaction === reactionType;

    const newUserReactions = new Map(userReactions);
    if (isSameReaction) {
      newUserReactions.delete(confessionId);
    } else {
      newUserReactions.set(confessionId, reactionType);
    }
    setUserReactions(newUserReactions);

    setConfessions((prev) =>
      prev.map((c) => {
        if (c.id !== confessionId) return c;
        
        const newReactions = { ...c.reactions };
        if (currentReaction && currentReaction !== reactionType) {
          newReactions[currentReaction] = Math.max(0, (newReactions[currentReaction] || 0) - 1);
          if (newReactions[currentReaction] === 0) delete newReactions[currentReaction];
        }
        if (!isSameReaction) {
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
        } else {
          newReactions[reactionType] = Math.max(0, (newReactions[reactionType] || 0) - 1);
          if (newReactions[reactionType] === 0) delete newReactions[reactionType];
        }
        
        return { ...c, reactions: newReactions, userReaction: isSameReaction ? undefined : reactionType };
      })
    );

    if (isSameReaction) {
      await supabase
        .from('reactions')
        .delete()
        .eq('confession_id', confessionId)
        .eq('device_id', deviceName);
    } else if (currentReaction) {
      await supabase
        .from('reactions')
        .update({ reaction_type: reactionType })
        .eq('confession_id', confessionId)
        .eq('device_id', deviceName);
    } else {
      await supabase.from('reactions').insert({ 
        confession_id: confessionId, 
        device_id: deviceName, 
        reaction_type: reactionType 
      });
    }
  };

  const openEmojiPicker = (confessionId: number) => {
    setSelectedConfessionId(confessionId);
    setEmojiPickerVisible(true);
  };

  const selectEmojiFromPicker = (emoji: string) => {
    if (selectedConfessionId !== null) {
      handleReaction(selectedConfessionId, emoji);
    }
    setEmojiPickerVisible(false);
    setSelectedConfessionId(null);
  };

  const toggleReactionPanel = (confessionId: number) => {
    setExpandedReactionPanel(expandedReactionPanel === confessionId ? null : confessionId);
  };

  // Comment functions
  const toggleComments = async (confessionId: number) => {
    const isExpanded = expandedComments.has(confessionId);
    const newExpandedComments = new Set(expandedComments);
    
    if (isExpanded) {
      newExpandedComments.delete(confessionId);
    } else {
      newExpandedComments.add(confessionId);
      // Fetch comments if not already loaded
      if (!comments.has(confessionId)) {
        await fetchComments(confessionId);
      }
    }
    setExpandedComments(newExpandedComments);
  };

  const fetchComments = async (confessionId: number) => {
    setLoadingComments((prev) => new Set(prev).add(confessionId));
    
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('confession_id', confessionId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments((prev) => new Map(prev).set(confessionId, data as Comment[]));
    }
    
    setLoadingComments((prev) => {
      const newSet = new Set(prev);
      newSet.delete(confessionId);
      return newSet;
    });
  };

  const submitComment = async (confessionId: number) => {
    const commentText = newComment.get(confessionId)?.trim();
    if (!commentText || !deviceName) return;

    // Optimistic UI update
    const tempComment: Comment = {
      id: Date.now(), // Temporary ID
      confession_id: confessionId,
      device_id: deviceName,
      content: commentText,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => {
      const existing = prev.get(confessionId) || [];
      return new Map(prev).set(confessionId, [...existing, tempComment]);
    });

    setConfessions((prev) =>
      prev.map((c) =>
        c.id === confessionId ? { ...c, comment_count: c.comment_count + 1 } : c
      )
    );

    setNewComment((prev) => {
      const newMap = new Map(prev);
      newMap.delete(confessionId);
      return newMap;
    });

    // Persist to database
    const { error } = await supabase.from('comments').insert({
      confession_id: confessionId,
      device_id: deviceName,
      content: commentText,
    });

    if (error) {
      console.error('Failed to submit comment:', error);
      // Revert optimistic update on error
      await fetchComments(confessionId);
      await fetchConfessions();
    } else {
      // Refresh to get real ID
      await fetchComments(confessionId);
    }
  };

  const updateCommentInput = (confessionId: number, text: string) => {
    setNewComment((prev) => new Map(prev).set(confessionId, text));
  };

  const renderItem = ({ item }: { item: Confession }) => {
    const userReaction = userReactions.get(item.id);
    const hasUpvoted = upvotedIds.has(item.id);
    const quickEmojis = ['👍', '❤️', '😂', '😢', '😮'];
    const isPanelExpanded = expandedReactionPanel === item.id;
    
    const allReactionsWithCounts = Object.entries(item.reactions)
      .filter(([_, count]) => count > 0)
      .sort(([_, a], [__, b]) => b - a);

    return (
      <View style={styles(theme).item}>
        <View style={styles(theme).upvoteSection}>
          <Pressable
            onPress={() => handleUpvote(item.id)}
            style={[styles(theme).upvoteButton, hasUpvoted && styles(theme).upvoteButtonActive]}
          >
            <Ionicons
              name={hasUpvoted ? 'arrow-up' : 'arrow-up-outline'}
              size={20}
              color={hasUpvoted ? theme.colors.upvoteActive : theme.colors.textSecondary}
            />
            <Text style={[styles(theme).upvoteCount, hasUpvoted && styles(theme).upvoteCountActive]}>
              {item.upvote_count}
            </Text>
          </Pressable>
        </View>
        <View style={styles(theme).contentContainer}>
          <Text style={styles(theme).content}>{item.content}</Text>
          <Text style={styles(theme).meta}>
            — {item.device_name || 'Anonymous'} at {new Date(item.created_at).toLocaleString()}
          </Text>
          
          {/* Show existing reactions with counts */}
          {allReactionsWithCounts.length > 0 && (
            <View style={styles(theme).existingReactions}>
              {allReactionsWithCounts.map(([emoji, count]) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleReaction(item.id, emoji)}
                  style={[
                    styles(theme).existingReactionBubble,
                    userReaction === emoji && styles(theme).existingReactionBubbleActive
                  ]}
                >
                  <Text style={styles(theme).existingReactionEmoji}>{emoji}</Text>
                  <Text style={[
                    styles(theme).existingReactionCount,
                    userReaction === emoji && styles(theme).existingReactionCountActive
                  ]}>{count}</Text>
                </Pressable>
              ))}
            </View>
          )}
          
          {/* Collapsible Quick reaction buttons */}
          {isPanelExpanded && (
            <View style={styles(theme).quickReactionsBar}>
              {quickEmojis.map((emoji) => {
                const isSelected = userReaction === emoji;
                return (
                  <Pressable
                    key={emoji}
                    onPress={() => {
                      handleReaction(item.id, emoji);
                      setExpandedReactionPanel(null);
                    }}
                    style={[styles(theme).quickReactionButton, isSelected && styles(theme).quickReactionButtonActive]}
                  >
                    <Text style={styles(theme).quickReactionEmoji}>{emoji}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => openEmojiPicker(item.id)}
                style={styles(theme).moreReactionsButton}
              >
                <Ionicons name="add-circle-outline" size={24} color={theme.colors.textSecondary} />
              </Pressable>
            </View>
          )}
          
          {/* Toggle button in bottom-right corner */}
          <View style={styles(theme).toggleButtonContainer}>
            <Pressable
              onPress={() => toggleReactionPanel(item.id)}
              style={styles(theme).toggleReactionButton}
            >
              <Ionicons 
                name={isPanelExpanded ? 'chevron-up' : 'chevron-down'} 
                size={18} 
                color={theme.colors.textSecondary} 
              />
              <Text style={styles(theme).toggleReactionText}>React</Text>
            </Pressable>
          </View>

          {/* Comments Section */}
          <View style={styles(theme).commentsSection}>
            <Pressable
              onPress={() => toggleComments(item.id)}
              style={styles(theme).viewCommentsButton}
            >
              <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles(theme).viewCommentsText}>
                {item.comment_count === 0
                  ? 'Add a comment'
                  : expandedComments.has(item.id)
                  ? 'Hide comments'
                  : `View ${item.comment_count} ${item.comment_count === 1 ? 'comment' : 'comments'}`}
              </Text>
            </Pressable>

            {/* Comments List */}
            {expandedComments.has(item.id) && (
              <View style={styles(theme).commentsListContainer}>
                {loadingComments.has(item.id) ? (
                  <ActivityIndicator size="small" color={theme.colors.textSecondary} style={{ marginVertical: 12 }} />
                ) : (
                  <>
                    {(comments.get(item.id) || []).map((comment) => (
                      <View key={comment.id} style={styles(theme).commentItem}>
                        <View style={styles(theme).commentHeader}>
                          <Text style={styles(theme).commentDeviceName}>
                            {comment.device_id === deviceName ? 'You' : comment.device_id}
                          </Text>
                          <Text style={styles(theme).commentTimestamp}>
                            {new Date(comment.created_at).toLocaleString()}
                          </Text>
                        </View>
                        <Text style={styles(theme).commentContent}>{comment.content}</Text>
                      </View>
                    ))}

                    {/* Comment Input */}
                    <View style={styles(theme).commentInputContainer}>
                      <TextInput
                        style={styles(theme).commentInput}
                        placeholder="Write a comment..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={newComment.get(item.id) || ''}
                        onChangeText={(text) => updateCommentInput(item.id, text)}
                        maxLength={500}
                        multiline
                      />
                      <Pressable
                        onPress={() => submitComment(item.id)}
                        disabled={!newComment.get(item.id)?.trim()}
                        style={[
                          styles(theme).submitCommentButton,
                          !newComment.get(item.id)?.trim() && styles(theme).submitCommentButtonDisabled,
                        ]}
                      >
                        <Ionicons
                          name="send"
                          size={20}
                          color={newComment.get(item.id)?.trim() ? theme.colors.primary : theme.colors.textSecondary}
                        />
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // All available emojis for the picker
  const allEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
    '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
    '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
    '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
    '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
    '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀',
    '💩', '🤡', '👻', '👽', '🤖', '😺', '😸', '😹', '😻', '😼',
    '😽', '🙀', '😿', '😾', '❤️', '🧡', '💛', '💚', '💙', '💜',
    '🖤', '🤍', '🤎', '💔', '💕', '💖', '💗', '💘', '💝', '💞',
    '👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐', '✋', '🖖',
    '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾', '🦿', '🦵',
    '🔥', '💯', '💢', '💥', '💫', '💦', '💨', '🕳', '💬', '👁️',
    '🗨', '🗯', '💭', '💤', '🎉', '🎊', '🎈', '🎁', '🏆', '🥇'
  ];

  return (
    <SafeAreaView style={styles(theme).safeArea}>
      <FlatList
        data={confessions}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchConfessions} />}
        renderItem={renderItem}
        contentContainerStyle={
          confessions.length === 0 ? [styles(theme).listContent, styles(theme).emptyContainer] : styles(theme).listContent
        }
        ListEmptyComponent={<Text style={styles(theme).emptyText}>No confessions yet. Be the first!</Text>}
      />
      
      {/* Emoji Picker Modal */}
      <Modal
        visible={emojiPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEmojiPickerVisible(false)}
      >
        <View style={styles(theme).modalOverlay}>
          <View style={styles(theme).emojiPickerContainer}>
            <View style={styles(theme).emojiPickerHeader}>
              <Text style={styles(theme).emojiPickerTitle}>Choose a reaction</Text>
              <Pressable onPress={() => setEmojiPickerVisible(false)}>
                <Ionicons name="close" size={28} color={theme.colors.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles(theme).emojiGrid}>
              {allEmojis.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => selectEmojiFromPicker(emoji)}
                  style={styles(theme).emojiPickerButton}
                >
                  <Text style={styles(theme).emojiPickerEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  listContent: { padding: 16 },
  item: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: 'row',
  },
  upvoteSection: {
    alignItems: 'center',
    paddingTop: 14,
    paddingLeft: 12,
    paddingRight: 8,
  },
  upvoteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  upvoteButtonActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  upvoteCount: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    color: theme.colors.textSecondary,
  },
  upvoteCountActive: {
    color: theme.colors.upvoteActive,
  },
  contentContainer: {
    flex: 1,
    padding: 14,
  },
  content: { 
    fontSize: 16, 
    color: theme.colors.text,
    marginBottom: 8,
  },
  meta: { 
    fontSize: 12, 
    color: theme.colors.textSecondary, 
    marginBottom: 10,
  },
  existingReactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  existingReactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  existingReactionBubbleActive: {
    backgroundColor: theme.colors.primaryLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  existingReactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  existingReactionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  existingReactionCountActive: {
    color: theme.colors.primary,
  },
  quickReactionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    marginBottom: 4,
  },
  toggleButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  toggleReactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  toggleReactionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  quickReactionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    marginRight: 8,
  },
  quickReactionButtonActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  quickReactionEmoji: {
    fontSize: 24,
  },
  moreReactionsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    marginLeft: 'auto',
  },
  emptyContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { color: theme.colors.textSecondary },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  emojiPickerContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  emojiPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  emojiPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  emojiPickerButton: {
    width: '12.5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPickerEmoji: {
    fontSize: 32,
  },
  
  // Comments styles
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  viewCommentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewCommentsText: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  commentsListContainer: {
    marginTop: 8,
  },
  commentItem: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentDeviceName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  commentTimestamp: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  commentContent: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    maxHeight: 80,
  },
  submitCommentButton: {
    marginLeft: 8,
    padding: 4,
  },
  submitCommentButtonDisabled: {
    opacity: 0.3,
  },
});
