import { Header } from '../../../components';
import { MotherDto, getWeeksDiff } from '@ecdlink/core';
import { useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import {
  FollowUp,
  FollowUpWalkthroughData,
} from '../forms/components/follow-up';
import { useSelector } from 'react-redux';
import {
  getMotherCurrentVisitSelector,
  getMotherNearestPreviousVisitByOrderDate,
} from '@/store/mother/mother.selectors';
import { RootState } from '@/store/types';
import { useAppDispatch } from '@/store';

interface IntroScreenProps {
  mother?: MotherDto;
  walkthroughData?: FollowUpWalkthroughData;
  headerText?: string;
  onStartVisit?: () => void;
  isPrint?: boolean;
  isFromProgressTab?: boolean;
}

export const IntroScreen = ({
  mother,
  headerText,
  walkthroughData,
  onStartVisit,
  isPrint,
  isFromProgressTab,
}: IntroScreenProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const appDispatch = useAppDispatch();

  const diffDates = !!mother?.expectedDateOfDelivery
    ? getWeeksDiff(new Date(), new Date(mother?.expectedDateOfDelivery))
    : '';

  const actualGestationWeek = !!diffDates ? 40 - diffDates : '';

  const currentVisit = useSelector((state: RootState) =>
    getMotherCurrentVisitSelector(state, '')
  );

  const previousVisit = useSelector((state: RootState) =>
    getMotherNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const date =
    !currentVisit?.attended && !currentVisit?.visitInProgress
      ? previousVisit?.actualVisitDate
      : currentVisit.actualVisitDate || currentVisit?.insertedDate || '';

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
          date
            ? new Date(String(date)).toLocaleDateString('en-ZA', {
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
          isFromProgressTab={isFromProgressTab}
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
