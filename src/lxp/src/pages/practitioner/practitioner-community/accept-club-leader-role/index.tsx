import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import PositiveEmoticon from '@/assets/positive-bonus-emoticon.png';

export const AcceptClubLeaderRole: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  // TODO: Add a rule to redirect to the dashboard if the user has no invitation
  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder
      title="Accept club leader role"
      subTitle="{clubName}"
      color="primary"
      className="flex flex-col p-4 pt-6"
      onBack={() => history.push(ROUTES.DASHBOARD)}
      displayOffline={!isOnline}
    >
      <Typography type="h2" text="Accept the club leader agreement" />
      <Alert
        className="my-4"
        type="successLight"
        customIcon={
          <div className="h-24 w-24">
            <img src={PositiveEmoticon} alt="positive emoticon" />
          </div>
        }
        title={`You have been selected as the {clubName} club leader!`}
        message={`Well done {practitionerFirstName}! You were chosen because you are a leader in your community.`}
        messageColor="textDark"
      />
      <Dropdown
        label="Choose a club member who will the club supporter."
        subLabel="This person will support you by uploading images & taking attendance for the club when needed. You can change this at any time."
        placeholder="Select club member"
        list={[]}
        selectedValue={''}
        onChange={() => {}}
        className="mb-4"
      />
      <Typography className="mb-4" type="h4" text="Club leader agreement" />
      <Checkbox
        descriptionColor="textDark"
        description={
          <div className="text-textMid">
            I accept the{' '}
            <button
              className="text-secondary border-secondary border-b"
              // TODO: add info page
              onClick={() => {}}
            >
              club leader commitment
            </button>
          </div>
        }
        // checked={}
        onCheckboxChange={() => {}}
      />
      <Alert
        className="my-4"
        type="info"
        title={`If you do not agree or if you have any concerns or questions, please contact your coach.`}
        button={
          <Button
            icon="ChatIcon"
            type="filled"
            color="primary"
            textColor="white"
            text="Contact coach"
          />
        }
      />
      <Button
        disabled
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
      />
    </BannerWrapper>
  );
};
