import React from "react";
import ConfirmationModal from "./ConfirmationModal";
import ConfigurePromptsStepHeader from "./ConfigurePromptsStepHeader";
import PromptList from "./PromptList";
import ConfirmationDialog from "../ConfirmationDialog";
import ConfigurePromptsForm from "./ConfigurePromptsForm";

function ConfigurePromptsStep() {
  return (
    <div>
      <ConfigurePromptsStepHeader />
      <PromptList />
      <ConfirmationModal />
      <ConfirmationDialog />
      <ConfigurePromptsForm />
    </div>
  );
}

export default ConfigurePromptsStep;
