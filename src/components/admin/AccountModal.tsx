import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import axios from "axios";

import { useAuthContext } from "@/hooks/useAuthContext";
import { FormData, AccountModalProps } from "@/types";

export function AccountModal({
  user,
  open,
  onOpenChange,
  onUpdate,
}: AccountModalProps) {
  const { login } = useAuthContext();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: user,
  });

  const onSubmit = async (data: FormData) => {
    try {
      const isFirstLogin =
        localStorage.getItem("requiresEmailUpdate") === "true";
      const adminId = localStorage.getItem("tempAdminId");

      if (isFirstLogin && !adminId) {
        throw new Error("ID de administrador não encontrado");
      }

      const response = await axios.patch<{ token: string }>(
        isFirstLogin ? "/auth/confirm-email" : "/auth/update",
        isFirstLogin
          ? {
              adminId,
              newEmail: data.email,
              name: data.name,
            }
          : data
      );

      if (isFirstLogin) {
        localStorage.removeItem("requiresEmailUpdate");
        localStorage.removeItem("tempAdminId");
        localStorage.setItem("token", response.data.token);

        login(response.data.token, {
          name: data.name,
          email: data.email,
          avatar: "",
        });
      }

      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);

      onUpdate({ email: data.email, name: data.name });

      toast.success("Dados atualizados!");
      onOpenChange(false);
    } catch (error: unknown) {
      console.error("Erro na atualização:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao atualizar os dados"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Name" />
          <Input {...register("email")} type="email" placeholder="Email" />
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
