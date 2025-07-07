import { ComponentBaseProps } from '../../models/ComponentBaseProps';
import { Colours } from '../../models/Colours';

export type ButtonType = 'filled' | 'outlined' | 'ghost';
export type ButtonShapeType = 'normal' | 'round' | 'fad';
export type ButtonSize = 'normal' | 'small' | 'large' | 'large-round';
export type ButtonBackgroundType = 'filled' | 'transparent';
export type ButtonIconPosition = 'start' | 'end';

export interface ButtonProps extends ComponentBaseProps {
  type: ButtonType;
  shape?: ButtonShapeType;
  disabled?: boolean;
  background?: ButtonBackgroundType;
  color: Colours;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: string;
  iconPosition?: 'start' | 'end';
  text?: string;
  textColor?: Colours;
  buttonType?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}
