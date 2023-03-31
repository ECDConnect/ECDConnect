import { useLayoutEffect, useMemo } from 'react';
import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';

export const NextVisitStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  // TODO: add integration (G5.8.3)
  const date = 'TODO: EC-141';

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="CalendarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Progress"
      />
      <div className="p-4">
        <Alert
          type="warning"
          title={`${caregiverName} & ${name} need an extra support visit`}
          titleColor="textDark"
          message={`Book a visit before ${date}.`}
          messageColor="textMid"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
      </div>
    </>
  );
};
