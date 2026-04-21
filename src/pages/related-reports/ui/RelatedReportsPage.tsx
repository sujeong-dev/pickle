"use client";

import Image from "next/image";
import { RelatedReportCard } from "@/entities/post";
import type { Post } from "@/entities/post";
import { BackHeader } from "@/shared/ui";
import { useRelatedReports } from "../api/useRelatedReports";

type RelatedReportsPageProps = {
  branch?: string;
  productCode?: string;
};

function ProductSummary({ post }: { post: Post }) {
  const imageUrl = post.thumbnail;
  const displayDiscountRate = post.discountRate ?? (post.originalPrice ? Math.round((1 - post.price / post.originalPrice) * 100) : 0);
  return (
    <div className="bg-white flex gap-4 items-center px-5 py-3 shrink-0">
      {imageUrl ? (
        <div className="relative size-16 rounded-[6px] overflow-hidden shrink-0">
          <Image src={imageUrl} alt={post.productName} fill className="object-cover" />
        </div>
      ) : (
        <div className="size-16 rounded-[6px] bg-gray-200 shrink-0" />
      )}
      <div className="flex flex-col justify-between h-14 flex-1 min-w-0">
        <span className="font-bold text-h2 text-gray-900 truncate">{post.productName}</span>
        <div className="flex gap-2 items-baseline whitespace-nowrap">
          <span className="font-bold text-subtitle text-secondary-500">{displayDiscountRate}%</span>
          <span className="font-bold text-h2 text-gray-900">{post.price.toLocaleString()}원</span>
          <span className="text-subtitle text-gray-400 line-through">{(post.originalPrice ?? 0).toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}

function RelatedReportsSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-5 py-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}

export function RelatedReportsPage({ branch, productCode }: RelatedReportsPageProps) {
  const { data, isLoading, isError } = useRelatedReports({ branch, productCode });

  const posts = data?.items ?? [];
  const firstPost = posts[0];

  return (
    <div className="bg-white flex flex-col h-dvh">
      <BackHeader />
      {firstPost && <ProductSummary post={firstPost} />}
      {isLoading && <RelatedReportsSkeleton />}
      {isError && (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          <span className="text-body2 text-gray-500">관련 제보를 불러올 수 없어요.</span>
        </div>
      )}
      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col flex-1 items-center justify-center gap-2">
          <span className="text-body2 text-gray-500">관련 제보가 없어요.</span>
        </div>
      )}
      {!isLoading && !isError && posts.length > 0 && (
        <div className="flex flex-col gap-3 py-3 overflow-y-auto flex-1 min-h-0">
          {posts.map((post) => (
            <RelatedReportCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
