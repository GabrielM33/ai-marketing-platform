"use client";

import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import ProjectStepHeader from "../upload-step/UploadStepHeader";

interface ProjectDetailBodyProps {
  steps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.LazyExoticComponent<React.ComponentType<any>>;
  }[];
  currentStep: number;
  projectId: string;
}

function ProjectDetailBody({
  steps,
  currentStep,
  projectId,
}: ProjectDetailBodyProps) {
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <Suspense fallback={<StepSkeleton />}>
      <ProjectStepHeader projectId={projectId} />
      <CurrentStepComponent projectId={projectId} />
    </Suspense>
  );
}

export default ProjectDetailBody;

const StepSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-4" />
    </div>
  );
};
