import { ActionModal, Dialog, DialogPosition, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import robot from '@/assets/iconRobot.svg';
import robotBlueBg from '@/assets/iconRobotBlueBg.svg';
import { LocalStorageKeys } from '@ecdlink/core';
import { setStorageItem } from '@/utils/common/local-storage.utils';
import { useAppContext } from '@/walkthrougContext';
import { WalkthroughModal } from '@/components/walkthrough/modal';

export const StatementsWalkthroughStart = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [isSkipped, setIsSkipped] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { setState } = useAppContext();

  if (isLanguageModalOpen) {
    return (
      <Dialog visible position={DialogPosition.Middle} className="p-4">
        <WalkthroughModal
          onStart={() => {
            setStorageItem(
              true,
              LocalStorageKeys.incomeStatementsWalkthroughComplete
            );
            setState({ run: true, tourActive: true, stepIndex: 0 });
            onClose();
          }}
        />
      </Dialog>
    );
  }

  if (isSkipped) {
    return (
      <Dialog visible position={DialogPosition.Bottom} className="p-4">
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={robot} alt="robot" className="mb-2 mr-6 h-24 w-24" />
              <Typography
                text="Ok, you can always get  help by tapping the question mark at the top of the screen!"
                type="body"
                color="textDark"
              />
            </div>
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          actionButtons={[
            {
              text: 'Close',
              textColour: 'white',
              colour: 'quatenary',
              type: 'filled',
              onClick: () => {
                setStorageItem(
                  true,
                  LocalStorageKeys.incomeStatementsWalkthroughComplete
                );
                onClose();
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      </Dialog>
    );
  }

  return (
    <Dialog visible position={DialogPosition.Middle} className="p-4">
      <ActionModal
        customIcon={<img src={robotBlueBg} alt="robot" className="mb-4" />}
        title="Manage your business like a boss!"
        detailText="Would you like to see how to create your income statements?"
        actionButtons={[
          {
            type: 'filled',
            colour: 'quatenary',
            text: 'Yes, help me!',
            textColour: 'white',
            leadingIcon: 'CheckCircleIcon',
            onClick: () => setIsLanguageModalOpen(true),
          },
          {
            type: 'outlined',
            colour: 'quatenary',
            text: 'No, skip!',
            textColour: 'quatenary',
            leadingIcon: 'ClockIcon',
            onClick: () => {
              setIsSkipped(true);
            },
          },
        ]}
      />
    </Dialog>
  );
};
