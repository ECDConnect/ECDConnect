import { Header } from '../../../components';
import { InfantDto } from '@ecdlink/core';
import { useMemo } from 'react';
import { Button } from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';

import { FollowUp } from '../forms/components/follow-up';

interface IntroScreenProps {
  infant?: InfantDto;
  onStartVisit: () => void;
}

export const IntroScreen = ({ infant, onStartVisit }: IntroScreenProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  return (
    <>
      {/* TODO(header): add age and date (G5.0.1) */}
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={`Summary of your last visit with ${name}`}
      />
      <div className="p-4 pt-8">
        <FollowUp infant={infant || {}} />
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
