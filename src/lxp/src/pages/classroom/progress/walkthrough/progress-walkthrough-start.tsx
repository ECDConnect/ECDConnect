import { ActionModal, Dialog, DialogPosition, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import robot from '@/assets/iconRobot.svg';
import robotBlueBg from '@/assets/iconRobotBlueBg.svg';
import { useAppContext } from '@/walkthrougContext';
import { WalkthroughModal } from '@/components/walkthrough/modal';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@/store';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';

export const ProgressWalkthroughStart = ({
  childId,
  onClose,
}: {
  childId: string;
  onClose: () => void;
}) => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const [isSkipped, setIsSkipped] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { setState } = useAppContext();

  if (isLanguageModalOpen) {
    return (
      <Dialog visible position={DialogPosition.Middle} className="p-4">
        <WalkthroughModal
          onStart={() => {
            setState({
              run: true,
              tourActive: true,
              stepIndex: 0,
              childId: childId,
            });
            history.push(ROUTES.PROGRESS_OBSERVATIONS_LANDING, {
              childId: childId,
            });
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
                appDispatch(
                  practitionerThunkActions.updatePractitionerProgressWalkthrough(
                    {
                      userId: practitioner?.userId!,
                    }
                  )
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
        title="Hello!"
        detailText="Can I show you how to use the child progress section?"
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
