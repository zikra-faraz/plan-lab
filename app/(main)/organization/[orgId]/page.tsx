import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getOrganization, getUserOrganization } from "@/actions/Organization";

import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
import { Button } from "@/components/ui/button";
import UpdateOrgModel from "./_components/update-org-model";
import { InviteMemberForm } from "./_components/invite-member";
import { useUser } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import InviteButton from "./_components/invite-button";

export default async function Organization({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const { userId } = await auth();
  const data = await checkUser();
  const response = await getOrganization(orgId);
  const userOrg = await getUserOrganization();
  const isAdmin = userOrg?.role == "ADMIN";
  // console.log(isAdmin);
  // console.log(data);

  if (!response) {
    return (
      <>
        <div>Organization not found</div>
      </>
    );
  }
  // if (!isAdmin) {
  //   redirect(`/`); // or `/dashboard` or `/not-allowed`
  // }
  return (
    <>
      <div className="container mt-5 mx-auto px-4">
        <div className="mb-4 flex flex-col  sm:flex-row justify-between items-start">
          <div className=" backdrop-blur-xl bg-purple-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-3xl px-6 py-6  w-fit  flex justify-center items-center">
            <h1 className="text-4xl  font-bold  gradient-title ">
              {response?.name.charAt(0).toUpperCase() + response.name.slice(1)}{" "}
              Organization
            </h1>
          </div>
          <div className="flex gap-2 ">
            <InviteButton response={response} data={data} isAdmin={isAdmin} />
            {/* <InviteButton /> */}
            <UpdateOrgModel organization={response} isAdmin={isAdmin} />
          </div>
        </div>

        <div className="mb-4 ">
          <ProjectList orgId={response.id} />
        </div>
        <div className="mt-8">
          <UserIssues userId={userId!} />
        </div>
      </div>
    </>
  );
}
