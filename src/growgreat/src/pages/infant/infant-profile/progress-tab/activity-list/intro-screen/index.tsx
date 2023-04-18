import { Header } from '../../../components';
import { InfantDto } from '@ecdlink/core';
import { useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import { FollowUp } from '../forms/components/follow-up';
import { getAge } from '../forms/care-for-baby-steps/care-for-baby';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import {
  getInfantCurrentVisitSelector,
  getInfantPreviousVisitSelector,
} from '@/store/infant/infant.selectors';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';

interface IntroScreenProps {
  infant?: InfantDto;
  headerText?: string;
  onStartVisit?: () => void;
}

export const IntroScreen = ({
  infant,
  headerText,
  onStartVisit,
}: IntroScreenProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const currentVisit = useSelector(getInfantCurrentVisitSelector);
  const previousPlannedVisit = useSelector((state: RootState) =>
    getInfantPreviousVisitSelector(state, currentVisit?.plannedVisitDate || '')
  );
  const previousVisit = useSelector(
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
        <FollowUp infant={infant || {}} />
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
