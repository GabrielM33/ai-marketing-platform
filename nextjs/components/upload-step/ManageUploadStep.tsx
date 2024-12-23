"use client";

import React from "react";
import UploadStepHeader from "./UploadStepHeader";

interface ManageUploadStepProps {
  projectId: string;
}

export default function ManageUploadStep({ projectId }: ManageUploadStepProps) {
  return (
    <div>
      <UploadStepHeader projectId={projectId} />
    </div>
  );
}
