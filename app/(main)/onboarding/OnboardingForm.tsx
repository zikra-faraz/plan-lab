// app/onboarding/_components/onboarding-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrganization } from "@/actions/Organization";

const formSchema = z.object({
  name: z.string().min(2, "Organization name is required"),
});

export default function OnboardingForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const org = await createOrganization(values.name);
      toast.success("Organization created!");
      router.push(`/organization/${org.slug}`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Create an Organization
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Organization Name"
          className="dark:bg-slate-900"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-600 text-white"
        >
          {isSubmitting ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </div>
  );
}
