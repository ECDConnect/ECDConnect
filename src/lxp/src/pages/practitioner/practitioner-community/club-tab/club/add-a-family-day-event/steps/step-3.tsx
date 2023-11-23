import {
  Alert,
  Dialog,
  DialogPosition,
  FormInput,
  ImageInput,
  Typography,
} from '@ecdlink/ui';
import { AddMeetingProps } from '../index.types';
import { useEffect, useState } from 'react';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';

export const Step3 = ({ setIsEnabledButton, setStep3 }: AddMeetingProps) => {
  const [totalCaregiversAttended, setTotalCaregiversAttended] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [isPhotoActionBarVisible, setPhotoActionBarVisible] = useState(false);

  const acceptedFormats = ['jpg', 'png', 'jpeg'];

  const formatImage = (image: string) => {
    //   fileType: .png,
    //   imageBase64: "iVBORw0KGgoAAAANSUhEUgAAACgA...."
    return {
      fileType: `.${image.split(';')[0].split('/')[1]}`,
      imageBase64: image.split(',')[1],
    };
  };

  useEffect(() => {
    if (totalCaregiversAttended && photoUrl) {
      const { fileType, imageBase64 } = formatImage(photoUrl);

      setIsEnabledButton(true);
      setStep3?.({
        totalCaregiversAttended: parseInt(totalCaregiversAttended),
        fileType,
        imageBase64,
      });
    } else {
      setIsEnabledButton(false);
    }
  }, [photoUrl, setIsEnabledButton, setStep3, totalCaregiversAttended]);

  return (
    <>
      <Typography className="mb-5" type="h2" text="Add a family day event" />
      <FormInput
        label="How many caregivers attended the session?"
        placeholder="Tap to add a number..."
        type="number"
        className="mb-4"
        value={totalCaregiversAttended}
        onChange={(e) => setTotalCaregiversAttended(e.target.value)}
      />
      <ImageInput
        acceptedFormats={acceptedFormats}
        label="Take a photo of the attendance register"
        nameProp="maternalCaseRecord"
        icon="CameraIcon"
        iconContainerColor="tertiary"
        currentImageString={photoUrl}
        overrideOnClick={() => setPhotoActionBarVisible(true)}
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
      {isPhotoActionBarVisible && (
        <Dialog visible position={DialogPosition.Bottom} stretch>
          <PhotoPrompt
            title="Attendance register"
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
            onDelete={!!photoUrl ? () => setPhotoUrl('') : undefined}
          />
        </Dialog>
      )}
    </>
  );
};
