import { BannerWrapper, Button } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useCallback, useEffect, useState } from 'react';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { PractitionerDto, useSnackbar } from '@ecdlink/core';
import { Step3 } from './steps/step-3';
import { ClubLeader, NewClubInput } from '@ecdlink/graphql';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  addNewClub,
  addNewClubLeader,
  getAllClubsForCoach,
} from '@/store/club/club.actions';
import { NewClubLeaderInput } from '@/services/ClubService/types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export type Member = PractitionerDto | undefined;
interface Step1Data {
  clubName: string;
  members: Member[];
}
interface Step3Data {
  leaderId: PractitionerDto['id'];
}

export interface ClubAddProps {
  step1?: Step1Data;
  step2?: Member[];
  setStep1?: (step1: Step1Data) => void;
  setStep2?: (step2: Member[]) => void;
  setStep3?: (step3: Step3Data) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export const ClubAdd: React.FC = () => {
  const [step1, setStep1] = useState<Step1Data>();
  const [step2, setStep2] = useState<Member[]>();
  const [step3, setStep3] = useState<Step3Data>();
  const [newClubId, setNewClubId] = useState('');

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const isFirstStep = step === 0;
  const isLastStep = step === 2;

  const history = useHistory();
  const user = useSelector(userSelectors.getUser);

  const { showMessage } = useSnackbar();

  const appDispatch = useAppDispatch();

  const {
    isLoading: isLoadingAddClub,
    isRejected: isRejectedAddClub,
    error: errorAddClub,
  } = useThunkFetchCall('clubs', ClubActions.ADD_NEW_CLUB);
  const {
    isLoading: isLoadingAddLeader,
    isRejected: isRejectedAddLeader,
    error: errorAddLeader,
  } = useThunkFetchCall('clubs', ClubActions.ADD_NEW_CLUB_LEADER);
  const {
    isLoading: isLoadingClubs,
    wasLoading: wasLoadingAllClubs,
    isRejected: isRejectedGetAllClubs,
    error: errorGetAllClubs,
  } = useThunkFetchCall('clubs', ClubActions.GET_ALL_CLUBS_FOR_COACH);
  const isLoading = isLoadingAddClub || isLoadingAddLeader || isLoadingClubs;
  const isRejected =
    isRejectedAddClub || isRejectedAddLeader || isRejectedGetAllClubs;
  const error = errorAddClub || errorAddLeader || errorGetAllClubs;

  const onClose = useCallback(() => {
    history.push(ROUTES.COMMUNITY.ROOT);
  }, [history]);

  const onSubmit = async () => {
    const payloadAddClub: NewClubInput = {
      name: step1?.clubName,
      newClubMembers: step1?.members?.map((member) => member?.id) as string[],
      transferredClubMembers:
        (step2?.map((member) => member?.id) as string[]) || [],
      userId: user?.id,
    };

    const response = await appDispatch(addNewClub({ input: payloadAddClub }));

    const clubId = (response.payload as ClubLeader | undefined)?.id;

    if (clubId) {
      setNewClubId(clubId);

      const payloadAddClubLeader: NewClubLeaderInput = {
        clubId,
        practitionerId: step3?.leaderId!,
      };

      await appDispatch(addNewClubLeader(payloadAddClubLeader));

      // TODO: change to another endpoint to get only the specific club
      await appDispatch(getAllClubsForCoach({ userId: user?.id! }));
    }
  };

  const handleOnClick = () => {
    if (!isLastStep) {
      setStep((prevStep) => prevStep + 1);
    } else {
      onSubmit();
    }
  };

  const handleOnBack = () => {
    if (isFirstStep) {
      return onClose();
    }

    setStep((prevStep) => prevStep - 1);
  };

  const onSuccess = useCallback(() => {
    showMessage({ message: `${step1?.clubName} club added`, type: 'success' });
    history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', newClubId));
  }, [history, newClubId, showMessage, step1?.clubName]);

  useEffect(() => {
    if (wasLoadingAllClubs && !isLoadingClubs) {
      if (isRejected) {
        showMessage({ message: error, type: 'error' });
      }

      if (!isRejectedAddClub && !isLoadingClubs) {
        onSuccess();
      }
    }
  }, [
    error,
    isLoadingClubs,
    isRejected,
    isRejectedAddClub,
    onSuccess,
    showMessage,
    wasLoadingAllClubs,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add a club"
      subTitle={`${step + 1} of 3`}
      onBack={handleOnBack}
    >
      {isFirstStep && (
        <Step1 setIsEnabledButton={setIsEnabledButton} setStep1={setStep1} />
      )}
      {step === 1 && (
        <Step2
          title="Add a club"
          step1={step1}
          setIsEnabledButton={setIsEnabledButton}
          setStep2={setStep2}
          hasSelectedPractitioners={!!step1?.members?.length}
        />
      )}
      {isLastStep && (
        <Step3
          step1={step1}
          step2={step2}
          setIsEnabledButton={setIsEnabledButton}
          setStep3={setStep3}
        />
      )}
      <Button
        className="mt-auto"
        icon={!isLastStep ? 'ArrowCircleRightIcon' : 'SaveIcon'}
        type="filled"
        color="primary"
        textColor="white"
        text={!isLastStep ? 'Next' : 'Save'}
        isLoading={isLoading}
        disabled={!isEnabledButton || isLoading}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
