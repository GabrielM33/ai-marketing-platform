import React from "react";
import ProjectNotFound from "./not-found";

interface PageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: PageProps) {
  if (params.projectId != "123") {
    return <ProjectNotFound />;
  }

  return <div>Project Page: {params.projectId}</div>;
}
