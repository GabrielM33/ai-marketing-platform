import ProjectDetailView from "@/components/ProjectDetailView";
import { getProject } from "@/server/queries";
import { notFound } from "next/navigation";

type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.projectId);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (!project) {
    return notFound();
  }

  return (
    <div>
      <ProjectDetailView project={project} />
    </div>
  );
}
