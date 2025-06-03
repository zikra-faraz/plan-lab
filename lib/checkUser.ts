import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
// access user from clerk and store it in database
export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  try {
    const existingUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    const name = `${user.firstName} ${user.lastName}`;
    const email = user.emailAddresses[0].emailAddress;
    const imageUrl = user.imageUrl;

    if (existingUser) {
      // 🔍 Check if any field has changed
      const hasChanges =
        existingUser.name !== name ||
        existingUser.email !== email ||
        existingUser.imageUrl !== imageUrl;

      if (hasChanges) {
        // ✨ Update only if something has changed
        const updatedUser = await db.user.update({
          where: {
            clerkUserId: user.id,
          },
          data: {
            name,
            email,
            imageUrl,
          },
        });
        return updatedUser;
      }

      // ✅ No changes, return as-is
      return existingUser;
    }
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
  }
};
