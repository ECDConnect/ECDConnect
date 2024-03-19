import { ComponentType, SVGProps } from 'react';
import { Colours } from '@ecdlink/ui';

import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyCasual } from '@/assets/pollyCasual.svg';
import { MaxIndividualPoints } from '@/constants/Community';

export function getIndividualPointsUIDetails(
  currentPoints: number,
  type: 'month' | 'year'
): {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  mainColour: Colours;
  dashboardColour: Colours;
  backgroundColour: Colours;
  currentPointsPercentage: number;
} {
  const currentPointsPercentage =
    (currentPoints /
      MaxIndividualPoints[type === 'month' ? 'PerMonth' : 'PerYear']) *
    100;

  if (currentPointsPercentage >= 80) {
    return {
      currentPointsPercentage,
      icon: PollyImpressed,
      mainColour: 'successMain',
      dashboardColour: 'successMain',
      backgroundColour: 'successBg',
    };
  }

  if (currentPointsPercentage >= 60) {
    return {
      currentPointsPercentage,
      icon: PollyHappy,
      mainColour: 'secondary',
      dashboardColour: 'successMain',
      backgroundColour: 'successBg',
    };
  }

  return {
    currentPointsPercentage,
    icon: PollyCasual,
    mainColour: 'alertMain',
    dashboardColour: 'alertMain',
    backgroundColour: 'alertBg',
  };
}
