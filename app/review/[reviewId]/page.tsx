import { ReviewDetailPage } from "@/pages/review-detail";

type Props = {
  params: Promise<{ reviewId: string }>;
};

export default async function Page({ params }: Props) {
  const { reviewId } = await params;
  return <ReviewDetailPage reviewId={reviewId} />;
}
