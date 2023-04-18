export interface PasswordResetRequestReceived {
  phoneNumber?: string;
  returnUrl?: string;
  errorMessage?: string;
  valid: boolean;
}
