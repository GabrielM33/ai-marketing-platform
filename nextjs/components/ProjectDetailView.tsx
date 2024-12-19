"use client";

interface ProjectDetailViewProps {
  project: string;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return <div>{project}</div>;
}
