// ============== POST TYPES ==============

export interface Post {
  id: string;        // graphqlzero uses lowercase 'id'
  title: string;
  body: string;
  user?: {
    id: string;
  };
}

// Input types for mutations
export interface PostInput {
  title: string;
  body: string;
  userId?: string;
}

export interface CreatePostInput {
  title: string;
  body: string;
}

export interface UpdatePostInput {
  title?: string;
  body?: string;
}

// Response types
export interface CreatePostResponse {
  createPost: Post;
}

export interface UpdatePostResponse {
  updatePost: Post;
}

export interface DeletePostResponse {
  deletePost: boolean;
}

// For Get Posts query with pagination
export interface PostsResponse {
  posts: {
    data: Post[];
    meta: {
      totalCount: number;
    };
  };
}

export interface PostResponse {
  post: Post;
}