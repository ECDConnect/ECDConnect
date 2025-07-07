import { Colours } from '../../../models';

export interface ActionSelectItem<T> {
  icon: JSX.Element;
  title: string;
  value: T;
  actionColour?: Colours;
}
