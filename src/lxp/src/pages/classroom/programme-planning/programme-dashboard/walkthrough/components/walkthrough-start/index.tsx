import { ActionModal, Dialog, DialogPosition, Typography } from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import robot from '@/assets/iconRobot.svg';
import robotFullBody from '@/assets/ECD_Connect_robot1.svg';
import { LocalStorageKeys } from '@ecdlink/core';
import { setStorageItem } from '@/utils/common/local-storage.utils';
import { useAppContext } from '@/walkthrougContext';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { ProgrammeDashboardRouteParams } from '../../../programme-dashboard.types';
import { WalkthroughModal } from '@/components/walkthrough/modal';

export const ProgrammeWalkthroughStart = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const [isSkipped, setIsSkipped] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { classroomGroupId } = useParams<ProgrammeDashboardRouteParams>();

  const history = useHistory();

  const { setState } = useAppContext();

  const handleWalkthroughLanguage = useCallback(() => {
    history.push(
      ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
        ':classroomGroupId',
        classroomGroupId
      )
    );

    setIsLanguageModalOpen(true);
  }, [classroomGroupId, history]);

  if (isLanguageModalOpen) {
    return (
      <Dialog visible position={DialogPosition.Middle} className="p-4">
        <WalkthroughModal
          onStart={() => {
            setStorageItem(true, LocalStorageKeys.programmeWalkthroughComplete);
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
                  LocalStorageKeys.programmeWalkthroughComplete
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
        customIcon={<img src={robotFullBody} alt="robot" className="mb-4" />}
        title="Hello! Would you like me to show you how to use this section?"
        detailText="I'll show you how to pick a theme and plan a programme."
        actionButtons={[
          {
            type: 'filled',
            colour: 'quatenary',
            text: 'Yes, help me!',
            textColour: 'white',
            leadingIcon: 'CheckCircleIcon',
            onClick: handleWalkthroughLanguage,
          },
          {
            type: 'outlined',
            colour: 'quatenary',
            text: 'No, skip!',
            textColour: 'quatenary',
            leadingIcon: 'XIcon',
            onClick: () => {
              setIsSkipped(true);
            },
          },
        ]}
      />
    </Dialog>
  );
};
