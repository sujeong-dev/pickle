import { GroupDetailPage } from "@/pages/group-detail";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <GroupDetailPage groupId={id} />;
}
