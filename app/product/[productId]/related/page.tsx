import { RelatedReportsPage } from "@/pages/related-reports";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { productId } = await params;
  return <RelatedReportsPage productId={productId} />;
}
