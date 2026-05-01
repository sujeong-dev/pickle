export const postKeys = {
  all: ['post'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (sort?: string) => [...postKeys.lists(), sort ?? 'default'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  comments: (postId: string) => [...postKeys.all, 'comments', postId] as const,
};
