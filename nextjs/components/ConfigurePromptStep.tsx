"use client";

import React, { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";
import ConfigurePromptStepHeader from "@/components/ConfigurePromptStepHeader";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Prompt } from "@/db/schema";
import toast from "react-hot-toast";

interface ConfigurePromptStepProps {
  projectId: string;
}

function ConfigurePromptStep({ projectId }: ConfigurePromptStepProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isImportingTemplate, setIsImportingTemplate] = useState(false);
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);

  const router = useRouter();

  const handlePromptCreate = async () => {
    setIsCreatingPrompt(true);

    try {
      const response = await axios.post<Prompt>(
        `/api/projects/${projectId}/prompts`,
        {
          name: "New Prompt",
          prompt: "",
          order: prompts.length,
          tokenCount: 0,
        }
      );

      const newPrompt = response.data;
      setPrompts((prev) => [...prev, newPrompt]);

      router.push(`?tab=prompts&promptId=${newPrompt.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create prompt");
    } finally {
      setIsCreatingPrompt(false);
    }
  };

  return (
    <div>
      <ConfigurePromptStepHeader
        isCreatingPrompt={isCreatingPrompt}
        handlePromptCreate={handlePromptCreate}
        isImportingTemplate={isImportingTemplate}
      />
      {/* <PromptList /> */}
      {/* <ConfirmationModal /> */}
      {/* This is the modal that will be shown when the user tries to delete a prompt */}
      {/* <PromptContainerDialog /> */}
      {/** This is where the user can edit and save changes to a prompt */}
      {/* <TemplateSectionPopup /> */}
    </div>
  );
}

export default ConfigurePromptStep;
