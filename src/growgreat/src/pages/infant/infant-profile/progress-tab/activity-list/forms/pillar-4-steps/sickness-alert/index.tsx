import { Typography } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import P4 from '@/assets/pillar/p4.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as PollyShock } from '@/assets/pollyShock.svg';

export const SicknessAlertStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={P4}
        title={`${name}`}
        subTitle={`Sugar Salt Solution`}
        iconHexBackgroundColor={activitiesColours.pillar4.primaryColor}
        hexBackgroundColor={activitiesColours.pillar4.secondaryColor}
      />
      <div className="flex flex-col items-center p-10 text-center">
        <div className="mb-4 rounded-full">
          <PollyShock className="h-24 w-24" />
        </div>
        <Typography
          type="h3"
          text={`Take ${name} to the hospital immediately or call an ambulance!`}
          color="errorDark"
          className="mb-4"
        />
        <Typography
          type="body"
          text={`Help ${caregiverName} to make the Sugar Salt Solution on page 30 of the Road to Health Book and give it to Themba on the way to the hopsital.`}
        />
      </div>
    </>
  );
};
