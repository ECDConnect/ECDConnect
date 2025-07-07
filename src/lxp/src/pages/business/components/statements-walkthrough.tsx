import { useDialog } from '@ecdlink/core';
import { Button, Card, DialogPosition, Typography } from '@ecdlink/ui';
import { useCallback } from 'react';
import { useAppContext } from '@/walkthrougContext';
import { WalkthroughModal } from '@/components/walkthrough/modal';
import { useTenant } from '@/hooks/useTenant';

interface WalkthroughProps {
  onBack: () => void;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({ onBack }) => {
  const dialog = useDialog();
  const tenant = useTenant();

  const { setState } = useAppContext();

  const handleWalkthroughLanguage = useCallback(() => {
    return dialog({
      blocking: true,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <WalkthroughModal
          onStart={() => {
            onBack();
            setState({ run: true, tourActive: true, stepIndex: 0 });
            onClose();
          }}
        />
      ),
    });
  }, [dialog, onBack, setState]);

  return (
    <Card className="bg-uiBg my-4 flex flex-col justify-center rounded-2xl p-4">
      <Typography
        className={'mt-4'}
        color={'textDark'}
        type={'h2'}
        text={`How to use income statements on ${tenant.tenant?.applicationName}`}
      />
      <Typography
        className={'mt-4'}
        color={'textMid'}
        type={'body'}
        text={`Tap the button below to see how to use this part of ${tenant.tenant?.applicationName}`}
      />
      <Button
        text={`Start walkthrough`}
        icon={'ArrowCircleRightIcon'}
        type={'filled'}
        color={'quatenary'}
        textColor={'white'}
        className={'mt-4 max-h-10'}
        iconPosition={'start'}
        onClick={handleWalkthroughLanguage}
      />
    </Card>
  );
};
