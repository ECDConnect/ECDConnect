import { Colours } from '../../../models/Colours';
import { ButtonType } from '../../button/button.types';
import { TypographyType } from '../../typography/models/TypographyTypes';

export interface ActionModalButton {
  text: string;
  textType?: TypographyType;
  textClassName?: string;
  leadingIcon?: string;
  trailingIcon?: string;
  colour: Colours;
  textColour: Colours;
  type: ButtonType;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}
