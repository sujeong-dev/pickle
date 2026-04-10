export const ROUTES = {
  root: "/",
  home: "/home",
  login: "/login",
  postDetail: (postId: string) => `/home/${postId}`,
  relatedReports: (postId: string) => `/related-reports/${postId}`,
} as const;
