import { Header } from '@/pages/infant/infant-profile/components';
import { useLayoutEffect, useMemo } from 'react';
import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { TipCard } from '../../../../../components';
import { FollowUp } from '../../components/follow-up';

export const ProgressStep = ({ infant, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="ChartBarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Progress"
        subTitle={`${caregiverName} & ${name}`}
      />
      <div className="p-4">
        <TipCard
          className="mb-4"
          hideLeftIcon
          title="Want to share?"
          buttonText="Yes, share now!"
          buttonIcon="ShareIcon"
          onClick={() => {}}
        />
        <FollowUp infant={infant || {}} />
      </div>
    </>
  );
};
