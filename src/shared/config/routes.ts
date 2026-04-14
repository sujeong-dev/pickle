export const ROUTES = {
  root: "/",
  home: "/home",
  login: "/login",
  report: "/report",
  review: "/review",
  reviewDetail: (reviewId: string) => `/review/${reviewId}`,
  reviewWrite: "/review/write",
  postDetail: (postId: string) => `/home/${postId}`,
  relatedReports: (postId: string) => `/related-reports/${postId}`,
} as const;
