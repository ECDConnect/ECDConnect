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
