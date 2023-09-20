import { BannerWrapper, Button } from '@ecdlink/ui';
import { mockedClub } from '../individual-club-view';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useState } from 'react';
import { Step1 } from './steps/step-1';
import { useSnackbar } from '@ecdlink/core';
import { Step2 } from '../club-add/steps/step-2';
import { MockedStep2 } from '../club-add';
import { ClubsRouteState } from '../../index.types';

interface MockedMember {}

export interface ClubMembersEditProps {
  setSelectedMembers?: (selectedMembers: MockedMember[]) => void;
  setSelectedMembersFromDifferentClub?: (
    selectedMembers: MockedMember[]
  ) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export const ClubMembersAdd: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<MockedMember>([]);
  const [
    selectedMembersFromDifferentClub,
    setSelectedMembersFromDifferentClub,
  ] = useState<MockedStep2>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const isFirstStep = step === 0;

  const history = useHistory();
  const params = useParams<ClubsRouteState>();

  const { showMessage } = useSnackbar();

  const onClose = () => {
    history.push(
      ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', params.clubId)
    );
  };
  const onSubmit = () => {
    // TODO: call API
    console.log({ selectedMembersFromDifferentClub, selectedMembers });

    // TODO: move it to a success callback (useEffect)
    showMessage({ message: '{value} club members added!.', type: 'success' });
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
      title="Add club members"
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
          title={`Add SmartStarters to ${mockedClub.name} club`}
          setIsEnabledButton={setIsEnabledButton}
          setStep2={setSelectedMembersFromDifferentClub}
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
