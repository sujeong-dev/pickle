"use client";

import { PageHeader } from "@/shared/ui";
import { MyReportCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useMyPosts } from "@/features/my-reports";
import type { MyPost } from "@/shared/api";

function toPost(myPost: MyPost): Post {
  return {
    id: myPost.id,
    authorNickname: "",
    createdAt: myPost.createdAt,
    content: "",
    productName: myPost.productName,
    price: myPost.price,
    originalPrice: myPost.price,
    discountRate: myPost.discountRate,
    store: myPost.storeLocation,
    images: myPost.imageUrl ? [{ id: "", url: myPost.imageUrl, orderNum: 0 }] : [],
    reviewCount: 0,
    rating: 0,
    likeCount: myPost.likeCount,
    commentCount: 0,
  };
}

export function MyReportsPage() {
  const { data, isLoading } = useMyPosts();
  const posts = data?.data.map(toPost) ?? [];

  return (
    <div className="bg-gray-50 flex flex-col h-dvh">
      <PageHeader title="내 제보" />
      <div className="flex-1 overflow-y-auto min-h-0 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-400">불러오는 중...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-body1 text-gray-500">아직 제보한 내역이 없어요</p>
          </div>
        ) : (
          posts.map((post) => <MyReportCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
