import { BannerWrapper } from '@ecdlink/ui';
import React from 'react';
import { OfflineCard } from '../offline-card/offline-card';

interface StepViewProps {
  title: string;
  isOnline?: boolean;
  showOfflineCard?: boolean;
  onClose?: () => void;
  activeStep: number;
  showStepCount?: boolean;
  onBack: () => void;
}
export const StepViewer: React.FC<StepViewProps> = ({
  activeStep,
  title,
  onBack,
  onClose,
  children,
  isOnline,
  showOfflineCard = true,
  showStepCount = true,
}) => {
  const childrenWithProps = React.Children.toArray(children);
  const activeChild = childrenWithProps?.find((child) => {
    const { stepKey } = (child as React.ReactElement).props;
    return stepKey === activeStep;
  });
  const { viewBannerWapper = false } = activeChild
    ? (activeChild as React.ReactElement).props
    : {};

  const getStepCount = (
    childrenWithProps: (
      | React.ReactChild
      | React.ReactFragment
      | React.ReactPortal
    )[]
  ) => {
    return childrenWithProps.filter((child) => {
      const { isIntermission } = (child as React.ReactElement).props;
      return !isIntermission;
    }).length;
  };

  return viewBannerWapper ? (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      title={title}
      subTitle={
        showStepCount
          ? `step ${activeStep} of ${getStepCount(childrenWithProps)}`
          : undefined
      }
      onBack={onBack}
      renderOverflow={true}
      backgroundColour={'uiBg'}
      onClose={onClose}
      displayOffline={!isOnline}
    >
      {isOnline || !showOfflineCard ? activeChild : <OfflineCard />}
    </BannerWrapper>
  ) : (
    <>{activeChild}</>
  );
};
