import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    body: string;
    userId: number;
    synced: number;
  };
  onDelete: (id: number) => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(post.id) },
    ]);
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
      <Ionicons name="trash-outline" size={24} color="#FFF" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => router.push(`/posts/${post.id}` as any)}
      >
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
          {post.synced === 0 && (
            <View style={styles.badge} />
          )}
        </View>
        <Text style={styles.body} numberOfLines={2}>{post.body}</Text>
        <Text style={styles.footer}>User ID: {post.userId}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF9800', // Orange pending sync
  },
  body: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    fontSize: 12,
    color: '#999',
  },
  deleteAction: {
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  }
});
