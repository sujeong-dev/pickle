import { GroupEditPage } from "@/pages/group-edit";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <GroupEditPage groupId={id} />;
}
