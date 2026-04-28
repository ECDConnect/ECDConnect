import {
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as EmojiYellowHappy } from '../../../../../../assets/iconRobot.svg';
import TransparentLayer from '../../../../../../assets/TransparentLayer.png';
import { useHistory } from 'react-router-dom';
import { JoinOrAddPreschoolModal } from '../trial-period/join-or-add-preschool-modal';
import { useDialog } from '@ecdlink/core/lib/services/dialog/DialogService';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { useEffect } from 'react';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const history = useHistory();
  const dialog = useDialog();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const missingProgramme =
    (practitioner?.isRegistered == null || practitioner?.isRegistered) &&
    !practitioner?.principalHierarchy &&
    !practitioner?.isPrincipal;
  const isTrialPeriod = useIsTrialPeriod();

  useEffect(() => {
    if (isTrialPeriod || missingProgramme) {
      dialog({
        blocking: true,
        fullOverlay: true,
        position: DialogPosition.Middle,
        render: (onSubmit) => <JoinOrAddPreschoolModal onSubmit={onSubmit} />,
      });
    }
  }, [isTrialPeriod, missingProgramme]);

  return (
    <BannerWrapper
      size={'large'}
      renderBorder={true}
      showBackground={true}
      title={`DBE registration helper`}
      onBack={() => history.push('/')}
      backgroundColour={'white'}
      className={'relative'}
      backgroundUrl={TransparentLayer}
    >
      <div className="flex h-full w-full flex-col bg-white p-4">
        <div className="flex flex-col gap-11">
          <div className="flex w-full justify-center">
            <Card
              className="bg-uiBg fixed flex w-11/12 flex-col items-center gap-3 p-6"
              borderRaduis="xl"
              shadowSize="lg"
            >
              <div className="">
                <EmojiYellowHappy />
              </div>
              <Typography
                color="textDark"
                text={`Your guide to DBE registration`}
                type={'h3'}
                align="center"
              />
            </Card>
          </div>
        </div>

        <div className="mt-56 py-4">
          <Typography
            type={'h1'}
            text={`What is ECD registration?`}
            className={'mb-4 text-sm'}
            color={'textDark'}
          />
          <Typography
            type={'body'}
            text={
              'Registration means your programme is officially recognised by the Department of Basic Education (DBE). It is the first step to getting the ECD subsidy.'
            }
            className={'mb-4 text-sm font-normal'}
            color={'textMid'}
          />
          <Typography
            type={'body'}
            text={
              'This app shows you the steps. You will need to submit your information to the DBE.'
            }
            className={'mb-2 font-bold'}
            color={'textMid'}
          />
        </div>

        <Button
          size="normal"
          className="w-full"
          type="filled"
          color="quatenary"
          text="Start"
          textColor="white"
          icon="ArrowCircleRightIcon"
          onClick={onNext}
        />
      </div>
    </BannerWrapper>
  );
};
