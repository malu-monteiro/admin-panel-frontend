import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";

import API, { isAxiosError } from "@/lib/api/client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";

import { Service } from "@/types";
import { XIcon, Loader2Icon } from "lucide-react";

const serviceSchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/,
      "Invalid characters (allowed: letters, numbers, spaces, hyphens)"
    ),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await API.get<Service[]>("/availability/services");

        if (response.data) {
          setServices(response.data);
        }
      } catch (error) {
        let message = "Failed to load services";
        if (isAxiosError(error)) {
          message = error.response?.data?.error || message;
        }
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleAddService = handleSubmit(async (formData: ServiceFormData) => {
    try {
      const response = await API.post<Service>("/availability/services", {
        name: formData.name.trim(),
      });

      if (response.data) {
        setServices((prevServices) => [...prevServices, response.data]);
        reset();
        toast.success("Service added!");
      }
    } catch (error) {
      let message = "Unknown error";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    }
  });

  const handleDeleteService = useCallback(
    async (id: number) => {
      try {
        setIsDeleting(id);
        await API.delete(`/availability/services/${id}`);
        setServices(services.filter((s) => s.id !== id));

        toast.success("Service deleted successfully");
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            toast.error("Service not found");
            return;
          }
        }
        toast.error("Failed to delete service");
      }
    },
    [services]
  );

  return (
    <div>
      <Card className="p-4 mb-6 max-w-md">
        <form onSubmit={handleAddService} className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              {...register("name")}
              placeholder="New service name"
              error={errors.name?.message}
              className="flex-1 min-w-0"
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
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
                    open={deleteDialogOpen === service.id}
                    onOpenChange={(open) =>
                      open
                        ? setDeleteDialogOpen(service.id)
                        : setDeleteDialogOpen(null)
                    }
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        aria-label="Delete service"
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === service.id}
                      >
                        {isDeleting === service.id ? (
                          <Loader2Icon className="w-5 h-5 animate-spin" />
                        ) : (
                          <XIcon className="w-5 h-5 text-white" />
                        )}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the service "
                          {service.name}"? This action cannot be undone.
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
