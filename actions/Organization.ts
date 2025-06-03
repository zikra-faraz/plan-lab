"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
  // first check user from clerk
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  // then check user from database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }
  // Get the organization details
  // Get the organization details
  const { organizations } = await clerkClient();
  const organization = await organizations.getOrganization({ slug });

  if (!organization) {
    return null;
  }
  // Check if user belongs to this organization
  const { data: membership } =
    await organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member?.publicUserData?.userId === userId
  );

  // If user is not a member, return null
  if (!userMembership) {
    return null;
  }

  return organization;
}

export async function getProjects(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function getOrganizationUsers(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { organizations } = await clerkClient();

  const organizationMemberships =
    await organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships?.data?.map(
    (membership) => membership?.publicUserData?.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
