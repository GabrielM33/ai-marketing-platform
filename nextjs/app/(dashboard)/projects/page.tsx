import { Button } from "@/components/ui/button";
import { getProjectsForUser } from "@/server/queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { createProject } from "@/server/mutations";

type Project = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export default async function ProjectsPage() {
  const projects = (await getProjectsForUser()) as Project[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>
      <form action={createProject}>
        <Button type="submit">Create Project</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              {project.description && (
                <CardDescription>{project.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(project.updated_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects?.length === 0 && (
        <Card className="mt-8">
          <CardContent className="text-center py-6">
            <p className="text-gray-500">
              No projects found. Create your first project to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
