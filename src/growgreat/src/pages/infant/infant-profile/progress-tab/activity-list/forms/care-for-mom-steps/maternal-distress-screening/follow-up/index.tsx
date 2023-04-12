import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../dynamic-form';
import { activitiesTypes } from '../../../../activities-list';
import { maternalDistressVisitSection } from '..';

export const MaternalDistressFollowUpStep = ({
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
        item?.section === maternalDistressVisitSection &&
        item.visitData?.visitName === activitiesTypes.careForMom
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
        title={maternalDistressVisitSection}
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
