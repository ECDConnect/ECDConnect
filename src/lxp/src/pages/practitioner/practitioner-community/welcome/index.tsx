import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Card,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useState } from 'react';
import { useAppDispatch } from '@/store';
import { clubThunkActions } from '@/store/club';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';

export const PractitionerCommunityWelcome: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const user = useSelector(userSelectors.getUser);

  const { theme } = useTheme();

  const history = useHistory();
  const appDispatch = useAppDispatch();

  const club = useSelector(getClubForPractitionerSelector);

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.SAVE_WELCOME_MESSAGE
  );

  const onSave = async () => {
    if (value) {
      await appDispatch(
        clubThunkActions.saveWelcomeMessage({
          clubId: club?.id ?? '',
          practitionerId: user?.id ?? '',
          welcomeMessage: value,
        })
      );
    }

    history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT);
  };

  return (
    <BannerWrapper
      showBackground
      className="z-10"
      size="small"
      title={`Welcome to the ${club?.name} club!`}
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
          text={`Welcome to the ${club?.name} club!`}
          className="py-30 w-full break-words"
        />
        <Card className="bg-uiBg flex flex-col items-center rounded-3xl p-4 text-center">
          <Robot className="mb-2" />
          <Typography
            type="h3"
            color="textDark"
            text="Tell your club members something interesting about you!"
          />
        </Card>
        <FormInput
          label="In 4 or 5 words, share something about yourself with your club members!"
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
