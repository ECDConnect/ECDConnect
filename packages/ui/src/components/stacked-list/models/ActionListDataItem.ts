import { ButtonType } from '../../button/button.types';
import { ListItem } from './ListItem';

export interface ActionListDataItem extends ListItem {
  actionName?: string;
  switchTextStyles?: boolean;
  actionIcon?: string;
  buttonType?: ButtonType;
  containerStyle?: string;
}
