import { BannerWrapper, Button } from '@ecdlink/ui';
import { mockedClub } from '../individual-club-view';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useState } from 'react';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { useSnackbar } from '@ecdlink/core';

interface MockedMember {}
interface MockedClub {}

export interface ClubMembersEditProps {
  setSelectedMembers?: (selectedMembers: MockedMember[]) => void;
  setSelectedClub?: (selectedClub: MockedClub) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export const ClubMembersEdit: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<MockedMember>([]);
  const [selectedClub, setSelectedClub] = useState<MockedClub>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const isFirstStep = step === 0;
  const history = useHistory();

  const { showMessage } = useSnackbar();

  const onClose = () => {
    history.push(
      ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', mockedClub.id)
    );
  };
  const onSubmit = () => {
    // TODO: call API
    console.log({ selectedClub, selectedMembers });

    // TODO: move it to a success callback (useEffect)
    showMessage({ message: '{value} club members moved.', type: 'success' });
    onClose();
  };

  const handleOnClick = () => {
    if (step === 0) {
      setStep(1);
    } else {
      onSubmit();
    }
  };

  const handleOnBack = () => {
    if (isFirstStep) {
      return onClose();
    }

    setStep(0);
  };

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Edit club members"
      subTitle={`${step + 1} of 2`}
      onBack={handleOnBack}
    >
      {isFirstStep ? (
        <Step1
          setIsEnabledButton={setIsEnabledButton}
          setSelectedMembers={setSelectedMembers}
        />
      ) : (
        <Step2
          setIsEnabledButton={setIsEnabledButton}
          setSelectedClub={setSelectedClub}
        />
      )}
      <Button
        className="mt-auto"
        icon={isFirstStep ? 'ArrowCircleRightIcon' : 'SaveIcon'}
        type="filled"
        color="primary"
        textColor="white"
        text={isFirstStep ? 'Next' : 'Save'}
        disabled={!isEnabledButton}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
