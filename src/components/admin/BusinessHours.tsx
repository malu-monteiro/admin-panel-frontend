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

import { hourOptions } from "@/utils/businessHours";

import { useBusinessHours } from "@/hooks/useBusinessHours";

export function BusinessHours() {
  const { workingHours, isEditing, setIsEditing, handleChange, handleSave } =
    useBusinessHours();

  return (
    <div>
      <Card className="p-4 w-full max-w-md">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
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
