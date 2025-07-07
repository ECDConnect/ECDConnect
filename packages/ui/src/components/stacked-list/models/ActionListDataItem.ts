import { Colours } from '../../../models';
import { ButtonType } from '../../button/button.types';
import { ListItem } from './ListItem';

export interface ActionListDataItem extends ListItem {
  actionName?: string;
  switchTextStyles?: boolean;
  hasMarkup?: boolean;
  actionIcon?: string;
  buttonType?: ButtonType;
  containerStyle?: string;
  id?: string;
  buttonColor?: Colours | undefined;
  textColor?: Colours | undefined;
}
