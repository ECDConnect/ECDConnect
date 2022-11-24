export interface ComponentBaseProps {
  id?: string;
  className?: string;
  testId?: string;
  children?: React.ReactNode | React.ReactNode[] | null | undefined;
  onClick?: () => void;
  inputRef?: any;
}
