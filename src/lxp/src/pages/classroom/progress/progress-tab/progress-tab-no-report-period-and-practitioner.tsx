import { useEffect } from 'react';
import { useDialog } from '@ecdlink/core';
import { DialogPosition, Typography } from '@ecdlink/ui';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { JoinOrAddPreschoolModal } from '@/pages/business/registration/welcome-registration/components/trial-period/join-or-add-preschool-modal';

export const ProgressTabNoReportPeriodAndPractitioner: React.FC<{
  principalName: string;
}> = ({ principalName }) => {
  const dialog = useDialog();
  // isTrialPeriod is only true for an open access user who is still within the
  // 30 day trial and has not yet joined or added a preschool.
  const isTrialPeriod = useIsTrialPeriod();

  useEffect(() => {
    if (!isTrialPeriod) return;

    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return (
          <JoinOrAddPreschoolModal
            onSubmit={onSubmit}
            detailText={`To use this part, please share some details about yourself and your preschool.`}
            setupIcon="HomeIcon"
            cancelIcon="ClockIcon"
          />
        );
      },
    });
  }, [dialog, isTrialPeriod]);

  return (
    <div className="mt-2 flex flex-col justify-center p-8">
      <div className="flex w-full justify-center">
        <Emoji4Icon />
      </div>
      <Typography
        className="mt-4 text-center"
        color="textDark"
        text="Your principal has not created progress reporting periods yet."
        type={'h3'}
      />
      <Typography
        className="mt-2 text-center"
        color="textMid"
        text={`Reach out to ${principalName} and ask them to set up progress reporting periods.`}
        type={'body'}
      />
    </div>
  );
};
