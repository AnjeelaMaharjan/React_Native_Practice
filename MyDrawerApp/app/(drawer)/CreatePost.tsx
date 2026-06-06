import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { Header } from "@/components/organisms/Header";
import { SPACING, BORDER_RADIUS } from "@/styles";
import {
  GET_POSTS,
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
} from "@/graphql/mutations/postMutation";
import {
  Post,
  PostsResponse,
  CreatePostInput,
  UpdatePostInput,
  CreatePostResponse,
  UpdatePostResponse,
  DeletePostResponse,
} from "@/graphql/types";

export default function CreatePostScreen() {
  const { colors, isDark } = useTheme();
  // Local state for CRUD operations
  const [customPosts, setCustomPosts] = useState<Post[]>([]);
  const [deletedPostIds, setDeletedPostIds] = useState<Set<string>>(new Set());
  const [editedPosts, setEditedPosts] = useState<Record<string, Post>>({});

  // Search and translation states
  const [searchText, setSearchText] = useState("");
  // const [isTranslateEnabled, setIsTranslateEnabled] = useState(true);
  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  // GraphQL Operations
  const { data, loading, error, refetch } = useQuery<PostsResponse>(GET_POSTS, {
    variables: {
      options: {
        paginate: {
          limit: 15,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });
  const [createPostMutation, { loading: creating }] = useMutation<
    CreatePostResponse,
    { input: CreatePostInput }
  >(CREATE_POST);
  const [updatePostMutation, { loading: updating }] = useMutation<
    UpdatePostResponse,
    { id: string; input: UpdatePostInput }
  >(UPDATE_POST);
  const [deletePostMutation, { loading: deleting }] = useMutation<
    DeletePostResponse,
    { id: string }
  >(DELETE_POST);
  // Synchronize initial data or refreshes
  const apiPosts = data?.posts?.data || [];
  // Compute final visible list with local states merged
  const displayedPosts = useMemo(() => {
    const apiFiltered = apiPosts.filter(
      (post: Post) => !deletedPostIds.has(post.id),
    );
    const merged = [...customPosts, ...apiFiltered].map((post: Post) => {
      // If locally edited, apply edits
      if (editedPosts[post.id]) {
        return { ...post, ...editedPosts[post.id] };
      }
      return post;
    });
    // Apply translations and text search filters
    return merged
      .map((post: Post) => {
        // Translation applies only to raw API posts, not custom-created or edited ones
        const isCustomOrEdited =
          (post as any).isCustom || !!editedPosts[post.id];
        return post;
      })
      .filter((post: Post) => {
        const query = searchText.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
        );
      });
  }, [apiPosts, customPosts, deletedPostIds, editedPosts, searchText]);
  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormBody("");
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (post: Post) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormBody(post.body);
    setIsModalOpen(true);
  };
  const handleSavePost = async () => {
    if (!formTitle.trim() || !formBody.trim()) {
      Alert.alert("Validation Error", "Title and body cannot be empty.");
      return;
    }
    try {
      if (editingPost) {
        // Update Post
        const { data: updateData } = await updatePostMutation({
          variables: {
            id: editingPost.id,
            input: {
              title: formTitle.trim(),
              body: formBody.trim(),
            } as UpdatePostInput,
          },
        });
        if (updateData?.updatePost) {
          const updated: Post = {
            ...updateData.updatePost,
            id: editingPost.id, // maintain correct ID
          };
          setEditedPosts((prev) => ({ ...prev, [editingPost.id]: updated }));
          Alert.alert("Success", "Post updated successfully (simulated).");
        }
      } else {
        // Create Post
        const { data: createData } = await createPostMutation({
          variables: {
            input: {
              title: formTitle.trim(),
              body: formBody.trim(),
            } as CreatePostInput,
          },
        });
        if (createData?.createPost) {
          const newPost: Post = {
            ...createData.createPost,
            id: `custom-${Date.now()}`, // generate unique key for UI list
            isCustom: true, // flag to prevent translating user content
          } as any;
          setCustomPosts((prev) => [newPost, ...prev]);
          Alert.alert("Success", "Post created successfully (simulated).");
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      Alert.alert("Mutation Failed", err.message || "Unable to save post.");
    }
  };
  const handleDeletePost = (id: string) => {
    console.log("Title: Message");
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePostMutation({
                variables: { id },
              });
              // Update local state filters
              setDeletedPostIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
              });
              setCustomPosts((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("Success", "Post deleted successfully (simulated).");
            } catch (err: any) {
              Alert.alert(
                "Mutation Failed",
                err.message || "Unable to delete post.",
              );
            }
          },
        },
      ],
    );
  };
  const renderPostCard = ({ item }: { item: Post }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, shadowColor: colors.shadow },
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.idBadge,
            {
              backgroundColor: isDark
                ? "rgba(99, 102, 241, 0.2)"
                : "rgba(79, 70, 229, 0.08)",
            },
          ]}
        >
          <Text style={[styles.idText, { color: colors.primary }]}>
            ID: {item.id}
          </Text>
        </View>
        {(item as any).isCustom && (
          <View
            style={[
              styles.customBadge,
              { backgroundColor: "rgba(16, 185, 129, 0.15)" },
            ]}
          >
            <Text style={styles.customBadgeText}>User Custom</Text>
          </View>
        )}
      </View>
      <Text style={[styles.cardTitle, { color: colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
        {item.body}
      </Text>
      <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => handleOpenEditModal(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil-outline" size={16} color="#3B82F6" />
          <Text style={[styles.actionBtnText, { color: "#3B82F6" }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDeletePost(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={[styles.actionBtnText, { color: "#EF4444" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Post Manager" />
      {/* Control panel & Smart translation selector */}
      <View
        style={[
          styles.controlBar,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.translationRow}></View>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchInputWrapper,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search posts..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleOpenCreateModal}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.createButtonText}>Add Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Main List View */}
      {loading && apiPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Loading GraphQL API posts...
          </Text>
        </View>
      ) : error && apiPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load GraphQL API posts</Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            {error.message}
          </Text>
          <TouchableOpacity
            style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryBtnText}>Retry API Connection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons
                name="newspaper-outline"
                size={48}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.statusText, { color: colors.textSecondary }]}
              >
                No posts match your filters
              </Text>
            </View>
          }
        />
      )}
      {/* Create / Edit Form Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackdrop}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingPost ? "Edit Post" : "Create New Post"}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Post Title
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Enter post title..."
                placeholderTextColor={colors.textSecondary}
                value={formTitle}
                onChangeText={setFormTitle}
              />
              <Text
                style={[
                  styles.inputLabel,
                  { color: colors.text, marginTop: SPACING.md },
                ]}
              >
                Post Body
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.text, borderColor: colors.border },
                ]}
                placeholder="Enter post details..."
                placeholderTextColor={colors.textSecondary}
                value={formBody}
                onChangeText={setFormBody}
                multiline={true}
                numberOfLines={4}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[
                    styles.formBtn,
                    styles.cancelFormBtn,
                    { borderColor: colors.border },
                  ]}
                  onPress={() => setIsModalOpen(false)}
                >
                  <Text style={[styles.formBtnText, { color: colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.formBtn,
                    styles.submitFormBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSavePost}
                  disabled={creating || updating}
                >
                  {creating || updating ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={[styles.formBtnText, { color: "#FFF" }]}>
                      {editingPost ? "Save Changes" : "Create Post"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlBar: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    gap: SPACING.sm,
  },
  translationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: SPACING.xs,
  },
  translationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  translationLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    padding: SPACING.md,
    gap: SPACING.md,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
    paddingTop: 80,
  },
  statusText: {
    marginTop: SPACING.md,
    fontSize: 15,
    fontWeight: "500",
  },
  errorText: {
    marginTop: SPACING.sm,
    fontSize: 18,
    fontWeight: "700",
    color: "#EF4444",
  },
  errorSubtext: {
    fontSize: 13,
    textAlign: "center",
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  retryBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  retryBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  idBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  idText: {
    fontSize: 10,
    fontWeight: "700",
  },
  customBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  cardActions: {
    borderTopWidth: 0.5,
    paddingTop: SPACING.sm,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.md,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  editBtn: {},
  deleteBtn: {},
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: Platform.OS === "ios" ? 40 : SPACING.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: SPACING.md,
    borderBottomWidth: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    paddingTop: SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  formBtn: {
    flex: 1,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelFormBtn: {
    borderWidth: 1,
  },
  submitFormBtn: {},
  formBtnText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
