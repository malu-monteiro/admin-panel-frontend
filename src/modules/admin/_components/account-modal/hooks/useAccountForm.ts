import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import API, { isAxiosError } from "@/lib/api/client";

import {
  AccountFormData,
  accountSchema,
} from "@/modules/admin/_components/account-modal/schemas/accountSchema";

import type { AccountModalProps } from "@/types";

export function useAccountForm(
  user: AccountModalProps["user"],
  onUpdate: AccountModalProps["onUpdate"],
  onOpenChange: AccountModalProps["onOpenChange"]
) {
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

  const handleBasicInfoUpdate = useCallback(
    async (data: AccountFormData) => {
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
    },
    [user, onUpdate, onOpenChange]
  );

  const handlePasswordUpdate = useCallback(
    async (data: AccountFormData) => {
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
    },
    [reset]
  );

  return {
    register,
    handleSubmit,
    errors,
    reset,
    isUpdatingBasicInfo,
    isUpdatingPassword,
    handleBasicInfoUpdate,
    handlePasswordUpdate,
  };
}
