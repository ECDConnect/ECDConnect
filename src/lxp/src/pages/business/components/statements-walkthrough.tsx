import { useDialog } from '@ecdlink/core';
import {
  ActionModal,
  Button,
  Card,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import walktroughImage from '../../../assets/walktroughImage.png';
import ROUTES from '@/routes/routes';
import { useAppContext } from '@/walkthrougContext';
import { useHistory } from 'react-router';

interface WalkthroughProps {
  setShowInfo: (item: boolean) => void;
  setIsFromAutomaticallyStart: (item: boolean) => void;
  isFromAutomaticallyStart: boolean;
  updateWalkThroughStatus: (item: boolean) => void;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({
  setShowInfo,
  isFromAutomaticallyStart,
  updateWalkThroughStatus,
}) => {
  const dialog = useDialog();
  const history = useHistory();

  const { setState } = useAppContext();

  const handleClickStart = () => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
    setShowInfo(false);
    history.push(ROUTES.BUSINESS);
  };

  const gotToStatementsWalkthrough = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={walktroughImage} alt="profile" className="mb-2" />
            </div>
          }
          importantText={`Welcome to the Money section of Funda App!`}
          detailText={
            'Would you like to see how to create your income statements?'
          }
          actionButtons={[
            {
              text: 'Yes, help me!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                onSubmit();
                handleClickStart();
                updateWalkThroughStatus(true);
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, skip',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                onCancel();
                updateWalkThroughStatus(true);
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  useEffect(() => {
    if (isFromAutomaticallyStart) {
      gotToStatementsWalkthrough();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="bg-uiBg my-4 flex flex-col justify-center rounded-2xl p-4">
      <Typography
        className={'mt-4'}
        color={'textDark'}
        type={'h2'}
        text={'How to use income statements on Funda App'}
      />
      <Typography
        className={'mt-4'}
        color={'textMid'}
        type={'body'}
        text={'Tap the button below to see how to use this part of Funda App'}
      />
      <Button
        text={`Start walkthrough`}
        icon={'ArrowCircleRightIcon'}
        type={'filled'}
        color={'primary'}
        textColor={'white'}
        className={'mt-4 max-h-10'}
        iconPosition={'start'}
        onClick={gotToStatementsWalkthrough}
      />
    </Card>
  );
};
