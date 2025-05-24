import { UseFormSetValue } from "react-hook-form";
import { Step2Data } from "../schemas/schedulingSchemas";

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  let formattedValue = "";

  if (digits.length > 0) {
    formattedValue = `(${digits.substring(0, 2)}`;
    if (digits.length > 2) {
      formattedValue += `) ${digits.substring(2, 7)}`;
      if (digits.length > 7) {
        formattedValue += `-${digits.substring(7, 11)}`;
      }
    }
  }

  return formattedValue;
}

export const handlePhoneChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: UseFormSetValue<Step2Data>
) => {
  const formattedValue = formatPhone(e.target.value);
  setValue("phone", formattedValue, { shouldValidate: true });
};
