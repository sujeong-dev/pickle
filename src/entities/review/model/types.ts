export type Review = {
  id: string;
  username: string;
  timeAgo: string;
  content: string;
  productName: string;
  rating: number;
  likeCount: number;
  commentCount: number;
};

export type ReviewItem = {
  name: string;
  price: string;
  rating: number;
  comment: string;
};
