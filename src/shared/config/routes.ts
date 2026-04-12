export const ROUTES = {
  root: "/",
  home: "/home",
  login: "/login",
  report: "/report",
  postDetail: (postId: string) => `/home/${postId}`,
  relatedReports: (postId: string) => `/related-reports/${postId}`,
} as const;
