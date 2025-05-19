import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState, useEffect } from "react";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import API, { isAxiosError } from "@/lib/api/client";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export function BusinessHours() {
  const [workingHours, setWorkingHours] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);
  const [isEditingHours, setIsEditingHours] = useState(false);

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        const { data } = await API.get("/availability/working-hours");
        setWorkingHours(data);
      } catch (error) {
        toast.error("Error loading hours");
        console.error(error);
      }
    };
    loadWorkingHours();
  }, []);

  const handleSaveWorkingHours = async () => {
    if (!workingHours) return;
    try {
      const response = await API.post("/availability/working-hours", {
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
      });
      setWorkingHours(response.data);
      toast.success("Working hours updated successfully!");
      setIsEditingHours(false);
    } catch (error) {
      let message = "Error updating working hours";
      if (isAxiosError(error)) {
        message = error.response?.data?.error || message;
        if (error.response?.data?.details) {
          message += `: ${error.response.data.details}`;
        }
      }
      toast.error(message);
      console.error("Full error:", error);
    }
  };

  const generateHourOptions = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0");
      return `${hour}:00`;
    });
  };

  return (
    <div>
      <Card className="p-4 w-full max-w-md">
        {isEditingHours ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                {" "}
                <Label className="text-sm font-medium">Opening Time</Label>
                <Select
                  value={workingHours?.startTime || ""}
                  onValueChange={(value) =>
                    setWorkingHours((prev) =>
                      prev ? { ...prev, startTime: value } : null
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateHourOptions().map((time) => (
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
                  onValueChange={(value) =>
                    setWorkingHours((prev) =>
                      prev ? { ...prev, endTime: value } : null
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateHourOptions().map((time) => (
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
                onClick={() => setIsEditingHours(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveWorkingHours}>
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
              onClick={() => setIsEditingHours(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
