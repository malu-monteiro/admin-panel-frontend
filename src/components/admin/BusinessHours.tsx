import { useState, useEffect, useCallback } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { WorkingHours } from "@/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import API, { isAxiosError } from "@/lib/api/client";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export function BusinessHours() {
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

  const hourOptions = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

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

  return (
    <div>
      <Card className="p-4 w-full max-w-md">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                {" "}
                <Label className="text-sm font-medium">Opening Time</Label>
                <Select
                  value={workingHours?.startTime || ""}
                  onValueChange={(value) => handleChange("startTime", value)}
                >
                  <SelectTrigger className="w-full !bg-neutral-100">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">Closing Time</Label>
                <Select
                  value={workingHours?.endTime || ""}
                  onValueChange={(value) => handleChange("endTime", value)}
                >
                  <SelectTrigger className="w-full !bg-neutral-100">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                {workingHours?.startTime} - {workingHours?.endTime}
              </p>
              <p className="text-sm text-gray-500">Default Business Hours</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
