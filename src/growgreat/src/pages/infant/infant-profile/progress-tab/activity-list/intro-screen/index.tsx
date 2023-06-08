import { Header } from '../../../components';
import { InfantDto } from '@ecdlink/core';
import { useLayoutEffect, useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import {
  FollowUp,
  FollowUpWalkthroughData,
} from '../forms/components/follow-up';
import { getAge } from '../forms/care-for-baby-steps/care-for-baby';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import {
  getInfantCurrentVisitSelector,
  getInfantPreviousVisitSelector,
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { useLocation } from 'react-router';
import { getPreviousVisitInformationForInfant } from '@/store/visit/visit.actions';
import { useAppDispatch } from '@/store';

interface IntroScreenProps {
  infant?: InfantDto;
  walkthroughData?: FollowUpWalkthroughData;
  headerText?: string;
  onStartVisit?: () => void;
  isPrint?: boolean;
}

export const IntroScreen = ({
  infant,
  walkthroughData,
  headerText,
  onStartVisit,
  isPrint,
}: IntroScreenProps) => {
  const location = useLocation();
  const appDispatch = useAppDispatch();

  // getting all visits for a client
  const allVisits = useSelector(getInfantVisitsSelector);
  // this will be available when you are busy completing a questionnaire
  const [, , , , , visitId] = location.pathname.split('/');

  const getCurrentVisit = () => {
    // grab visit id from url and set current visit
    if (visitId) {
      for (var i = 0; i < allVisits.length; i++) {
        if (allVisits[i].id === visitId) {
          return allVisits[i];
        }
      }
    } else {
      // grab the latest completed visit from the list
      const lastAttended = allVisits?.filter((item) => item.attended) || [];
      return lastAttended.length
        ? lastAttended.reduce((prev, curr) =>
            (prev.visitType?.order || 0) > (curr.visitType?.order || 0)
              ? prev
              : curr
          )
        : undefined;
    }
  };

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  //const currentVisit = useSelector(getInfantCurrentVisitSelector);
  const currentVisit = getCurrentVisit();
  const previousPlannedVisit = useSelector((state: RootState) =>
    getInfantPreviousVisitSelector(state, currentVisit?.plannedVisitDate || '')
  );

  // this provides the status of previous visit
  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  useLayoutEffect(() => {
    // if the previousVisit is null, lets fetch the latest
    if (!previousVisit && currentVisit) {
      appDispatch(
        getPreviousVisitInformationForInfant({
          visitId: currentVisit.id,
        })
      );
    }
  }, [appDispatch, currentVisit, previousVisit]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={headerText ?? `Summary of your last visit with ${name}`}
        subTitle={getAge(infant?.user?.dateOfBirth as string)}
        description={`Your last home visit: ${
          !!previousVisit?.scoreComment !== null
            ? new Date(
                String(currentVisit?.plannedVisitDate)
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
          infant={infant || {}}
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
