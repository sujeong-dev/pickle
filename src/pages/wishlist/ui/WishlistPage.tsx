"use client";

import { PageHeader } from "@/shared/ui";
import { SavedDealCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useMyBookmarks } from "@/features/wishlist";
import type { MyBookmark } from "@/shared/api";

function toPost(bookmark: MyBookmark): Post {
  return {
    id: bookmark.id,
    author: { name: bookmark.author.nickname, isVerified: false },
    createdAt: bookmark.createdAt,
    content: '',
    product: {
      name: bookmark.productName,
      discountRate: bookmark.discountRate,
      originalPrice: bookmark.originalPrice,
      currentPrice: bookmark.price,
      imageUrl: bookmark.imageUrl,
    },
    reviewCount: 0,
    rating: 0,
    likeCount: 0,
    commentCount: 0,
    relatedPostCount: 0,
  };
}

export function WishlistPage() {
  const { data, isLoading } = useMyBookmarks();
  const posts = data?.data.map(toPost) ?? [];

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <PageHeader title="찜한 제보" />
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-400">불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-500">아직 찜한 제보가 없어요</p>
          </div>
        ) : (
          posts.map((post) => <SavedDealCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
