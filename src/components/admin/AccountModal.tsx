import { useState } from "react";
import { useForm } from "react-hook-form";

import { AccountModalProps } from "@/types";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import API, { isAxiosError } from "@/lib/api/client";

const accountSchema = z
  .object({
    name: z.string().min(1, "Required").optional(),
    email: z.string().email().optional(),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .optional()
      .refine((pass) => !pass || pass.length >= 6, "Minimum 6 characters"),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && !/(?=.*[A-Za-z])(?=.*\d)/.test(data.newPassword)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must contain letter and number",
        path: ["newPassword"],
      });
    }
    if (data.newPassword || data.confirmPassword) {
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required",
          path: ["currentPassword"],
        });
      }
    }
  });

type AccountFormData = z.infer<typeof accountSchema>;

export function AccountModal({
  user,
  open,
  onOpenChange,
  onUpdate,
}: AccountModalProps) {
  const [isUpdatingBasicInfo, setIsUpdatingBasicInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      ...user,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleBasicInfoUpdate = async (data: AccountFormData) => {
    setIsUpdatingBasicInfo(true);

    const payload: Record<string, string> = {};
    if (data.name && data.name !== user.name) payload.name = data.name;
    if (data.email && data.email !== user.email) payload.email = data.email;

    if (Object.keys(payload).length === 0) {
      toast("No changes to update");
      setIsUpdatingBasicInfo(false);
      return;
    }

    try {
      const response = await API.patch("/auth/update", payload);

      onUpdate({
        name: response.data.name || user.name,
        email: response.data.email || user.email,
      });

      if (response.data.requiresVerification) {
        toast.info("Verification email sent to new address");
        onOpenChange(false);
      } else {
        toast.success("Profile updated successfully");
        onOpenChange(false);
      }
    } catch (error) {
      let message = "Error updating data";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    } finally {
      setIsUpdatingBasicInfo(false);
    }
  };

  const handlePasswordUpdate = async (data: AccountFormData) => {
    setIsUpdatingPassword(true);

    try {
      await API.patch("/auth/update-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success("Password changed!");
      reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      let message = "Error changing password";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

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
              Change Password{" "}
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
