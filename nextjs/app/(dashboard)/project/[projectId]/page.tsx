import { notFound } from "next/navigation";

type Props = {
  params: {
    projectId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  const projects = ["123", "456", "789"];

  return projects.map((projectId) => ({
    projectId: projectId,
  }));
}

export default async function ProjectPage({ params }: Props) {
  if (params.projectId != "123") {
    return notFound();
  }

  return <div>Project Page: {params.projectId}</div>;
}
