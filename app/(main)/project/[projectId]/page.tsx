import { getProject } from "@/actions/Project";
import { notFound } from "next/navigation";
import SprintCreationForm from "../_components/sprint-create";
import SprintBoard from "../_components/sprint-board";
type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);
  // console.log(project);

  if (!project) {
    notFound();
  }
  return (
    <>
      <div className="mx-auto container">
        {/* sprint creation */}
        <SprintCreationForm
          projectTitle={project.name}
          projectId={projectId}
          projectKey={project.key}
          sprintKey={project.sprints?.length + 1}
        />
        {project.sprints.length > 0 ? (
          <>
            <SprintBoard
              sprints={project.sprints}
              projectId={projectId}
              orgId={project.organizationId}
            />
          </>
        ) : (
          <>
            <div>Create a Sprint from button above</div>
          </>
        )}
        {/* sprint board */}
      </div>
    </>
  );
}
