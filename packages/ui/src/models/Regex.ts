export const SA_ID_REGEX =
  /(((\d{2}((0[13578]|1[02])(0[1-9]|[12]\d|3[01])|(0[13456789]|1[012])(0[1-9]|[12]\d|30)|02(0[1-9]|1\d|2[0-8])))|([02468][048]|[13579][26])0229))(( |-)(\d{4})( |-)(\d{3})|(\d{7}))$/;
export const SA_PASSPORT_REGEX = /\w/;
export const SA_CELL_REGEX =
  /^((?:\+27|27)|0)(=72|71|82|73|83|74|84|61|62|63|64)(\d{7})$/;
export const SIX_DIGITS = /^\d{6}/;
export const URL =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
export const containsLowerCaseRegex = new RegExp('^(?=.*[a-z]).+$');
export const containsUpperCaseRegex = new RegExp('^(?=.*[A-Z]).+$');
export const containsNumericRegex = new RegExp('^(?=.*\\d).+$');
export const containsSpecialCharactersRegex = new RegExp(
  '^(?=.*[-+_!@#$%^&*., ?]).+$'
);
