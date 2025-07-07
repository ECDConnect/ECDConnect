import { ComponentBaseProps } from '@ecdlink/ui';

export interface StepProps extends ComponentBaseProps {
  stepKey: number;
  viewBannerWapper: boolean;
  isIntermission?: boolean;
  children: React.ReactNode;
}

export const Step: React.FC<StepProps> = ({ children }) => {
  return <>{children}</>;
};
