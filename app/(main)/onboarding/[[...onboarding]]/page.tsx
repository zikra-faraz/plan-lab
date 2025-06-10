// app/onboarding/page.tsx (Server Component)

import { getUserOrganization } from "@/actions/Organization";
import { redirect } from "next/navigation";
import OnboardingForm from "../OnboardingForm"; // Move your form to a client component

export default async function OnboardingPage() {
  const organization = await getUserOrganization();
  // console.log(organization);
  // console.log("hello");

  if (organization) {
    redirect(`/organization/${organization.organization.slug}`);
  }

  return <OnboardingForm />;
}
