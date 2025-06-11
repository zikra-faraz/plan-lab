// app/onboarding/page.tsx (Server Component)

import { getUserOrganization } from "@/actions/Organization";
import { redirect } from "next/navigation";
import OnboardingForm from "../OnboardingForm"; // Move your form to a client component

export default async function OnboardingPage() {
  const organization = await getUserOrganization();
  // console.log(organization);
  // console.log("hello");
  const isAdmin = organization?.role == "ADMIN";
  if (organization && isAdmin) {
    redirect(`/organization/${organization.organization.id}`);
  }

  return <OnboardingForm />;
}
