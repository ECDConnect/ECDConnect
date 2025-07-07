export enum PasswordStrength {
  none = 0,
  error = 1,
  weak = 2,
  good = 3,
  veryGood = 4,
}

export interface PasswordStrengthMeterBar {
  index: number;
}
