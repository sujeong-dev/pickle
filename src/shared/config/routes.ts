export const ROUTES = {
  root: '/',
  home: '/post',
  login: '/login',
  kakaoCallback: '/login/kakao/callback',
  naverCallback: '/login/naver/callback',
  signUp: '/sign-up',
  report: '/post/register',
  review: '/review',
  reviewDetail: (reviewId: string) => `/review/${reviewId}`,
  reviewWrite: '/review/register',
  postDetail: (postId: string) => `/post/${postId}`,
  postReviews: (postId: string, productId: string) => `/post/${postId}/reviews?productId=${productId}`,
  relatedReports: (postId: string, params?: { branch?: string; productCode?: string }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {}).filter((e): e is [string, string] => e[1] != null && e[1] !== '')
    ).toString();
    return `/product/${postId}/related${qs ? `?${qs}` : ''}`;
  },
  mypage: '/mypage',
  mypageMyReports: '/mypage/my-reports',
  mypageMyReceiptReviews: '/mypage/my-receipt-reviews',
  mypageWishlist: '/mypage/wishlist',
  mypageProfileEdit: '/mypage/profile-edit',
} as const;
