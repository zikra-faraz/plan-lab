"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { IssueStatus, IssuePriority } from "@prisma/client";
import { getUserOrganization } from "./Organization";

type CreateIssueData = {
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  sprintId?: string;
  assigneeId?: string;
};
type UpdateIssueInput = {
  id: string;
  status: IssueStatus;
  order: number;
};
type UpdateIssueData = {
  status: IssueStatus;
  priority: IssuePriority;
};
export async function createIssue(projectId: string, data: CreateIssueData) {
  const { userId } = await auth();
  const dataOrg = await getUserOrganization();
  const orgId = dataOrg?.organizationId;
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  let user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    throw new Error("User not found");
  }
  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });
  const newOrder = lastIssue ? lastIssue.order + 1 : 0;
  const issue = await db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId: projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId || null, // Add this line
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
    // to get not only id but tthe whole data of assignee and reporter
    //Asignee - The person responsible for the task.
    // reporter - 	Person who created the issue.
  });

  return issue;
}
export async function getIssuesForSprint(sprintId: string) {
  const { userId } = await auth();
  const data = await getUserOrganization();
  const orgId = data?.organizationId;
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}
//In Prisma, db.$transaction() is used to run multiple database operations as a single atomic unit.
// That means either:

// All operations succeed and are saved to the database.

// Or any one fails, and everything is rolled back (like nothing ever happened).
export async function updateIssueOrder(updatedIssues: UpdateIssueInput[]) {
  const { userId } = await auth();
  const data = await getUserOrganization();
  const orgId = data?.organizationId;
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Start a transaction
  await db.$transaction(async (prisma) => {
    // Update each issue
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });

  return { success: true };
}

export async function deleteIssue(issueId: string) {
  const { userId } = await auth();
  const data = await getUserOrganization();
  const orgId = data?.organizationId;
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.reporterId !== user.id) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({ where: { id: issueId } });

  return { success: true };
}

export async function updateIssue(issueId: string, data: UpdateIssueData) {
  const { userId } = await auth();
  const dataOrg = await getUserOrganization();
  const orgId = dataOrg?.organizationId;
  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status,
        priority: data.priority,
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error updating issue: " + error.message);
    }
    throw new Error("Unknown error occurred");
  }
}

export async function getUserIssues(userId: string) {
  const data = await getUserOrganization();
  const orgId = data?.organizationId;
  if (!userId || !orgId) {
    throw new Error("No user id or organization id found");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { reporterId: user.id }],
      project: {
        organizationId: orgId,
      },
    },
    include: {
      project: true,
      assignee: true,
      reporter: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return issues;
}
