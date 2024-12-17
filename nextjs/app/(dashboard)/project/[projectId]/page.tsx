import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;

  if (resolvedParams.projectId != "123") {
    return notFound();
  }

  return <div>Project Page: {resolvedParams.projectId}</div>;
}
