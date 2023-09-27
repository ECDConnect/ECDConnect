import {
  Alert,
  Avatar,
  BannerWrapper,
  Button,
  Checkbox,
  Radio,
  Typography,
} from '@ecdlink/ui';
import { mockedClub } from '../individual-club-view';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useSnackbar } from '@ecdlink/core';
import { ClubsRouteState } from '../../index.types';

export const ClubLeaderEdit: React.FC = () => {
  // TODO: replace mocked rule with real data
  const hasLeader = true;

  // TODO: add logic to display checkbox
  const isToShowCheckbox = true;

  const history = useHistory();
  const params = useParams<ClubsRouteState>();

  const { showMessage } = useSnackbar();

  const onSubmit = () => {
    // TODO: call API

    // TODO: put this in a callback (after API call is successful)
    /////////////////////////////
    showMessage({ message: 'Club leader request sent!' });
    history.push(
      ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', params.clubId)
    );
    /////////////////////////////
  };

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={`${hasLeader ? 'Change' : 'Assign'} club leader`}
      subTitle="step 1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography
        type="h2"
        text={hasLeader ? 'Choose a new club leader' : 'Assign club leader'}
        className="mb-4"
      />
      <fieldset className="mb-4 flex flex-col gap-2">
        {mockedClub.members.map((leader) => (
          <Radio
            key={leader.name}
            description={leader.name}
            value={leader.name}
            className="mb-4"
            variant="slim"
            customIcon={
              <div className="mx-2">
                <Avatar dataUrl={mockedClub.iconUrl} />
              </div>
            }
          />
        ))}
      </fieldset>
      {isToShowCheckbox && (
        <>
          <Checkbox
            description="I confirm that all club members have agreed to have {newLeader} as their next club leader."
            descriptionColor="textMid"
          />
          <Alert
            className="my-4"
            type="info"
            title="{newLeader} will be notified immediately and asked to complete the club leader agreement."
          />
        </>
      )}
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
