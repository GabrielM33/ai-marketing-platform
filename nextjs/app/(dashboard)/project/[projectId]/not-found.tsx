import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectNotFound() {
  // TODO: add in asset for not found and redirect to dashboard

  return (
    <div>
      <h1>Project Not Found</h1>
      <p>The project you are looking for does not exist.</p>
      <Link href="/projects">
        <Button>Go to Projects</Button>
      </Link>
    </div>
  );
}
