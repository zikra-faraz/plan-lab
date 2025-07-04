// components/ProjectList.jsx
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getProjects } from "@/actions/Organization";
import DeleteProject from "./delete-project";

export default async function ProjectList({ orgId }: { orgId: string }) {
  const projects = await getProjects(orgId);

  if (projects.length === 0) {
    return (
      <div className="ml-3 mt-4">
        <Link
          className="px-3 py-2 border rounded bg-purple-600 text-white "
          href="/project/create"
        >
          Create New Project
        </Link>
      </div>
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
