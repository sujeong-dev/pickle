import { ProductReviewsPage } from "@/pages/product-reviews";

type PageProps = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ productId?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { postId } = await params;
  const { productId } = await searchParams;
  return <ProductReviewsPage postId={postId} productId={productId ?? ''} />;
}
