"use client";
import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  if (!isLoaded || !isUserLoaded) {
    return null;
  }
  return (
    <>
      <div className="flex justify-end mt-1">
        <SignedIn>
          <div className="border border-gray-300 dark:border-white/10  rounded-md px-5 py-2 ">
            <OrganizationSwitcher
              hidePersonal
              // @ts-ignore
              createOrganizationMode={
                pathname === "/onboarding" ? "navigation" : "modal"
              }
              afterCreateOrganizationUrl="/organization/:slug"
              afterSelectOrganizationUrl="/organization/:slug"
              createOrganizationUrl="/onboarding"
              appearance={{
                elements: {
                  organizationSwitcherTriggerIcon: "text-purple-600",
                  organizationPreviewTextContainer:
                    "text-lg dark:text-white text-black",
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </>
  );
};

export default OrgSwitcher;
