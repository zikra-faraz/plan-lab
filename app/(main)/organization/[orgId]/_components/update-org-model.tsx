"use client";
import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UpdateOrg from "./update-org";
import { ChevronDown } from "lucide-react";
import { Organization, UserOrganization } from "@/types/modelType";
type props = {
  organization: Organization;
  isAdmin: boolean;
};

const UpdateOrgModel = ({ organization, isAdmin }: props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  // if (!isLoaded || !isUserLoaded) {
  //   return null;
  // }
  return (
    <>
      <div className="flex justify-end mt-1">
        <SignedIn>
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="z-10"
          >
            {organization ? organization.name : "create organization"}
            <ChevronDown />
          </Button>
        </SignedIn>
        <UpdateOrg
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          organization={organization}
          isAdmin={isAdmin}
        ></UpdateOrg>

        {/* <SignedIn>
          <div className="border border-gray-300 dark:border-white/10  rounded-md px-5 py-2 ">
            <OrganizationSwitcher
              hidePersonal
              // @ts-ignore
              createOrganizationMode={
                (pathname === "/onboarding"
                  ? "navigation"
                  : "modal") as "navigation"
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
        </SignedIn> */}
      </div>
    </>
  );
};

export default UpdateOrgModel;
