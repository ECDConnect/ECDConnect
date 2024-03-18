import { ComponentType, SVGProps } from 'react';
import { Colours } from '@ecdlink/ui';

import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyCasual } from '@/assets/pollyCasual.svg';
import { MaxIndividualPointsPerMonth } from '@/constants/Community';

export function getIndividualPointsUIDetails(currentPoints: number): {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  mainColour: Colours;
  dashboardColour: Colours;
  backgroundColour: Colours;
} {
  const currentPointsPercentage =
    (currentPoints / MaxIndividualPointsPerMonth) * 100;

  if (currentPointsPercentage >= 80) {
    return {
      icon: PollyImpressed,
      mainColour: 'successMain',
      dashboardColour: 'successMain',
      backgroundColour: 'successBg',
    };
  }

  if (currentPointsPercentage >= 60) {
    return {
      icon: PollyHappy,
      mainColour: 'secondary',
      dashboardColour: 'successMain',
      backgroundColour: 'successBg',
    };
  }

  return {
    icon: PollyCasual,
    mainColour: 'alertMain',
    dashboardColour: 'alertMain',
    backgroundColour: 'alertBg',
  };
}
