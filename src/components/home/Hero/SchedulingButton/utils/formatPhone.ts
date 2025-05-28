export function formatPhoneNumber(value: string): string {
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
