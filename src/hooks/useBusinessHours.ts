import { useState, useEffect, useCallback } from "react";

import { toast } from "sonner";

import { WorkingHours } from "@/types";

import API, { isAxiosError } from "@/lib/api/client";

export function useBusinessHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHours | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const { data } = await API.get("/availability/working-hours");
        setWorkingHours(data);
      } catch (error) {
        toast.error("Error loading Business Hours");
        console.error(error);
      }
    };
    fetchWorkingHours();
  }, []);

  const handleChange = useCallback(
    (field: keyof WorkingHours, value: string) => {
      setWorkingHours((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    []
  );

  const handleSave = async () => {
    if (!workingHours) return;
    try {
      const { data } = await API.post(
        "/availability/working-hours",
        workingHours
      );
      setWorkingHours(data);
      toast.success("Business Hours updated successfully!");
      setIsEditing(false);
    } catch (error) {
      let message = "Error updating time";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
        if (error.response?.data?.details) {
          message += `: ${error.response.data.details}`;
        }
      }
      toast.error(message);
      console.error("Complete error:", error);
    }
  };

  return {
    workingHours,
    isEditing,
    setIsEditing,
    handleChange,
    handleSave,
  };
}
