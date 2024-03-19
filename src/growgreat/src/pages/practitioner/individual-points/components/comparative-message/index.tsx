import { Alert, AlertProps } from '@ecdlink/ui';
import { useMemo } from 'react';

import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyCasual } from '@/assets/pollyCasual.svg';
import { useSelector } from 'react-redux';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { getHealthCareWorkerTotalPointsSelector } from '@/store/healthCareWorker/healthCareWorker.selectors';
import { MaxIndividualPoints } from '@/constants/Community';
import { userSelectors } from '@/store/user';

export const ComparativeMessage = () => {
  const user = useSelector(userSelectors.getUser);
  const totalPoints = useSelector(getHealthCareWorkerTotalPointsSelector);
  const standing = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTeamStandingSelector
  );

  const firstName = user?.firstName ?? 'CHW';

  const percentageScore = (totalPoints / MaxIndividualPoints.PerYear) * 100;

  const percentageMembersWithFewerPointsForCurrentYear =
    standing?.percentageMembersWithFewerPointsForCurrentYear ?? 0;
  const percentageMembersWithMorePointsForCurrentYear =
    standing?.percentageMembersWithMorePointsForCurrentYear ?? 0;

  const isComparativeMessageA =
    percentageMembersWithFewerPointsForCurrentYear === 100;
  const isComparativeMessageB =
    percentageMembersWithFewerPointsForCurrentYear > 75;
  const isComparativeMessageC =
    percentageMembersWithFewerPointsForCurrentYear >= 50;
  const isComparativeMessageD =
    percentageMembersWithMorePointsForCurrentYear > 50;
  const isAlternativeMessageA = percentageScore >= 80;
  const isAlternativeMessageB = percentageScore >= 60;

  const props = useMemo((): AlertProps => {
    let Icon = PollyCasual;
    let type: AlertProps['type'] = 'warning';
    let title: AlertProps['title'] = `Keep going ${firstName}!`;
    let message: AlertProps['message'] =
      'Keep using CHW Connect to earn points!';

    if (!totalPoints) {
      Icon = PollyCasual;
      type = 'warning';
      title = `No points earned yet`;
      message = 'Keep going to earn points!';
    } else if (isComparativeMessageA) {
      Icon = PollyImpressed;
      type = 'successLight';
      title = `Well done ${firstName}, you are the top CHW!`;
      message = 'You are the top points earner in your team. Keep it up!';
    } else if (isComparativeMessageB) {
      Icon = PollyImpressed;
      type = 'successLight';
      title = `Well done ${firstName}, you are one of the top CHWs!`;
      message =
        'You are one of the top points earners in your team. Keep it up!';
    } else if (isComparativeMessageC) {
      Icon = PollyHappy;
      type = 'info';
      title = `Wow, great job ${firstName}!`;
      message = 'You have more points than most other CHWs in your team!';
    } else if (isComparativeMessageD) {
      Icon = PollyCasual;
      type = 'warning';
      title = `Keep going ${firstName}!`;
      message = `Most of the CHWs in your team have more than ${totalPoints} points! Earn more points to join them.`;
    } else if (isAlternativeMessageA) {
      Icon = PollyImpressed;
      type = 'successLight';
      title = `Well done ${firstName}!`;
      message = 'You’re doing well, keep it up!';
    } else if (isAlternativeMessageB) {
      Icon = PollyHappy;
      type = 'info';
      title = `Wow, great job ${firstName}!`;
      message =
        'You’re doing well, keep it up! You can still earn more points this month.';
    }

    return {
      customIcon: (
        <div>
          <Icon className="h-14	w-14" />
        </div>
      ),
      type,
      title,
      message,
      messageColor: 'textDark',
    };
  }, [
    firstName,
    isAlternativeMessageA,
    isAlternativeMessageB,
    isComparativeMessageA,
    isComparativeMessageB,
    isComparativeMessageC,
    isComparativeMessageD,
    totalPoints,
  ]);

  return <Alert {...props} />;
};
