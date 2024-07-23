import { useDialog, useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';
import { useHistory, useLocation } from 'react-router';
import ROUTES from '@/routes/routes';
import { AddPhotoDialog } from './add-photo-dialog';
import { CoachAboutRouteState } from '@/pages/coach/coach-about/coach-about.types';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useState } from 'react';
import { CommunityRouteState } from '../community.types';
import { coachThunkActions } from '@/store/coach';
import { useAppDispatch } from '@/store';
import { clubThunkActions } from '@/store/club';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { CoachActions } from '@/store/coach/coach.actions';

export const CommunityWelcome: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const user = useSelector(userSelectors.getUser);

  const isToShowAddPhotoScreen = !user?.profileImageUrl;

  const { theme } = useTheme();

  const history = useHistory();
  const location = useLocation<CommunityRouteState>();
  const appDispatch = useAppDispatch();

  const { isLoading: isLoadingCoachAbout } = useThunkFetchCall(
    'clubs',
    ClubActions.UPDATE_COACH_ABOUT_INFO
  );
  const { isLoading: isLoadingClubClicked } = useThunkFetchCall(
    'coach',
    CoachActions.UPDATE_COACH_CLUB_CLICKED
  );
  const { isLoading: isLoadingCoach } = useThunkFetchCall(
    'coach',
    CoachActions.GET_COACH_BY_COACH_ID
  );

  const isLoading =
    isLoadingCoachAbout || isLoadingClubClicked || isLoadingCoach;

  const dialog = useDialog();

  const onSave = async () => {
    if (value) {
      await appDispatch(
        clubThunkActions.updateCoachAboutInfo({
          aboutInfo: value,
          userId: user?.id,
        })
      );

      await appDispatch(
        coachThunkActions.updateCoachClubClicked({ userId: user?.id! })
      );
    }

    if (isToShowAddPhotoScreen) {
      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => (
          <AddPhotoDialog
            onClose={() => {
              history.push(ROUTES.COMMUNITY.ROOT);
              onClose();
            }}
            onSubmit={() => {
              history.push(ROUTES.COACH.ABOUT.ROOT, {
                isFromCommunityWelcome: true,
              } as CoachAboutRouteState);
              onClose();
            }}
          />
        ),
      });
    } else {
      history.push(ROUTES.COMMUNITY.ROOT, {
        ...location.state,
      } as CommunityRouteState);
    }
  };

  return (
    <BannerWrapper
      showBackground
      className="z-10"
      size="small"
      title="Welcome to the Community section!"
      onBack={() => history.push(ROUTES.DASHBOARD)}
      onClose={() => history.push(ROUTES.DASHBOARD)}
    >
      <div className="h-48 overflow-hidden">
        <img
          className="w-full"
          alt="background"
          src={theme?.images.graphicOverlayUrl}
        />
      </div>
      <div
        className="absolute  z-20 flex h-full flex-col overflow-auto p-4"
        style={{ marginTop: -200 }}
      >
        <Typography
          type="h1"
          color="white"
          text="Welcome to your online community"
          className="py-30 w-full break-words"
        />
        <Card className="bg-uiBg flex flex-col items-center rounded-3xl p-4 text-center">
          <Robot className="mb-2" />
          <Typography
            type="h3"
            color="textDark"
            text="Before you begin, tell your SmartStarters something interesting about you!"
          />
        </Card>
        <FormInput
          label="In 4 or 5 words, share something about yourself with your SmartStarters!"
          hint="Optional - you can change this at any time."
          placeholder="E.g. Love working with kids"
          className="mt-10"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button
          type="filled"
          color="primary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          className="mt-auto mb-14"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={onSave}
        />
      </div>
    </BannerWrapper>
  );
};
