"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ProjectSchemaType } from "@/app/lib/validators";
import { getUserOrganization } from "./Organization";

export async function createProject(data: ProjectSchemaType) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const userOrg = await getUserOrganization();

  if (!userOrg) {
    throw new Error("No Organization Selected");
  }

  if (userOrg.role !== "ADMIN") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: userOrg.organization.id,
      },
    });
    return project;
  } catch (error) {
    throw new Error(
      "Error creating project: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

export async function getProject(projectId: string) {
  // console.log(projectId);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const userOrg = await getUserOrganization();
  // Find user to verify existence
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get project with sprints and organization
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
  // console.log(project);

  if (!project) {
    throw new Error("Project not found");
  }

  // Verify project belongs to the organization
  if (project.organizationId !== userOrg?.organization.id) {
    return null;
  }

  return project;
}

export async function deleteProject(projectId: string) {
  const { userId } = await auth();
  const userOrg = await getUserOrganization();
  const orgId = userOrg?.organization.id;
  const orgRole = userOrg?.role;
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "ADMIN") {
    throw new Error("Only organization admins can delete projects");
  }
  const project = await db.project.findUnique({
    where: { id: projectId },
  });
  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }
  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}
