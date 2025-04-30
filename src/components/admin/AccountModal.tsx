import axios from "axios";

import { useForm } from "react-hook-form";

import { AccountModalProps } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const accountSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
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
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token not found");

      await axios.patch(
        "/auth/update",
        {
          name: data.name,
          email: data.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onUpdate({ email: data.email, name: data.name });
      toast.success("Data updated!");
    } catch {
      toast.error("Error updating data");
    }
  };

  const handlePasswordUpdate = async (data: AccountFormData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Token not found");

      await axios.patch(
        "/auth/update-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password changed!");
      reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Error changing password");
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
          <Input
            {...register("name")}
            placeholder="Name"
            error={errors.name?.message}
          />
          <Input
            {...register("email")}
            type="email"
            placeholder="Email"
            error={errors.email?.message}
          />
          <Button className="mt-4" type="submit">
            Save Changes
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
          <Button className="mt-4" type="submit">
            Change Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
