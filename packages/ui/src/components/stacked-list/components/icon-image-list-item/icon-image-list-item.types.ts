import { Colours } from '../../../../models';

export interface IconImageListItemProps {
  title: string;
  icon: string;
  color: string;
  showDivider?: boolean;
  backgroundColor?: Colours;
  borderRadius?: string;
  onClick: () => void;
}
