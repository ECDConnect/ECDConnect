import { Header } from '@/pages/infant/infant-profile/components';
import { activitiesColours } from '../../../activities-list';
import P4 from '@/assets/pillar/p4.svg';
import { Alert } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { activitiesTypes } from '../../../activities-list';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';

export const FollowUpStep = ({ infant, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const followUp = useMemo(() => {
    const followUp = previousVisit?.visitDataStatus?.find(
      (item) =>
        item?.section === 'Danger signs' &&
        item?.visitData?.visitName === activitiesTypes.nutrition
    )?.comment;

    const [, message, list] = followUp?.match(/(.+?)(<.*>)/) ?? [];

    const tempEl = document.createElement('div');
    tempEl.innerHTML = list;

    const sentences = (Array.from(tempEl.querySelectorAll('li'), (li) =>
      li?.textContent?.trim()
    ) || []) as string[];

    return { message: `${name} ${message}`, list: sentences };
  }, [name, previousVisit?.visitDataStatus]);

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
          title={followUp.message}
          titleColor="textDark"
          list={followUp.list}
          customIcon={<PollyTime className="w-28" />}
        />
      </div>
    </>
  );
};
