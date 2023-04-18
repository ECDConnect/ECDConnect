import { Alert, Divider, Typography } from '@ecdlink/ui';
import { Header, Label } from '@/pages/infant/infant-profile/components';
import { useLayoutEffect, useMemo } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { useSelector } from 'react-redux';
import {
  getPreviousVisitInformationForInfantSelector,
  getVisitAnswersForInfantSelector,
} from '@/store/visit/visit.selectors';
import { DynamicFormProps } from '../../../dynamic-form';
import {
  activitiesColours,
  activitiesTypes,
} from '../../../../activities-list';
import { DevelopmentalScreeningVisitSection, noteQuestion } from '..';
import P2 from '@/assets/pillar/p2.svg';
import { differenceInWeeks } from 'date-fns';
import { useParams } from 'react-router';
import { InfantProfileParams } from '@/pages/infant/infant-profile/infant-profile.types';
import {
  getInfantPreviousVisitSelector,
  getInfantVisitByVisitIdSelector,
} from '@/store/infant/infant.selectors';
import { RootState } from '@/store/types';

export const DevelopmentalScreeningWeeksFollowUpStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const { visitId } = useParams<InfantProfileParams>();

  const visit = useSelector((state: RootState) =>
    getInfantVisitByVisitIdSelector(state, visitId)
  );
  const previousPlannedVisit = useSelector((state: RootState) =>
    getInfantPreviousVisitSelector(state, visit?.plannedVisitDate || '')
  );
  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);

  const followUp = useMemo(() => {
    const visitDataStatus = previousVisit?.visitDataStatus?.find(
      (item) =>
        item?.section === DevelopmentalScreeningVisitSection &&
        item.visitData?.visitName === activitiesTypes.pillar2
    );

    const followUp = visitDataStatus?.comment;
    const date = !!previousPlannedVisit?.plannedVisitDate
      ? new Date(previousPlannedVisit?.plannedVisitDate)
      : undefined;
    const note = previousAnswers?.find(
      (item) => item.question === noteQuestion
    )?.questionAnswer;
    const weeks =
      !!infant?.user?.dateOfBirth &&
      date &&
      differenceInWeeks(new Date(date), new Date(infant?.user?.dateOfBirth));
    const [, message, list] = followUp?.match(/(.+?)(<.*>)/) ?? [];

    const tempEl = document.createElement('div');
    tempEl.innerHTML = list;

    const sentences = (Array.from(tempEl.querySelectorAll('li'), (li) =>
      li?.textContent?.trim()
    ) || []) as string[];

    return {
      message: `${
        !!weeks ? `In the ${weeks} week developmental screening, ` : ''
      }${name} ${message}`,
      list: sentences,
      date,
      note,
    };
  }, [
    infant?.user?.dateOfBirth,
    name,
    previousAnswers,
    previousPlannedVisit?.plannedVisitDate,
    previousVisit?.visitDataStatus,
  ]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);
  return (
    <>
      <Header
        iconHexBackgroundColor={activitiesColours.pillar2.primaryColor}
        hexBackgroundColor={activitiesColours.pillar2.secondaryColor}
        customIcon={P2}
        title={DevelopmentalScreeningVisitSection}
        subTitle="Follow up"
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={followUp.message}
          titleColor="textDark"
          list={followUp.list}
          customIcon={<PollyTime className="w-16" />}
        />
        <Typography type="h4" text={`Discuss with ${caregiverName}:`} />
        <Label text="Do you have an update?" />
        <Divider dividerType="dashed" />
        <Label
          text={`Remember, children develop at different speeds. Keep taking ${name} for check-ups and monitoring their development.`}
        />
        <div className="bg-uiBg rounded-15 flex flex-col gap-2 p-4">
          <Typography
            type="h3"
            text={`Notes from ${followUp?.date?.toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
            })} visit`}
            color="textDark"
          />
          <Typography type="body" text={followUp?.note || ''} color="textMid" />
        </div>
      </div>
    </>
  );
};
