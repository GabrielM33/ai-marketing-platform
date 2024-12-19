"use client";

import ProjectDetailBody from "./project-detail/ProjectDetailBody";
import ProjectDetailHeader from "./project-detail/ProjectDetailHeader";
import ProjectDetailStepper from "./project-detail/ProjectDetailStepper";

interface ProjectDetailViewProps {
  project: string;
}

export default function ProjectDetailView({}: ProjectDetailViewProps) {
  return (
    <div>
      <ProjectDetailHeader />
      <ProjectDetailStepper />
      <ProjectDetailBody />
    </div>
  );
}
