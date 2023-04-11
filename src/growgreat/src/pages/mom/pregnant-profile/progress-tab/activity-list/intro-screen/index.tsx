import { Header } from '../../../components';
import { InfantDto, MotherDto } from '@ecdlink/core';
import { useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import { FollowUp } from '../forms/components/follow-up';

interface IntroScreenProps {
  mother?: MotherDto;
  onStartVisit: () => void;
}

export const IntroScreen = ({ mother, onStartVisit }: IntroScreenProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

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
        <Button
          className="mt-8 w-full"
          type="filled"
          color="primary"
          textColor="white"
          icon="ClipboardListIcon"
          text="Start visit"
          onClick={onStartVisit}
        />
      </div>
    </>
  );
};
