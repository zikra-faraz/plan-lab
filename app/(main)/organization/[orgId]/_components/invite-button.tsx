"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InviteMemberModal from "./invite-modal";

export default function InviteButton({ response, data, isAdmin }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end items-center gap-2 mb-4 mt-1">
        {isAdmin && (
          <Button onClick={() => setIsDialogOpen(true)}>Invite Member</Button>
        )}
      </div>

      <InviteMemberModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        organizationId={response.id}
        inviterName={data?.name}
      />
    </>
  );
}
