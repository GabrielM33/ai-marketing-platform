import { Button } from "@/components/ui/button";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button variant="default" size="default">
        Click me
      </Button>
      <Button variant="link" size="lg">
        Click me
      </Button>
      <Button variant="outline" size="lg">
        Click me
      </Button>
      <Button variant="secondary" size="sm">
        Click me
      </Button>
      <Button variant="ghost" size="lg">
        Click me
      </Button>
      <Button variant="destructive" size="icon">
        Hi
      </Button>
    </div>
  );
};

export default page;
