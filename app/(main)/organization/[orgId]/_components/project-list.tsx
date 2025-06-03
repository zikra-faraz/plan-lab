// components/ProjectList.jsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/Organization";
import DeleteProject from "./delete-project";

export default async function ProjectList({ orgId }: { orgId: string }) {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <p>
        No projects found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-200"
          href="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }

  return (
    <>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {project.name.toUpperCase()}
                  <DeleteProject projectId={project.id} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-md text-gray-500 mb-4">
                  {project.description}
                </p>
                <Link
                  href={`/project/${project.id}`}
                  className="px-3 py-2 border rounded-lg "
                >
                  View Project -&gt;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
