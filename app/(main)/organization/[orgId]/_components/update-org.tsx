"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteOrganization, updateOrganization } from "@/actions/Organization";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { Label } from "@/components/ui/label";
import { Organization } from "@/types/modelType";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  organization: Organization;
  isAdmin: boolean;
};
const UpdateOrg = ({ isOpen, onClose, organization, isAdmin }: Props) => {
  const [name, setName] = useState(organization.name);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);

  const router = useRouter();
  const {
    loading: updateLoading,
    error: updateError,
    fn: updateOrgFn,
    data: updated,
  } = useFetch(updateOrganization, null);
  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteOrgFn,
    data: deleteData,
  } = useFetch(deleteOrganization, null);
  const handleUpdate = async () => {
    try {
      updateOrgFn(organization.id, { name });
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to update org:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this organization?"
    );
    if (!confirmed) return;

    try {
      deleteOrgFn(organization.id);
      router.push("/"); // redirect to homepage
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Failed to delete org:", error);
    }
  };

  //   useEffect(() => {
  //     setName(organization.name); // reset on open
  //   }, [organization]);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Organization Name"
            />

            <Button
              onClick={handleUpdate}
              disabled={updateLoading}
              className="mr-2"
            >
              {updateLoading ? "Updating..." : "Update"}
            </Button>
            {isAdmin && (
              <Button
                onClick={handleDelete}
                variant="destructive"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Org"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default UpdateOrg;
//leave org
// ddelete org
// update org
//members user joined role aactions  invite search
