"use client";

import { deleteProject } from "@/actions/Project";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { useOrganization } from "@clerk/nextjs";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeleteProject({ projectId }: { projectId: string }) {
  const { membership } = useOrganization();
  const router = useRouter();
  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch(deleteProject, { success: false });
  const isAdmin = membership?.role === "org:admin";
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn(projectId);
    }
  };
  useEffect(() => {
    if (deleted) {
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  if (!isAdmin) return null;
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-5 w-5 " />
      </Button>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
}
