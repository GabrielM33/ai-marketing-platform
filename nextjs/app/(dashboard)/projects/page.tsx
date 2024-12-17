import React from "react";

type Project = {
  name: string;
  description: string;
};

export default async function ProjectsPage() {
  const projectsPromise = new Promise<Project[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Project 1", description: "Project 1 description" },
        { name: "Project 2", description: "Project 2 description" },
        { name: "Project 3", description: "Project 3 description" },
        { name: "Project 4", description: "Project 4 description" },
        { name: "Project 5", description: "Project 5 description" },
        { name: "Project 6", description: "Project 6 description" },
        { name: "Project 7", description: "Project 7 description" },
        { name: "Project 8", description: "Project 8 description" },
        { name: "Project 9", description: "Project 9 description" },
        { name: "Project 10", description: "Project 10 description" },
      ]);
    }, 3000);
  });
  const projects = await projectsPromise;

  return (
    <div>
      {projects.map((project) => (
        <div key={project.name}>{project.name}</div>
      ))}
    </div>
  );
}
