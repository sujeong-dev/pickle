export const postKeys = {
  all: ['post'] as const,
  list: () => [...postKeys.all, 'list'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  comments: (postId: string) => [...postKeys.all, 'comments', postId] as const,
};
