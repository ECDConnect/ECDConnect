import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import { getVisitAnswersForInfantSelector } from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../dynamic-form';
import { maternalDistressQuestion3, maternalDistressVisitSection } from '..';
import { format } from 'date-fns';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

export const MaternalDistressFollowUpStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);
  const list =
    previousAnswers
      ?.filter((item) => item.visitSection === maternalDistressVisitSection)
      ?.filter((item) => item.questionAnswer?.includes('true')) ?? [];

  const isSuicideAlert = list?.some((item) =>
    item.question?.includes(maternalDistressQuestion3)
  );

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
        title={`When you visited ${caregiverName} on ${format(
          new Date(list?.[0]?.insertedDate),
          'd MMMM yyyy'
        )}, she was experiencing the following:`}
        titleColor="textDark"
        listColor="textMid"
        list={list?.map((item) => item.question?.split('?')?.[0] || '')}
        customIcon={<PollyTime className="w-16" />}
      />
      {isSuicideAlert && (
        <Alert
          className="mx-4"
          type="warning"
          title={`Follow up and find out if ${caregiverName} got support from the clinic, their friends, or family.`}
          customIcon={
            <ExclamationCircleIcon className="text-alertMain h-auto w-24" />
          }
        />
      )}
    </>
  );
};
