import { Alert, AlertProps } from '@ecdlink/ui';
import { useMemo } from 'react';

import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollyCasual } from '@/assets/pollyCasual.svg';

export const ComparativeMessage = () => {
  const isToShowComparativeMessageA = false;
  const isToShowComparativeMessageB = false;
  const isToShowComparativeMessageC = false;
  const isToShowComparativeMessageD = false;

  const props = useMemo((): AlertProps => {
    let Icon = PollyCasual;
    let type: AlertProps['type'] = 'warning';
    let title: AlertProps['title'] = `No points earned yet`;
    let message: AlertProps['message'] = 'Keep going to earn points!';

    if (isToShowComparativeMessageA) {
      Icon = PollyImpressed;
      type = 'success';
      title = `Well done {hcw}, you are the top CHW!`;
      message = 'You are the top points earner in your team. Keep it up!';
    }

    if (isToShowComparativeMessageB) {
      Icon = PollyImpressed;
      type = 'success';
      title = `Well done {hcw}, you are one of the top CHWs!`;
      message =
        'You are one of the top points earners in your team. Keep it up!';
    }

    if (isToShowComparativeMessageC) {
      Icon = PollyHappy;
      type = 'info';
      title = `Wow, great job {hcw}!`;
      message = 'You have more points than most other CHWs in your team!';
    }

    if (isToShowComparativeMessageD) {
      Icon = PollyCasual;
      type = 'warning';
      title = `Keep going {hcw}!`;
      message =
        'Most of the CHWs in your team have more than 500 points! Earn more points to join them.';
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
    isToShowComparativeMessageA,
    isToShowComparativeMessageB,
    isToShowComparativeMessageC,
    isToShowComparativeMessageD,
  ]);

  return <Alert {...props} />;
};
