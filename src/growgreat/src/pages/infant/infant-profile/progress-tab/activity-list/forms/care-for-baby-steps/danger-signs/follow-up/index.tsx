import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../dynamic-form';
import { activitiesTypes } from '../../../../activities-list';
import { dangerSignsVisitSectionForBaby } from '..';

export const DangerSignsFollowUpStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const followUp = useMemo(() => {
    const followUp = previousVisit?.visitDataStatus?.find(
      (item) =>
        item?.section === dangerSignsVisitSectionForBaby &&
        item.visitData?.visitName === activitiesTypes.careForBaby
    )?.comment;

    const [, message, list] = followUp?.match(/(.+?)(<.*>)/) ?? [];

    const tempEl = document.createElement('div');
    tempEl.innerHTML = list;

    const sentences = (Array.from(tempEl.querySelectorAll('li'), (li) =>
      li?.textContent?.trim()
    ) || []) as string[];

    return { message: `${name} ${message}`, list: sentences };
  }, [name, previousVisit?.visitDataStatus]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);
  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={dangerSignsVisitSectionForBaby}
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
