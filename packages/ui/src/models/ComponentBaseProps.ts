export interface ComponentBaseProps {
  id?: string;
  className?: string;
  testId?: string;
  onClick?: () => void;
  inputRef?: any;
  style?: React.CSSProperties;
}
