import { BannerWrapper, Button, FormInput, Typography } from '@ecdlink/ui';
import { mockedClub } from '../individual-club-view';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useState } from 'react';

export const ClubEdit: React.FC = () => {
  const [value, setValue] = useState('');

  const history = useHistory();

  const onSubmit = () => {
    // TODO: call API
    console.log('TODO: add endpoint...', { payload: value });
  };

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Change club name"
      subTitle="step 1 of 1"
      onBack={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', mockedClub.id)
        )
      }
    >
      <Typography type="h2" text="Change club name" className="mb-4" />
      <FormInput
        label="Club name"
        hint="Do not include the word “Club” in the name."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        disabled={!value}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
