"use client";

import React, { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import ConfigurePromptsStepHeader from "./ConfigurePromptStepHeader";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Prompt } from "@/db/schema";
import toast from "react-hot-toast";
import PromptList from "./PromptList";

interface ConfigurePromptsStepProps {
  projectId: string;
}

function ConfigurePromptsStep({ projectId }: ConfigurePromptsStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isImportingTemplate, setIsImportingTemplate] = useState(false);
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);

  console.log("DELETE PROMPT ID", deletePromptId);

  const router = useRouter();

  useEffect(() => {
    const fetchPrompts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Prompt[]>(
          `/api/projects/${projectId}/prompts`
        );
        setPrompts(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch prompts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [projectId]);

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

  const handlePromptDelete = async (promptId: string) => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/projects/${projectId}/prompts?promptId=${promptId}`
      );
      setPrompts((prev) => prev.filter((p) => p.id !== promptId));
      toast.success("Prompt deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
      setDeletePromptId(null);
    }
  };

  return (
    <div className="space-y-4 md:space-x-6">
      <ConfigurePromptsStepHeader
        isCreatingPrompt={isCreatingPrompt}
        handlePromptCreate={handlePromptCreate}
        isImportingTemplate={isImportingTemplate}
      />
      <PromptList
        prompts={prompts}
        isLoading={isLoading}
        setDeletePromptId={setDeletePromptId}
      />
      <ConfirmationModal
        isOpen={!!deletePromptId}
        onClose={() => setDeletePromptId(null)}
        title="Delete Prompt"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
        onConfirm={() => deletePromptId && handlePromptDelete(deletePromptId)}
        isLoading={isDeleting}
      />
      {/* This is the modal that will be shown when the user tries to delete a prompt */}
      {/* <PromptContainerDialog /> */}
      {/** This is where the user can edit and save changes to a prompt */}
      {/* <TemplateSectionPopup /> */}
    </div>
  );
}

export default ConfigurePromptsStep;
