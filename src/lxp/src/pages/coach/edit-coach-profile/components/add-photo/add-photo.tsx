import { PhotoPrompt } from '../../../../../components/photo-prompt/photo-prompt';
import { FileTypeEnum } from '@ecdlink/graphql';
import { coachActions, coachSelectors } from '@store/coach';
import * as styles from '../../edit-coach-profile.styles';
import { useDocuments } from '@hooks/useDocuments';
import { AddPhotoProps } from './add-photo.types';
import { DialogPosition } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { renderIcon } from '@ecdlink/ui';
import { useAppDispatch } from '@store';
import { useState } from 'react';
import {
  Button,
  Dialog,
  Divider,
  ProfileAvatar,
  Typography,
} from '@ecdlink/ui';

export const AddPhoto: React.FC<AddPhotoProps> = ({ onSubmit }) => {
  const coach = useSelector(coachSelectors.getCoach);
  const appDispatch = useAppDispatch();
  const {
    userProfilePicture,
    createNewDocument,
    updateDocument,
    deleteDocument,
  } = useDocuments();

  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);

    const copy = Object.assign({}, coach);
    if (copy) {
      const tmpUser = Object.assign({}, copy.user);
      tmpUser.profileImageUrl = imageBaseString;
      copy.user = tmpUser;

      appDispatch(coachActions.updateCoach(copy));
    }

    if (!userProfilePicture) {
      await createNewDocument({
        data: imageBaseString,
        userId: coach!.user?.id || '',
        fileType: FileTypeEnum.ProfileImage,
        fileName: `ProfilePicture_${coach!.user?.id}.png`,
      });
    } else {
      updateDocument(userProfilePicture, imageBaseString);
    }
  };

  const handleDelete = () => {
    if (userProfilePicture) deleteDocument(userProfilePicture);
    setEditProfilePictureVisible(false);
  };

  return (
    <>
      <Typography
        text={userProfilePicture?.file ? 'Looking good!' : 'Add a Photo'}
        type="h1"
        color="primary"
        className={'mt-3'}
      />

      <Typography
        text={
          userProfilePicture?.file
            ? 'Edit your photo by tapping the camera icon or tap save'
            : 'Add a photo of yourself so your coach and club will recognise you.'
        }
        type="body"
        color="textDark"
        className="font-medium"
      />

      <div className={'w-full inline-flex justify-center pt-16 pb-12'}>
        <ProfileAvatar
          dataUrl={userProfilePicture?.file ?? ''}
          size={'header'}
          onPressed={displayProfilePicturePrompt}
          hasConsent={true}
        />
      </div>

      <Divider dividerType="solid" className="mb-4" />

      <Button
        className="w-full"
        color="primary"
        type="outlined"
        onClick={() => {
          onSubmit(userProfilePicture?.file ? '' : undefined);
        }}
      >
        {renderIcon(
          userProfilePicture?.file ? 'SaveIcon' : 'ClockIcon',
          styles.iconPrimary
        )}
        <Typography
          type="h6"
          className="ml-2"
          text={userProfilePicture?.file ? 'Save' : 'Skip'}
          color="primary"
        />
      </Button>
      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title="Profile Photo"
            onClose={displayProfilePicturePrompt}
            onAction={picturePromptOnAction}
            onDelete={userProfilePicture ? handleDelete : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </>
  );
};
