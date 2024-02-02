export interface ContactDialogProps {
  title?: string;
  subTitle?: string;
  firstName: string;
  phoneNumber: string;
  whatsAppNumber: string;
  onClose: () => void;
}
