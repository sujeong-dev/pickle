import { PostDetailPage } from "@/pages/post-detail";

type PageProps = {
  params: Promise<{ postId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { postId } = await params;
  return <PostDetailPage postId={postId} />;
}
