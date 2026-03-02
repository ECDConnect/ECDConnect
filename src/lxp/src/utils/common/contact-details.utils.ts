export const formatPhonenumberInternational = (phoneNumber: string) => {
  // sanitize
  let newNumber = phoneNumber.replaceAll(/[^0-9]/g, '');

  // too short for a phone number
  if (phoneNumber.length < 9) return false;

  // probably has a country code on the front?
  if (newNumber.length < 11) {
    if (newNumber.startsWith('+')) {
      return newNumber;
    }
    return '+' + newNumber;
  }

  // 082 1234567
  if (newNumber.startsWith('0')) {
    newNumber = newNumber.slice(1);

    return '+27' + newNumber;
  }

  // 270821234567
  // 27821234567
  if (newNumber.startsWith('27')) {
    return '+' + newNumber;
  }

  // +27769656891
  // +270769656891
  if (newNumber.startsWith('+')) {
    return newNumber;
  }

  return newNumber;
};

/**
 * Convert a South-African international phone number back to local format.
 *
 * Input examples:
 *   +27821234567  →  0821234567
 *   27821234567   →  0821234567
 *   +27012345678  →  012345678
 *
 * Returns: local number as string (starts with 0), or empty string if invalid.
 */
export const formatPhonenumberLocal = (phoneNumber: string): string => {
  // 1. Sanitize: keep only digits
  const digits = phoneNumber.replace(/[^0-9]/g, '');

  // 2. Must be at least 11 digits (27 + 9 local digits)
  if (digits.length < 11) return '';

  // 3. Must start with '27' (South Africa country code)
  if (!digits.startsWith('27')) return '';

  // 4. Extract the national significant number (NSN) — the part after '27'
  const nationalNumber = digits.slice(2);

  // 5. South African local numbers are 9 digits long (after dropping leading 0)
  //     So nationalNumber should be exactly 9 digits
  if (nationalNumber.length !== 9) return '';

  // 6. Reconstruct local number by prepending '0'
  const localNumber = '0' + nationalNumber;

  // Optional: Validate that it starts with a known SA area/mobile code
  // (Uncomment if you want stricter validation)
  /*
  const validPrefixes = /^(0[1-8][0-9]{7})$/; // Covers 01-08...
  if (!validPrefixes.test(localNumber)) return '';
  */

  return localNumber;
};
