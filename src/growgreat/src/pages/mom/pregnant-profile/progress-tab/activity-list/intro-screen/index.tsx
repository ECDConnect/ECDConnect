import { Header } from '../../../components';
import { MotherDto } from '@ecdlink/core';
import { useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import { FollowUp } from '../forms/components/follow-up';
import { useSelector } from 'react-redux';
import { motherSelectors } from '@/store/mother';
import { getMomCompletedVisitsByVisitIdSelector } from '@/store/visit/visit.selectors';
import { RootState } from '@/store/types';

interface IntroScreenProps {
  mother?: MotherDto;
  onStartVisit: () => void;
}

export const IntroScreen = ({ mother, onStartVisit }: IntroScreenProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const motherVisit = useSelector(
    motherSelectors?.getMotherCurrentVisitSelector
  );

  const completedVisits = useSelector((state: RootState) =>
    getMomCompletedVisitsByVisitIdSelector(state, motherVisit?.id!)
  )?.visits;

  return (
    <>
      {/* TODO(header): add age and date (G5.0.1) */}
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={`Summary of your last visit with ${name}`}
      />
      <div className="p-4 pt-8">
        <FollowUp mother={mother || {}} />
        {completedVisits?.length! > 0 && (
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
