export interface ListItem {
  title: string;
  titleStyle?: string;
  subTitle?: string;
  subTitleStyle?: string;
  onActionClick?: () => void;
}
