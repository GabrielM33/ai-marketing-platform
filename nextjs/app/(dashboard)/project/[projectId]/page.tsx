import React from "react";
import ProjectNotFound from "./not-found";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  if (params.projectId != "123") {
    return <ProjectNotFound />;
  }

  return <div>Project Page: {params.projectId}</div>;
}
