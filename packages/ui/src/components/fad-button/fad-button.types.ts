import { ButtonProps, ButtonSize, ButtonType } from '../button/button.types';

export interface FADButtonProps extends ButtonProps {
  title: string;
  icon: string;
  textToggle: boolean;
  iconDirection: string;
  click: () => void;
  children?: React.ReactNode;
}
