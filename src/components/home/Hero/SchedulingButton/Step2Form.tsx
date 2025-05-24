import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Step2Data } from "./schemas/schedulingSchemas";

interface Step2FormProps {
  form: UseFormReturn<Step2Data>;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Step2Form({
  form,
  loading,
  onBack,
  onSubmit,
  onPhoneChange,
}: Step2FormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <Input
          {...form.register("name")}
          placeholder="Your name"
          autoComplete="name"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone number</label>
        <Input
          {...form.register("phone")}
          placeholder="(00) 00000-0000"
          onChange={onPhoneChange}
          maxLength={15}
          autoComplete="tel"
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <Textarea
          {...form.register("message")}
          placeholder="Write a message to the service provider"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          disabled={loading || !form.formState.isValid}
        >
          {loading ? "Sending..." : "Confirm appointment"}
        </Button>
      </div>
    </form>
  );
}
