import React from "react";
import ProjectNotFound from "./not-found";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

async function getData() {
  // Explicitly set cache behavior
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache", // or 'no-store' for dynamic data
  });
  return res.json();
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const data = await getData();

  if (params.projectId != "123") {
    return <ProjectNotFound />;
  }

  return <div>Project Page: {params.projectId}</div>;
}
