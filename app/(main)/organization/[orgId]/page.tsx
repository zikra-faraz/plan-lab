import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { OrganizationSlugType } from "@/types/Organization";
import { getOrganization } from "@/actions/Organization";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_components/project-list";
import UserIssues from "./_components/user-issues";
export default async function Organization({ params }: OrganizationSlugType) {
  const { orgId } = await params;
  const { userId } = await auth();
  const response = await getOrganization(orgId);
  if (!response) {
    return (
      <>
        <div>Organization not found</div>
      </>
    );
  }
  return (
    <>
      <div className="container  mx-auto px-4">
        <div className="mb-4 flex flex-col  sm:flex-row justify-between items-start">
          <div className=" backdrop-blur-xl bg-purple-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-3xl px-6 py-6  w-fit  flex justify-center items-center">
            <h1 className="text-4xl  font-bold  gradient-title ">
              {response?.name.charAt(0).toUpperCase() + response.name.slice(1)}
              &rsquo;s Projects
            </h1>
          </div>
          <OrgSwitcher />
        </div>

        <div className="mb-4">
          <ProjectList orgId={response.id} />
        </div>
        <div className="mt-8">
          <UserIssues userId={userId} />
        </div>
      </div>
    </>
  );
}
