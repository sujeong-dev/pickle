import { api } from './kyInstance';
import type { Post, Author } from '@/entities/post';

// ── Types ────────────────────────────────────────────────────

export type Comment = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
};

export type PostListParams = {
  page?: number;
  size?: number;
  sort?: string;
  productId?: string;
};

export type PostListResponse = {
  data: Post[];
  total: number;
  page: number;
  size: number;
};

export type LikeResponse = {
  liked: boolean;
  likeCount: number;
};

export type BookmarkResponse = {
  bookmarked: boolean;
};

export type CommentListResponse = {
  data: Comment[];
};

// ── API functions ────────────────────────────────────────────

export function getPosts(params?: PostListParams): Promise<PostListResponse> {
  return api.get('posts', { searchParams: params as Record<string, string | number> }).json<PostListResponse>();
}

export function getPostDetail(id: string): Promise<Post> {
  return api.get(`posts/${id}`).json<Post>();
}

export function togglePostLike(postId: string): Promise<LikeResponse> {
  return api.post(`posts/${postId}/like`).json<LikeResponse>();
}

export function togglePostBookmark(postId: string): Promise<BookmarkResponse> {
  return api.post(`posts/${postId}/bookmark`).json<BookmarkResponse>();
}

export function reportPostSoldout(postId: string): Promise<void> {
  return api.post(`posts/${postId}/sold-out`).json<void>();
}

export function getPostComments(postId: string): Promise<CommentListResponse> {
  return api.get(`posts/${postId}/comments`).json<CommentListResponse>();
}

export function createPostComment(postId: string, content: string): Promise<Comment> {
  return api.post(`posts/${postId}/comments`, { json: { content } }).json<Comment>();
}

export function deletePostComment(postId: string, commentId: string): Promise<void> {
  return api.delete(`posts/${postId}/comments/${commentId}`).json<void>();
}

export function getRelatedPosts(productId: string): Promise<PostListResponse> {
  return api.get('posts', { searchParams: { productId } }).json<PostListResponse>();
}
