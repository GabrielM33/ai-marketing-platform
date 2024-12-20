import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { Turtle } from "lucide-react";
function ProjectDetailHeader() {
  //TODO: create edit title functionality
  const [title, setTitle] = useState("project.title");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  //TODO: useState for title and edited title
  const handleTitleSubmit = () => {};
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  //TODO: save title to db fucntion

  //TODO: Create PUT/patch/post request endpoit for rpoject changes

  //TODO: create delete project functionality

  //TODO: create DELETE request endpoint for project deletion
  const handleDelete = () => {};

  if (isEditing) {
    return (
      <div>
        {/* Input */}
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            console.log(e.target.value);
          }}
        />
        {/* Action Buttons */}
        <div>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={() => setIsEditing(false)}>Save</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* if editing, show input field and save button // if not editing, show title and edit button */}
      <h1>{title}</h1>
      <div>
        <Button onClick={() => setIsEditing(true)}>Edit</Button>
        <Button onClick={() => setIsDeleting(true)}>Delete</Button>
      </div>
    </div>
  );
}
export default ProjectDetailHeader;
