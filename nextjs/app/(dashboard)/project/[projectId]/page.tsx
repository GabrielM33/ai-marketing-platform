import ProjectDetailView from "@/components/project-detail/ProjectDetailView";
import { getProject } from "@/server/queries";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    return notFound();
  }

  return (
    <div className="mt-2">
      <ProjectDetailView project={project} />
    </div>
  );
}
