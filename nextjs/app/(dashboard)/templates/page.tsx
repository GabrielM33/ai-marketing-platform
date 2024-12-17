import React from "react";

type Template = {
  name: string;
  description: string;
};

export default async function TemplatesPage() {
  const templatesPromise = new Promise<Template[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "template 1", description: "template 1 description" },
        { name: "template 2", description: "template 2 description" },
        { name: "template 3", description: "template 3 description" },
        { name: "template 4", description: "template 4 description" },
        { name: "template 5", description: "template 5 description" },
        { name: "template 6", description: "template 6 description" },
        { name: "template 7", description: "template 7 description" },
        { name: "template 8", description: "template 8 description" },
        { name: "template 9", description: "template 9 description" },
        { name: "template 10", description: "template 10 description" },
      ]);
    }, 3000);
  });
  const templates = await templatesPromise;

  return (
    <div>
      {templates.map((template) => (
        <div key={template.name}>{template.name}</div>
      ))}
    </div>
  );
}
