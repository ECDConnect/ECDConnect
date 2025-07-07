export interface ListItem {
  id?: string;
  title: string;
  titleStyle?: string;
  subTitle?: string;
  subTitleStyle?: string;
  onActionClick?: () => void;
  hasMarkup?: boolean;
}
