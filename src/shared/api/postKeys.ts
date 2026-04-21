export const postKeys = {
  all: ['post'] as const,
  list: (sort?: string) => [...postKeys.all, 'list', sort ?? 'default'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  comments: (postId: string) => [...postKeys.all, 'comments', postId] as const,
};
