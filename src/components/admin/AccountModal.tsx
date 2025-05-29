import type { AccountModalProps } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAccountForm } from "@/hooks/useAccountForm";

export function AccountModal({
  user,
  open,
  onOpenChange,
  onUpdate,
}: AccountModalProps) {
  const {
    register,
    handleSubmit,
    errors,
    isUpdatingBasicInfo,
    isUpdatingPassword,
    handleBasicInfoUpdate,
    handlePasswordUpdate,
  } = useAccountForm(user, onUpdate, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleBasicInfoUpdate)}
          className="space-y-4"
        >
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              You can change your name anytime
            </p>
            <Input
              {...register("name")}
              placeholder="Name"
              error={errors.name?.message}
            />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Changing email requires verification
            </p>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              error={errors.email?.message}
            />
          </div>

          <Button className="mt-4" type="submit" disabled={isUpdatingBasicInfo}>
            {isUpdatingBasicInfo ? "Saving..." : "Save Changes"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Change Password
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handlePasswordUpdate)}
          className="space-y-4"
        >
          <Input
            {...register("currentPassword")}
            type="password"
            placeholder="Current Password"
            error={errors.currentPassword?.message}
          />

          <Input
            {...register("newPassword")}
            type="password"
            placeholder="New Password"
            error={errors.newPassword?.message}
          />

          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            error={errors.confirmPassword?.message}
          />

          <Button className="mt-4" type="submit" disabled={isUpdatingPassword}>
            {isUpdatingPassword ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
