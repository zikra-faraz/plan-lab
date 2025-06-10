import { getUserOrganization } from "@/actions/Organization";
import { redirect } from "next/navigation";
import CreateProject from "./CreateProject";
// import ProjectForm from "./_components/project-form";
export default async function CreateProjectPage() {
  const userOrg = await getUserOrganization();

  if (!userOrg || userOrg.role !== "ADMIN") {
    redirect("/onboarding"); // or show an error page
  }

  return <CreateProject orgId={userOrg.organization.id} />;
}
// "use client";
// import OrgSwitcher from "../../organization/[orgId]/_components/org-switcher";
// import { useOrganization, useUser } from "@clerk/nextjs";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { projectSchema } from "@/app/lib/validators";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { ProjectSchemaType } from "@/app/lib/validators";
// import { Button } from "@/components/ui/button";
// import useFetch from "@/hooks/useFetch";
// import { createProject } from "@/actions/Project";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Project } from "@prisma/client";

// const ProjectCreate = () => {
//   const router = useRouter();
//   const { isLoaded: isOrgLoaded, membership } = useOrganization();

//   const { isLoaded: isUserLoaded } = useUser();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(projectSchema),
//   });
//   useEffect(() => {
//     if (isOrgLoaded && isUserLoaded && membership) {
//       setIsAdmin(membership.role === "org:admin");
//     }
//   }, [isOrgLoaded, isUserLoaded, membership]);
//   const {
//     loading,
//     error,
//     data: project,
//     fn: createProjectFn,
//   } = useFetch<Project>(createProject, {} as Project);

//   // console.log(project);

//   if (!isOrgLoaded || !isUserLoaded) return null;
//   if (!isAdmin) {
//     return (
//       <div className="flex flex-col gap-2 items-center">
//         <span className="text-2xl gradient-title">
//           Oops! Only Admins can create projects.
//         </span>
//         <OrgSwitcher />
//       </div>
//     );
//   }

//   // form code

//   const onSubmit = async (data: ProjectSchemaType) => {
//     if (!isAdmin) {
//       alert("Only organization admins can create projects");
//       return;
//     }
//     try {
//       const newProject = await createProject(data);
//       toast.success("Project created successfully");
//       router.push(`/project/${newProject.id}`);
//     } catch (err: any) {
//       toast.error(err?.message || "Something went wrong");
//     }
//   };

//   return (
//     <>
//       <div className="max-w-4xl mx-auto py-10">
//         <div className="text-5xl text-center font-bold  gradient-title  mb-12">
//           Create New Project
//         </div>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="flex flex-col space-y-4"
//         >
//           <div>
//             <Input
//               id="name"
//               className="dark:bg-slate-950"
//               placeholder="Project Name"
//               {...register("name")}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//             )}
//           </div>
//           <div>
//             <Input
//               id="key"
//               {...register("key")}
//               className="dark:bg-slate-950"
//               placeholder="Project Key (Ex: RCYT)"
//             />
//             {errors.key && (
//               <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
//             )}
//           </div>
//           <div>
//             <Textarea
//               id="description"
//               {...register("description")}
//               className="dark:bg-slate-950 h-28"
//               placeholder="Project Description"
//             />
//             {errors.description && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>
//           <Button
//             type="submit"
//             size="lg"
//             disabled={loading}
//             className="bg-purple-600 text-white"
//           >
//             {loading ? "Creating..." : "Create Project"}
//           </Button>
//           {error && (
//             <p className="text-red-500 mt-2">
//               {error?.message || "Something went wrong"}
//             </p>
//           )}
//         </form>
//       </div>
//     </>
//   );
// };

// export default ProjectCreate;
