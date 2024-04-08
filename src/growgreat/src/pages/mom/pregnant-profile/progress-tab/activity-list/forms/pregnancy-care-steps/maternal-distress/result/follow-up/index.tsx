import { Alert, renderIcon } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForMotherSelector } from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../../dynamic-form';
import { activitiesTypes } from '../../../../../activities-list';
import Pregnant from '@/assets/pregnant.svg';
import { maternalDistressVisitSection } from '..';

export const MaternalDistressFollowUpStep = ({
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
        item?.section === maternalDistressVisitSection &&
        (item.visitData?.visitName === activitiesTypes.dangerSigns ||
          item.visitData?.visitName === activitiesTypes.pregnancyCare)
    )?.comment;

    const [, message, list] = followUp?.match(/(.+?)(<.*>)/) ?? [];

    const tempEl = document.createElement('div');
    tempEl.innerHTML = list;

    const sentences = (Array.from(tempEl.querySelectorAll('li'), (li) =>
      li?.textContent?.trim()
    ) || []) as string[];

    if (message) {
      return { message: `${name} ${message}`, list: sentences };
    } else {
      return { message: `${followUp}` };
    }
  }, [name, previousVisit?.visitDataStatus]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);
  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title="Maternal distress"
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
      <Alert
        className="mx-4"
        type="warning"
        title={`Follow up and find out if ${name} got support from the clinic, their friends, or family.`}
        customIcon={
          <div className="rounded-full">
            {renderIcon('ExclamationCircleIcon', 'text-alertMain w-10 h-10')}
          </div>
        }
      />
    </>
  );
};
