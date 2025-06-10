"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { projectSchema, ProjectSchemaType } from "@/app/lib/validators";
import { createProject } from "@/actions/Project";
import useFetch from "@/hooks/useFetch";

const CreateProject = ({ orgId }: { orgId: string }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
  });

  const {
    loading: createLoading,
    error: createError,
    fn: createProjectFn,
    data: created,
  } = useFetch(createProject, null);

  const onSubmit = async (data: ProjectSchemaType) => {
    try {
      await createProjectFn(data);

      if (!createLoading && created) {
        toast.success("Project created!");
        router.push(`/project/${created?.id}`);
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  //   console.log(created);

  if (!orgId) {
    return null;
  }
  return (
    <>
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Create a Project
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register("name")}
            placeholder="Project Name"
            className="dark:bg-slate-900"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <Input
            {...register("key")}
            placeholder="Project Key (e.g., CHAT)"
            className="dark:bg-slate-900"
          />
          {errors.key && (
            <p className="text-red-500 text-sm">{errors.key.message}</p>
          )}

          <Textarea
            {...register("description")}
            placeholder="Project Description"
            className="dark:bg-slate-900 h-28"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-600 text-white"
          >
            {createLoading ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
