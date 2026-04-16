"use client";

import Image from "next/image";
import { RelatedReportCard } from "@/entities/post";
import type { Product } from "@/entities/post";
import { BackHeader } from "@/shared/ui";
import { useRelatedReports } from "../api/useRelatedReports";

type RelatedReportsPageProps = {
  productId: string;
};

function ProductSummary({ product }: { product: Product & { imageUrl?: string } }) {
  return (
    <div className="bg-white flex gap-4 items-center px-5 py-3 shrink-0">
      {product.imageUrl ? (
        <div className="relative size-16 rounded-[6px] overflow-hidden shrink-0">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="size-16 rounded-[6px] bg-gray-200 shrink-0" />
      )}
      <div className="flex flex-col justify-between h-14 flex-1 min-w-0">
        <span className="font-bold text-h2 text-gray-900 truncate">{product.name}</span>
        <div className="flex gap-2 items-baseline whitespace-nowrap">
          <span className="font-bold text-subtitle text-secondary-500">{product.discountRate}%</span>
          <span className="font-bold text-h2 text-gray-900">{product.currentPrice.toLocaleString()}원</span>
          <span className="text-subtitle text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>
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

export function RelatedReportsPage({ productId }: RelatedReportsPageProps) {
  const { data, isLoading, isError } = useRelatedReports(productId);

  const posts = data?.data ?? [];
  // Use the first post's product info for the header summary
  const product = posts[0]?.product;

  return (
    <div className="bg-white flex flex-col h-dvh">
      <BackHeader />
      {product && <ProductSummary product={product} />}
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
