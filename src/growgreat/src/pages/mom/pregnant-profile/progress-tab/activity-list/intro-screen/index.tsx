import { Header } from '../../../components';
import { MotherDto, getWeeksDiff } from '@ecdlink/core';
import { useEffect, useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import {
  FollowUp,
  FollowUpWalkthroughData,
} from '../forms/components/follow-up';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForMotherSelector } from '@/store/visit/visit.selectors';
import {
  getMotherCurrentVisitSelector,
  getMotherPreviousVisitSelector,
} from '@/store/mother/mother.selectors';
import { RootState } from '@/store/types';

interface IntroScreenProps {
  mother?: MotherDto;
  walkthroughData?: FollowUpWalkthroughData;
  headerText?: string;
  onStartVisit?: () => void;
  isPrint?: boolean;
}

export const IntroScreen = ({
  mother,
  headerText,
  walkthroughData,
  onStartVisit,
  isPrint,
}: IntroScreenProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

  const diffDates = !!mother?.expectedDateOfDelivery
    ? getWeeksDiff(new Date(), new Date(mother?.expectedDateOfDelivery))
    : '';

  const actualGestationWeek = !!diffDates ? 40 - diffDates : '';

  const currentVisit = useSelector(getMotherCurrentVisitSelector);
  const previousPlannedVisit = useSelector((state: RootState) =>
    getMotherPreviousVisitSelector(state, currentVisit?.plannedVisitDate || '')
  );
  const previousVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
  );

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={headerText ?? `Summary of your last visit with ${name}`}
        {...(!!actualGestationWeek
          ? {
              subTitle: `${actualGestationWeek} ${
                actualGestationWeek > 1 ? 'weeks' : 'week'
              }`,
            }
          : {})}
        description={`Your last home visit: ${
          !!previousVisit?.visitDataStatus?.length
            ? new Date(
                String(previousPlannedVisit?.plannedVisitDate)
              ).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'None'
        }`}
      />
      <div className="p-4 pt-8">
        <FollowUp
          mother={mother || {}}
          walkthroughData={walkthroughData}
          isPrint={isPrint}
        />
        {!!onStartVisit && (
          <Button
            className="mt-8 w-full"
            type="filled"
            color="primary"
            textColor="white"
            icon="ClipboardListIcon"
            text="Start visit"
            onClick={onStartVisit}
          />
        )}
      </div>
    </>
  );
};
