import { BannerWrapper, Button } from '@ecdlink/ui';
import { mockedClub } from '../individual-club-view';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useCallback, useEffect, useState } from 'react';
import { Step1 } from './steps/step-1';
import { PractitionerDto, useSnackbar } from '@ecdlink/core';
import { Step2 } from '../club-add/steps/step-2';
import { ClubsRouteState } from '../../index.types';
import { NewClubMemberInput } from '@ecdlink/graphql';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  addNewClubMembers,
  getAllClubsForCoach,
  moveClubMembers,
} from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { clubSelectors } from '@/store/club';

export type Member = PractitionerDto | undefined;

export interface ClubMembersAddProps {
  setSelectedMembers?: (selectedMembers: Member[]) => void;
  setSelectedMembersFromDifferentClub?: (selectedMembers: Member[]) => void;
  setIsEnabledButton: (isEnabledButton: boolean) => void;
}

export const ClubMembersAdd: React.FC = () => {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [
    selectedMembersFromDifferentClub,
    setSelectedMembersFromDifferentClub,
  ] = useState<Member[]>([]);

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const user = useSelector(userSelectors.getUser);

  const isFirstStep = step === 0;
  const mergedMembers = [
    ...selectedMembers,
    ...selectedMembersFromDifferentClub,
  ];

  const {
    isLoading: isLoadingAddMembers,
    isRejected: isRejectedAddMembers,
    error: errorAddMembers,
  } = useThunkFetchCall('clubs', ClubActions.ADD_NEW_CLUB_MEMBERS);
  const {
    isLoading: isLoadingMoveMembers,
    isRejected: isRejectedMoveMembers,
    error: errorMoveMembers,
  } = useThunkFetchCall('clubs', ClubActions.MOVE_CLUB_MEMBERS);
  const {
    isLoading: isLoadingClubs,
    wasLoading: wasLoadingAllClubs,
    isRejected: isRejectedGetAllClubs,
    error: errorGetAllClubs,
  } = useThunkFetchCall('clubs', ClubActions.GET_ALL_CLUBS_FOR_COACH);

  const isLoading =
    isLoadingAddMembers || isLoadingMoveMembers || isLoadingClubs;
  const isRejected =
    isRejectedAddMembers || isRejectedMoveMembers || isRejectedGetAllClubs;
  const error = errorAddMembers || errorMoveMembers || errorGetAllClubs;

  const isSuccess =
    (selectedMembers.length &&
      !selectedMembersFromDifferentClub.length &&
      !isRejectedAddMembers) ||
    (selectedMembersFromDifferentClub &&
      !selectedMembers.length &&
      !isRejectedMoveMembers) ||
    (selectedMembers.length &&
      selectedMembersFromDifferentClub.length &&
      !isRejectedAddMembers &&
      !isRejectedMoveMembers);

  const history = useHistory();
  const { clubId } = useParams<ClubsRouteState>();
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));

  const { showMessage } = useSnackbar();

  const appDispatch = useAppDispatch();

  const onClose = useCallback(() => {
    history.push(
      !!club?.clubMembers?.length
        ? ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', clubId)
        : ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId)
    );
  }, [club?.clubMembers?.length, clubId, history]);

  const onSubmit = async () => {
    if (!!selectedMembers.length) {
      const payload: NewClubMemberInput = {
        clubId,
        practitionerIds: selectedMembers?.map(
          (member) => member?.id
        ) as string[],
      };

      await appDispatch(addNewClubMembers({ input: payload }));
    }

    if (!!selectedMembersFromDifferentClub.length) {
      const payload: NewClubMemberInput = {
        clubId,
        practitionerIds: selectedMembersFromDifferentClub?.map(
          (member) => member?.id
        ) as string[],
      };

      await appDispatch(moveClubMembers({ input: payload }));
    }

    // TODO: change to another endpoint to get only the specific club
    await appDispatch(getAllClubsForCoach({ userId: user?.id! }));
  };

  const onSuccess = useCallback(async () => {
    showMessage({
      message: `${mergedMembers.length} club members added!.`,
      type: 'success',
    });
    onClose();
  }, [mergedMembers.length, onClose, showMessage]);

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
    if (wasLoadingAllClubs && !isLoadingClubs) {
      if (isRejected) {
        showMessage({ message: error, type: 'error' });
      }

      if (isSuccess) {
        onSuccess();
      }
    }
  }, [
    error,
    isLoadingClubs,
    isRejected,
    isSuccess,
    onSuccess,
    showMessage,
    wasLoadingAllClubs,
  ]);

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
          hasSelectedPractitioners={!!selectedMembers?.length}
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
        isLoading={isLoading || isLoadingClubs}
        disabled={!isEnabledButton || isLoading || isLoadingClubs}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
