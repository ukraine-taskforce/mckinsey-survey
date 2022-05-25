import { CountryCode, validatePhoneNumberLength } from "libphonenumber-js";

export const isNullOrEmpty = (str: string) => !str || str?.trim().length === 0;
const phoneRegex = /^[ 0-9+-]*$/;

export const validatePhoneNumber = (value: string, countryCode: string) => {
  if (isNullOrEmpty(value) || value.length <= 4) {
    return { isInvalid: true, error: "REQUIRED" };
  }

  if (!phoneRegex.test(value)) {
    return { isInvalid: true, error: "INVALID_CHARS" };
  }

  if (countryCode) {
    const error = validatePhoneNumberLength(value, countryCode.toUpperCase() as CountryCode);
    if (error) return { isInvalid: true, error: error };
  }
  return { isInvalid: false };
};
