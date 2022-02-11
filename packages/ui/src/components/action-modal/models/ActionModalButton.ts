import { Colours } from '../../../models/Colours';
import { ButtonType } from '../../button/button.types';

export interface ActionModalButton {
  text: string;
  leadingIcon?: string;
  trailingIcon?: string;
  colour: Colours;
  textColour: Colours;
  type: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
}
