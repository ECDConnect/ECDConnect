import { Alert, FormInput, ImageInput, Typography } from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect } from 'react';

export const Step3 = ({ setIsEnabledButton }: AddMeetingProps) => {
  const acceptedFormats = ['jpg', 'pdf', 'jpeg'];

  useEffect(() => {
    // TODO: add integration
    setIsEnabledButton(true);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a family day event" />
      <FormInput
        label="How many caregivers attended the session?"
        placeholder="Tap to add a number..."
        type="number"
        className="mb-4"
      />
      <ImageInput
        acceptedFormats={acceptedFormats}
        label="Take a photo of the attendance register"
        nameProp="maternalCaseRecord"
        icon="CameraIcon"
        iconContainerColor="tertiary"
        currentImageString={''}
        overrideOnClick={() => {}}
        onValueChange={(imageString: string) => {}}
      />
      <Alert
        className="my-4"
        type="warning"
        title="You will not be able to edit this after saving."
        list={[
          'Please make sure all the information you have entered is correct and final.',
          'You can submit one family day event every term.',
        ]}
      />
    </>
  );
};
