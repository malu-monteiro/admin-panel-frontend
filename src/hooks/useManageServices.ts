import { useState, useEffect, useCallback } from "react";

import { toast } from "sonner";

import type { Service } from "@/types";

import API, { isAxiosError } from "@/lib/api/client";

import { ServiceFormData } from "@/schemas/manageServicesSchema";

export function useManageServices(reset: () => void) {
  const [services, setServices] = useState<Service[]>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { data } = await API.get<Service[]>("/availability/services");
        setServices(data ?? []);
      } catch (error) {
        toast.error("Failed to load services");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const onAddService = async ({ name }: ServiceFormData) => {
    try {
      const { data } = await API.post<Service>("/availability/services", {
        name: name.trim(),
      });
      setServices((prev) => [...prev, data]);
      reset();
      toast.success("Service added!");
    } catch (error) {
      let message = "Unknown error";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
      }
      toast.error(message);
    }
  };

  const handleDeleteService = useCallback(async (id: number) => {
    try {
      setIsDeleting(id);
      await API.delete(`/availability/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Service deleted successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          toast.error("Service not found");
          return;
        }
      }
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(null);
      setDeletingServiceId(null);
    }
  }, []);

  return {
    services,
    isDeleting,
    deletingServiceId,
    setDeletingServiceId,
    isLoading,
    onAddService,
    handleDeleteService,
  };
}
