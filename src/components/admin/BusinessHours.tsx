import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import API from "@/lib/api/client";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

export function BusinessHours() {
  const [workingHours, setWorkingHours] = useState<{
    startTime: string;
    endTime: string;
    isDefault?: boolean;
  } | null>(null);
  const [isEditingHours, setIsEditingHours] = useState(false);

  useEffect(() => {
    const loadWorkingHours = async () => {
      try {
        const response = await API.get("/api/working-hours");
        setWorkingHours({ ...response.data, isDefault: false });
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
        setWorkingHours({
          startTime: "08:00",
          endTime: "18:00",
          isDefault: true,
        });
      }
    };
    loadWorkingHours();
  }, []);

  const hours = useMemo(() => {
    if (!workingHours) return [];
    const [startHour] = workingHours.startTime.split(":").map(Number);
    const [endHour] = workingHours.endTime.split(":").map(Number);
    const timeSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return timeSlots;
  }, [workingHours]);

  const handleSaveWorkingHours = async () => {
    if (!workingHours) return;
    try {
      const response = await axios.post("/api/working-hours", {
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
      });
      setWorkingHours({ ...response.data, isDefault: false });
      alert("Horários atualizados com sucesso!");
      setIsEditingHours(false);
    } catch (error) {
      let errorMessage = "Erro ao atualizar horários";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
        if (error.response?.data?.details) {
          errorMessage += `: ${error.response.data.details}`;
        }
      }
      alert(errorMessage);
      console.error("Erro completo:", error);
    }
  };

  const generateHourOptions = () => {
    return [...Array(24)].map((_, i) => {
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
                {workingHours?.startTime || "08:00"} -{" "}
                {workingHours?.endTime || "18:00"}
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
