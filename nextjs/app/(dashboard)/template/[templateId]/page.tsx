import TemplateDetailView from "@/components/template-detail/TemplateDetailView";
import { getTemplate } from "@/server/queries";
import { notFound } from "next/navigation";
import React from "react";

export default async function TemplatePage(
  props: {
    params: Promise<{ templateId: string }>;
  }
) {
  const params = await props.params;
  const template = await getTemplate(params.templateId);

  if (!template) {
    return notFound();
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 mt-2">
      <TemplateDetailView template={template} />
    </div>
  );
}
