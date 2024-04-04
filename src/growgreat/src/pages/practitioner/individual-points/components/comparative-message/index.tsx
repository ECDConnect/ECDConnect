import { Alert, AlertProps } from '@ecdlink/ui';
import { useMemo } from 'react';

import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyCasual } from '@/assets/pollyCasual.svg';
import { useSelector } from 'react-redux';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { MaxIndividualPoints } from '@/constants/Community';
import { userSelectors } from '@/store/user';

export const ComparativeMessage = ({
  viewMode,
}: {
  viewMode: 'month' | 'year';
}) => {
  const today = new Date();

  const user = useSelector(userSelectors.getUser);
  const totalPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTotalCompletedPointsSelector
  );
  const currentIndividualPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTotalCompletedPointsByMonthSelector(
      today.getMonth() + 1
    )
  );
  const standing = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTeamStandingSelector
  );

  const firstName = user?.firstName ?? 'CHW';

  const points = viewMode === 'year' ? totalPoints : currentIndividualPoints;

  const percentageScore =
    (points /
      MaxIndividualPoints[viewMode === 'year' ? 'PerYear' : 'PerMonth']) *
    100;

  const percentageMembersWithFewerPoints =
    (viewMode === 'year'
      ? standing?.percentageMembersWithFewerPointsForCurrentYear
      : standing?.percentageMembersWithFewerPointsForCurrentMonth) ?? 0;
  const percentageMembersWithMorePoints =
    (viewMode === 'year'
      ? standing?.percentageMembersWithMorePointsForCurrentYear
      : standing?.percentageMembersWithMorePointsForCurrentMonth) ?? 0;

  const isComparativeMessageA = percentageMembersWithFewerPoints === 100;
  const isComparativeMessageB = percentageMembersWithFewerPoints >= 75;
  const isComparativeMessageC = percentageMembersWithFewerPoints >= 50;
  const isComparativeMessageD = percentageMembersWithMorePoints > 50;
  const isAlternativeMessageA = percentageScore >= 80;
  const isAlternativeMessageB = percentageScore >= 60;

  const props = useMemo((): AlertProps => {
    let Icon = PollyCasual;
    let type: AlertProps['type'] = 'warning';
    let title: AlertProps['title'] = `Keep going ${firstName}!`;
    let message: AlertProps['message'] =
      'Keep using CHW Connect to earn points!';

    if (!points) {
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
      message = `Most of the CHWs in your team have more than ${points} points! Earn more points to join them.`;
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
    points,
  ]);

  return <Alert {...props} />;
};
