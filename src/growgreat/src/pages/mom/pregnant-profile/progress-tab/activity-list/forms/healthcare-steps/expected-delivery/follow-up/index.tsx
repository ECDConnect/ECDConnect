import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../dynamic-form';
import { activitiesTypes } from '../../../../activities-list';
import { dangerSignsVisitSection } from '@/pages/infant/infant-profile/progress-tab/activity-list/forms/care-for-mom-steps/danger-signs';

export const DangerSignsFollowUpStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const followUp = useMemo(() => {
    const followUp = previousVisit?.visitDataStatus?.find(
      (item) =>
        item?.section === dangerSignsVisitSection &&
        item?.visitData?.visitName === activitiesTypes.healthCare
    )?.comment;

    const [, message, list] = followUp?.match(/(.+?)(<.*>)/) ?? [];

    const tempEl = document.createElement('div');
    tempEl.innerHTML = list;

    const sentences = (Array.from(tempEl.querySelectorAll('li'), (li) =>
      li?.textContent?.trim()
    ) || []) as string[];

    return { message: `${caregiverName} ${message}`, list: sentences };
  }, [caregiverName, previousVisit?.visitDataStatus]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);
  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title={dangerSignsVisitSection}
        subTitle="Follow up"
      />
      <Alert
        className="m-4"
        type="warning"
        title={followUp.message}
        titleColor="textDark"
        list={followUp.list}
        customIcon={<PollyTime className="w-16" />}
      />
    </>
  );
};
