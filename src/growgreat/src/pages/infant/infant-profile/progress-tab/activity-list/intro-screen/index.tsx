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
import { getInfantCurrentVisitSelector } from '@/store/infant/infant.selectors';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { useLocation } from 'react-router';
import { RootState } from '@/store/types';

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

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  //const currentVisit = useSelector(getInfantCurrentVisitSelector);
  // const previousPlannedVisit = useSelector((state: RootState) =>
  //   getInfantPreviousVisitSelector(state, currentVisit?.plannedVisitDate || '')
  // );

  // this provides the status of previous visit
  const previousVisitStatus = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={headerText ?? `Summary of your last visit with ${name}`}
        subTitle={getAge(infant?.user?.dateOfBirth as string)}
        description={`Your last home visit: ${
          !!previousVisitStatus &&
          previousVisitStatus?.scoreComment !== 'No data available for visit' &&
          currentVisit
            ? new Date(String(currentVisit?.orderDate)).toLocaleDateString(
                'en-ZA',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )
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
