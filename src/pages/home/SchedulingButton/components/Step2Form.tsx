import { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Step2Data } from "../schemas/schedulingSchemas";

type Step2FormProps = {
  step2Form: UseFormReturn<Step2Data>;
  handleStep2Submit: (data: Step2Data) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setStep: (step: 1 | 2) => void;
  loading: boolean;
};

export function Step2Form({
  step2Form,
  handleStep2Submit,
  handlePhoneChange,
  setStep,
  loading,
}: Step2FormProps) {
  return (
    <form
      onSubmit={step2Form.handleSubmit(handleStep2Submit)}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <Input {...step2Form.register("name")} placeholder="Your name" />
        {step2Form.formState.errors.name && (
          <p className="text-sm text-red-500 mt-1">
            {step2Form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone number</label>
        <Input
          {...step2Form.register("phone")}
          placeholder="(00) 00000-0000"
          onChange={handlePhoneChange}
          maxLength={15}
        />
        {step2Form.formState.errors.phone && (
          <p className="text-sm text-red-500 mt-1">
            {step2Form.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <Textarea
          {...step2Form.register("message")}
          placeholder="Write a message to the service provider"
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-500 hover:bg-blue-600"
          disabled={loading || !step2Form.formState.isValid}
        >
          {loading ? "Sending..." : "Confirm appointment"}
        </Button>
      </div>
    </form>
  );
}
