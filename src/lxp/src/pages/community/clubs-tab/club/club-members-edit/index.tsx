import { BannerWrapper, Button } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useCallback, useEffect, useState } from 'react';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { useSnackbar } from '@ecdlink/core';
import { ClubsRouteState } from '../../index.types';
import { ClubMember, CoachingClub, NewClubMemberInput } from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  moveClubMembers,
  getAllClubsDetailsForCoach,
} from '@/store/club/club.actions';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export interface ClubMembersEditProps {
  selectedMembers: (ClubMember | undefined)[];
  selectedClub?: CoachingClub;
  setSelectedMembers?: (selectedMembers: (ClubMember | undefined)[]) => void;
  setSelectedClub?: (selectedClub: CoachingClub) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export const ClubMembersEdit: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<
    (ClubMember | undefined)[]
  >([]);
  const [selectedClub, setSelectedClub] = useState<CoachingClub>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const isFirstStep = step === 0;

  const user = useSelector(userSelectors.getUser);

  const history = useHistory();
  const { clubId } = useParams<ClubsRouteState>();
  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const { isLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.MOVE_CLUB_MEMBERS
  );
  const {
    isLoading: isLoadingClub,
    wasLoading: wasLoadingClub,
    isRejected: isRejectedGetClub,
    error: errorGetClub,
  } = useThunkFetchCall('clubs', ClubActions.GET_ALL_CLUBS_DETAILS_FOR_COACH);

  const onClose = useCallback(() => {
    history.push(ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', clubId));
  }, [clubId, history]);

  const onSubmit = async () => {
    const payload: NewClubMemberInput = {
      clubId: selectedClub?.id,
      practitionerIds: selectedMembers?.map(
        (member) => member?.practitioner?.id
      ) as string[],
    };

    await appDispatch(moveClubMembers({ input: payload }));
    await appDispatch(
      getAllClubsDetailsForCoach({ userId: user?.id!, clubId })
    );
  };

  const onSuccess = useCallback(async () => {
    showMessage({
      message: `${selectedMembers.length} club members moved.`,
      type: 'success',
    });
    onClose();
  }, [onClose, selectedMembers.length, showMessage]);

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

  useEffect(() => {
    if (wasLoadingClub && !isLoadingClub) {
      if (isRejected || isRejectedGetClub) {
        showMessage({ message: error || errorGetClub, type: 'error' });
      }

      if (!isRejected) {
        onSuccess();
      }
    }
  }, [
    error,
    isRejected,
    showMessage,
    onSuccess,
    wasLoadingClub,
    isLoadingClub,
    isRejectedGetClub,
    errorGetClub,
  ]);

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
          selectedMembers={selectedMembers}
          setIsEnabledButton={setIsEnabledButton}
          setSelectedMembers={setSelectedMembers}
        />
      ) : (
        <Step2
          selectedMembers={selectedMembers}
          selectedClub={selectedClub}
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
        isLoading={isLoading || isLoadingClub}
        disabled={!isEnabledButton || isLoading || isLoadingClub}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
