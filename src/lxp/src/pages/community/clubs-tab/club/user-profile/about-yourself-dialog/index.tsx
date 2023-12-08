import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useAppDispatch } from '@/store';
import { clubThunkActions } from '@/store/club';
import { ClubActions } from '@/store/club/club.actions';
import { userSelectors } from '@/store/user';
import { useSnackbar } from '@ecdlink/core';
import {
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useHistory, useLocation } from 'react-router';
import { CommunityRouteState } from '../../../../community.types';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { practitionerSelectors } from '@/store/practitioner';

interface AboutYourselfDialogProps {
  visible: boolean;
  clubId: string;
  shareContactInfo: boolean;
  onClose: () => void;
}
export const AboutYourselfDialog = ({
  clubId,
  shareContactInfo,
  onClose,
  visible,
}: AboutYourselfDialogProps) => {
  const [value, setValue] = useState('');

  const {
    isLoading: isLoadingCoach,
    wasLoading: wasLoadingCoach,
    isRejected: isRejectedCoach,
    error: errorCoach,
  } = useThunkFetchCall('clubs', ClubActions.UPDATE_COACH_ABOUT_INFO);
  const {
    isLoading: isLoadingMember,
    wasLoading: wasLoadingMember,
    isRejected: isRejectedMember,
    error: errorMember,
  } = useThunkFetchCall('clubs', ClubActions.SAVE_WELCOME_MESSAGE);

  const isLoading = isLoadingCoach || isLoadingMember;
  const wasLoading = wasLoadingCoach || wasLoadingMember;
  const isRejected = isRejectedCoach || isRejectedMember;
  const error = errorCoach || errorMember;

  const appDispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<CommunityRouteState>();
  const { showMessage } = useSnackbar();

  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  const onUpdateAboutInfo = async () => {
    if (isCoach) {
      await appDispatch(
        clubThunkActions.updateCoachAboutInfo({
          aboutInfo: value,
          userId: user?.id,
        })
      );

      history.push(ROUTES.COMMUNITY.ROOT, {
        ...location.state,
      } as CommunityRouteState);
    } else {
      await appDispatch(
        clubThunkActions.saveWelcomeMessage({
          clubId,
          practitionerId: practitioner?.id,
          welcomeMessage: value,
          shareContactInfo,
        })
      );
    }
  };

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({ message: error, type: 'error' });
      } else {
        onClose();
      }
    }
  }, [error, isRejected, isLoading, showMessage, wasLoading, onClose]);

  return (
    <Dialog
      visible={visible}
      position={DialogPosition.Bottom}
      className="overflow-auto"
    >
      <div className="flex flex-col  gap-5 rounded-3xl bg-white p-4">
        <div className="flex gap-4">
          <Typography
            type="h3"
            text="Share something about yourself in 4 or 5 words"
          />
          <button onClick={onClose}>
            {renderIcon('XIcon', 'x-6 h-6 text-textMid')}
          </button>
        </div>

        <FormInput
          placeholder="..."
          maxCharacters={value ? 125 : undefined}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          icon="SaveIcon"
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          isLoading={isLoading}
          disabled={!value || isLoading}
          onClick={onUpdateAboutInfo}
        />
      </div>
    </Dialog>
  );
};
