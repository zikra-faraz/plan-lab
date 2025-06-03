"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BarLoader } from "react-spinners";
export default function Onboarding() {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();
  // const [isRedirecting, setIsRedirecting] = useState(false);
  useEffect(() => {
    if (organization) {
      // setIsRedirecting(true);
      router.push(`/organization/${organization.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);
  // 🌀 Show spinner while redirecting
  // if (isRedirecting) {
  //   return <BarLoader className="mb-4" width={"100%"} color="#9333ea" />;
  // }
  if (isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#9333ea" />;
  }

  return (
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
}
