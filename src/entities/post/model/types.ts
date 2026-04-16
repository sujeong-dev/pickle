export type Author = {
  name: string;
  avatarUrl?: string;
  isVerified: boolean;
};

export type Product = {
  name: string;
  discountRate: number;
  originalPrice: number;
  currentPrice: number;
  imageUrl?: string;
};

export type Post = {
  id: string;
  author: Author;
  createdAt: string;
  content: string;
  product?: Product;
  reviewCount: number;
  rating: number;
  likeCount: number;
  commentCount: number;
  relatedPostCount: number;
  liked?: boolean;
  bookmarked?: boolean;
};

export type ReceiptReviewItem = {
  imageUrl?: string;
  rating: number;
};

export type ReceiptReview = {
  id: string;
  rating: number;
  createdAt: string;
  itemCount: number;
  totalAmount: number;
  items: ReceiptReviewItem[];
};
