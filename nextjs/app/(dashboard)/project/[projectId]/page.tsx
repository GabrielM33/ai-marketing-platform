import ProjectDetailView from "@/components/ProjectDetailView";
import { getProject } from "@/server/queries";
import { notFound } from "next/navigation";

// Updated type definition for Next.js 15
type ProjectPageProps = {
  params: {
    projectId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  try {
    // In Next.js 15, fetch requests default to no-store unless specified
    const project = await getProject(params.projectId);

    if (!project) {
      notFound();
    }

    return (
      <div>
        <ProjectDetailView project={project} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    // You might want to throw a more specific error or render an error component
    throw error;
  }
}
