import { notFound } from "next/navigation";

type Props = {
  params: {
    projectId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function ProjectPage({ params }: Props) {
  if (params.projectId != "123") {
    return notFound();
  }

  return <div>Project Page: {params.projectId}</div>;
}
