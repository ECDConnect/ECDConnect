import { ChipConfig } from '../../status-chip/models/ChipStatus';

export interface TitleListDataItem {
  title?: string;
  titleIcon?: string;
  titleIconClassName?: string;
  chipConfig?: ChipConfig;
  onActionClick: () => void;
}
