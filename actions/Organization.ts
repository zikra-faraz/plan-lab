"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { slugify } from "@/app/lib/slugify";
export async function createOrganization(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found in database");
  }
  const slug = slugify(name);

  try {
    const org = await db.organization.create({
      data: {
        name,
        slug,
      },
    });
    await db.userOrganization.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: "ADMIN", // 👈 make creator an admin
      },
    });
    return org;
  } catch (error) {
    throw new Error(
      "Error creating organization: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
}

export async function updateOrganization(
  orgId: string,
  data: { name: string }
) {
  return await db.organization.update({
    where: { id: orgId },
    data,
  });
}
export async function deleteOrganization(orgId: string) {
  await db.organization.delete({
    where: { id: orgId },
  });
  return { success: true };
}

export const getUserOrganization = async () => {
  const { userId } = await auth();
  // console.log(userId);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Find user's membership

  // Find user with their organizations via userOrganization relation
  const userWithOrgs = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!userWithOrgs) {
    return null;
  }

  // If user has no organizations, return null
  if (!userWithOrgs.organizations || userWithOrgs.organizations.length === 0) {
    return null;
  }
  const adminOrg = userWithOrgs.organizations.find(
    (org) => org.role === "ADMIN"
  );
  if (adminOrg) {
    return adminOrg;
  } else if (userWithOrgs.organizations.length > 0) {
    return userWithOrgs.organizations[0];
  } else {
    return null; // no org found
  }
};

export async function getOrganization(slug: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Get user from your database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      organizations: {
        include: {
          organization: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // Check if user belongs to the organization with that slug
  const membership = user.organizations.find(
    (m) => m.organization.slug === slug
  );

  if (!membership) return null;

  return membership.organization;
}

// export async function getOrganization(slug: string) {
//   // first check user from clerk
//   const { userId } = await auth();
//   if (!userId) {
//     throw new Error("Unauthorized");
//   }
//   // then check user from database
//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }
//   // Get the organization details
//   // Get the organization details
//   const { organizations } = await clerkClient();
//   const organization = await organizations.getOrganization({ slug });

//   if (!organization) {
//     return null;
//   }
//   // Check if user belongs to this organization
//   const { data: membership } =
//     await organizations.getOrganizationMembershipList({
//       organizationId: organization.id,
//     });

//   const userMembership = membership.find(
//     (member) => member?.publicUserData?.userId === userId
//   );

//   // If user is not a member, return null
//   if (!userMembership) {
//     return null;
//   }

//   return organization;
// }

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

  const members = await db.userOrganization.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      user: true, // 👈 includes user data like name, email, etc.
    },
  });

  // Optionally transform the result to just user + role
  const users = members.map((member) => ({
    id: member.user.id,
    name: member.user.name,
    email: member.user.email,
    role: member.role,
  }));

  return users;
}
