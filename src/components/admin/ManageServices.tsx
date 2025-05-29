import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { XIcon, Loader2Icon } from "lucide-react";

import { useManageServices } from "@/hooks/useManageServices";

import { ServiceFormData, serviceSchema } from "@/schemas/manageServicesSchema";

export function ManageServices() {
  const { register, handleSubmit, reset, formState } = useForm<ServiceFormData>(
    {
      resolver: zodResolver(serviceSchema),
    }
  );

  const {
    services,
    isDeleting,
    deletingServiceId,
    setDeletingServiceId,
    isLoading,
    onAddService,
    handleDeleteService,
  } = useManageServices(reset);

  return (
    <div>
      <Card className="p-4 mb-6 max-w-md">
        <form onSubmit={handleSubmit(onAddService)} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              {...register("name")}
              placeholder="New service name"
              error={formState.errors.name?.message}
              className="flex-1 min-w-0"
            />

            <Button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <ul className="border rounded divide-y">
            {services.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No services added
              </div>
            ) : (
              services.map((service) => (
                <li
                  key={service.id}
                  className="p-3 flex justify-between items-center"
                >
                  <span>{service.name}</span>

                  <AlertDialog
                    open={deletingServiceId === service.id}
                    onOpenChange={(open) =>
                      open
                        ? setDeletingServiceId(service.id)
                        : setDeletingServiceId(null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        className="hover:!bg-red-500"
                        aria-label="Delete service"
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === service.id}
                      >
                        {isDeleting === service.id ? (
                          <Loader2Icon className="w-5 h-5 animate-spin" />
                        ) : (
                          <XIcon className="w-5 h-5 text-white " />
                        )}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the service "
                          {service.name}" permanently?
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogAction
                          onClick={() => handleDeleteService(service.id)}
                        >
                          Confirm
                        </AlertDialogAction>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </li>
              ))
            )}
          </ul>
        )}
      </Card>
    </div>
  );
}
