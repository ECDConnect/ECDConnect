import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { BeCreativeActivityInput } from '@/services/ClubService/types';
import { useAppDispatch } from '@/store';
import { clubActions, clubSelectors, clubThunkActions } from '@/store/club';
import { ClubActions } from '@/store/club/club.actions';
import { useSnackbar } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  ImageInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const AddCollageEvent: React.FC = () => {
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [isPhotoActionBarVisible, setPhotoActionBarVisible] = useState(false);

  const acceptedFormats = ['jpg', 'png', 'jpeg'];

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.ADD_BE_CREATIVE_ACTIVITY
  );

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const { isOnline } = useOnlineStatus();

  const formatDate = (date: Date) => {
    // "2023-11-01 08:00"
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const formatImage = (image: string) => {
    // fileType: .png,
    // imageBase64: "iVBORw0KGgoAAAANSUhEUgAAACgA...."
    return {
      fileType: `.${image.split(';')[0].split('/')[1]}`,
      imageBase64: image.split(',')[1],
    };
  };

  const onSuccess = useCallback(() => {
    showMessage({
      message: 'Image added!',
      type: 'success',
    });
  }, [showMessage]);

  const onSubmit = async () => {
    const { fileType, imageBase64 } = formatImage(photoUrl);

    const payload: BeCreativeActivityInput = {
      clubId: club?.id ?? '',
      description,
      dateUploaded: formatDate(new Date()),
      fileType,
      imageBase64,
    };

    appDispatch(clubActions.addBeCreativeActivity(payload));

    if (isOnline) {
      appDispatch(clubThunkActions.addBeCreativeActivity(payload));
    }

    if (!isOnline) {
      onSuccess();
      history.goBack();
    }
  };

  useEffect(() => {
    if (isOnline && wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({
          message: error,
          type: 'error',
        });
      } else {
        onSuccess();
        history.goBack();
      }
    }
  }, [
    error,
    history,
    isLoading,
    isOnline,
    isRejected,
    onSuccess,
    showMessage,
    wasLoading,
  ]);

  return (
    <BannerWrapper
      displayOffline={!isOnline}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Be creative"
      subTitle="step 1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography type="h2" text="Be creative" className="mb-4" />
      <Typography type="h4" text="Add your collage photo" className="mb-2" />
      <ol className="mb-2 list-decimal pl-4">
        {[
          'the material used',
          'club making the resource',
          'the final product',
        ].map((item) => (
          <li className="text-textMid text-14">{item}</li>
        ))}
      </ol>
      <ImageInput
        className="mb-4"
        acceptedFormats={acceptedFormats}
        label=""
        nameProp="maternalCaseRecord"
        icon="CameraIcon"
        iconContainerColor="tertiary"
        currentImageString={photoUrl}
        overrideOnClick={() => setPhotoActionBarVisible(true)}
      />
      <FormInput
        textInputType="textarea"
        label="Add a description"
        placeholder="e.g. Made puppets for this month’s theme."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Alert
        className="my-4"
        type="warning"
        title="You will not be able to edit this after saving."
        list={[
          'Please make sure all the information you have entered is correct and final.',
          'Your club can only submit 1 “Be creative” image per month.',
        ]}
      />
      <Button
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        isLoading={isLoading}
        disabled={!photoUrl || !description || isLoading}
        onClick={onSubmit}
      />
      {isPhotoActionBarVisible && (
        <Dialog visible position={DialogPosition.Bottom} stretch>
          <PhotoPrompt
            title="Collage photo"
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
            onDelete={!!photoUrl ? () => setPhotoUrl('') : undefined}
          />
        </Dialog>
      )}
    </BannerWrapper>
  );
};
