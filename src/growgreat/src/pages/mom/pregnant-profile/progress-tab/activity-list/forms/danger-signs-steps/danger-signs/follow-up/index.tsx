import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForMotherSelector } from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../dynamic-form';
import { activitiesTypes } from '../../../../activities-list';
import { dangerSignsSectionName } from '..';

export const DangerSignsFollowUpStep = ({
  mother,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(
    () => mother?.user?.firstName || '',
    [mother?.user?.firstName]
  );

  const previousVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
  );

  const followUp = useMemo(() => {
    const followUp = previousVisit?.visitDataStatus?.find(
      (item) =>
        item?.section === dangerSignsSectionName &&
        item.visitData?.visitName === activitiesTypes.dangerSigns
    )?.comment;

    const [, message, list] = followUp?.match(/(.+?)(<.*>)/) ?? [];

    const tempEl = document.createElement('div');
    tempEl.innerHTML = list;

    const sentences = (Array.from(tempEl.querySelectorAll('li'), (li) =>
      li?.textContent?.trim()
    ) || []) as string[];

    return { message: `${message}`, list: sentences };
  }, [previousVisit?.visitDataStatus]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);
  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title={dangerSignsSectionName}
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
