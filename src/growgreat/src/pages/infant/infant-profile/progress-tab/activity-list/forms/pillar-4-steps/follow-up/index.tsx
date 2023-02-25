import { Header } from '@/pages/infant/infant-profile/components';
import { activitiesColours } from '../../../activities-list';
import P4 from '@/assets/pillar/p4.svg';
import { Alert } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';

export const FollowUpStep = ({ infant, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const mockedFollowUp = {
    message: `${name} had the following danger signs at your previous visit:`,
    list: [
      'Has signs of malnutrition (swollen ankles and feet)',
      'Unable to breastfeed',
    ],
  };

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={P4}
        title="Danger signs"
        subTitle="Follow up"
        iconHexBackgroundColor={activitiesColours.pillar4.primaryColor}
        hexBackgroundColor={activitiesColours.pillar4.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={mockedFollowUp.message}
          titleColor="textDark"
          list={mockedFollowUp.list}
          customIcon={<PollyTime className="w-28" />}
        />
      </div>
    </>
  );
};
