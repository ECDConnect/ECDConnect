export interface HelpFormModel {
  subject: string;
  description?: string;
  contactPreference?: string;
  cellNumber?: string;
  email?: string;
  isLoggedIn?: boolean;
  userId?: string | null;
}
