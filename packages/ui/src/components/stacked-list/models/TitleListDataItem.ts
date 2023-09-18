import { ChipConfig } from '../../status-chip/models/ChipStatus';

export interface TitleListDataItem {
  title?: string;
  description?: string;
  titleIcon?: string;
  titleIconClassName?: string;
  chipConfig?: ChipConfig;
  onActionClick: () => void;
  classNames?: string;
}
