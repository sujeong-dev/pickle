import { RelatedReportsPage } from "@/pages/related-reports";

type PageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ branch?: string; productCode?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  await params;
  const { branch, productCode } = await searchParams;
  return <RelatedReportsPage branch={branch} productCode={productCode} />;
}
