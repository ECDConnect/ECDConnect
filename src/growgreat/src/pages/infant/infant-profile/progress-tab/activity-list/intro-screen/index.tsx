import { Header } from '../../../components';
import { InfantDto } from '@ecdlink/core';
import { useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import {
  FollowUp,
  FollowUpWalkthroughData,
} from '../forms/components/follow-up';
import { getAge } from '../forms/care-for-baby-steps/care-for-baby';
import { useSelector } from 'react-redux';
import {
  getInfantCurrentVisitSelector,
  getInfantNearestPreviousVisitByOrderDate,
} from '@/store/infant/infant.selectors';
import { useLocation } from 'react-router';
import { RootState } from '@/store/types';
import { isVisitInProgress } from '@/helpers/visit-helpers';

interface IntroScreenProps {
  infant?: InfantDto;
  walkthroughData?: FollowUpWalkthroughData;
  headerText?: string;
  onStartVisit?: () => void;
  isPrint?: boolean;
  isFromProgressTab?: boolean;
}

export const IntroScreen = ({
  infant,
  walkthroughData,
  headerText,
  onStartVisit,
  isPrint,
  isFromProgressTab,
}: IntroScreenProps) => {
  const location = useLocation();

  // this will be available when you are busy completing a questionnaire
  const [, , , , , visitId] = location.pathname.split('/');

  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, visitId)
  );

  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const lastVisitDate =
    !currentVisit ||
    (!currentVisit?.attended && isVisitInProgress(currentVisit))
      ? previousVisit?.actualVisitDate
      : currentVisit?.actualVisitDate || ''; // TODO - should find most recent completed visit
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={headerText ?? `Summary of your last visit with ${name}`}
        subTitle={getAge(infant?.user?.dateOfBirth as string)}
        description={`Your last home visit: ${
          !!lastVisitDate
            ? new Date(String(lastVisitDate)).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'None'
        }`}
      />
      <div className="p-4 pt-8">
        <FollowUp
          infant={infant || {}}
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
