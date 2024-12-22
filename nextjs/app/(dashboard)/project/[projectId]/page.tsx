import ProjectDetailView from "@/components/ProjectDetailView";
import { getProject } from "@/server/queries";
import { notFound } from "next/dist/client/components/not-found";

type Params = Promise<{ projectId: string }>;

type ProjectPageProps = {
  params: Params;
};

export default async function ProjectPage(props: ProjectPageProps) {
  try {
    const params = await props.params;
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
    throw error;
  }
}
