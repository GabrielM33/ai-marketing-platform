import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getTimeAgo } from "@/utils/timeUtils";

export type Project = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects?.map((project) => (
        <Link key={project.id} href={`/project/${project.id}`}>
          <Card>
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              {project.description && (
                <CardDescription>{project.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500">
                Last updated: {getTimeAgo(new Date(project.updated_at))}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
