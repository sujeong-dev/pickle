import Image from "next/image";
import { RelatedReportCard } from "@/entities/post";
import type { Post, Product } from "@/entities/post";
import { BackHeader } from "@/shared/ui";

type RelatedReportsPageProps = {
  product: Product & { imageUrl?: string };
  posts: Post[];
};

function ProductSummary({ product }: { product: RelatedReportsPageProps["product"] }) {
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

export function RelatedReportsPage({ product, posts }: RelatedReportsPageProps) {
  return (
    <div className="bg-white flex flex-col h-dvh">
      <BackHeader />
      <ProductSummary product={product} />
      <div className="flex flex-col gap-3 py-3 overflow-y-auto flex-1 min-h-0">
        {posts.map((post) => (
          <RelatedReportCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
