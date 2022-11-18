import { FileTypeEnum } from '@ecdlink/graphql';
import {
  Button,
  Dialog,
  Divider,
  ProfileAvatar,
  Typography,
} from '@ecdlink/ui';
import { DialogPosition } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PhotoPrompt } from '../../../../../components/photo-prompt/photo-prompt';
import { useDocuments } from '@hooks/useDocuments';
import { useAppDispatch } from '@store';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import * as styles from '../../edit-practitioner-profile.styles';
import { AddPhotoProps } from './add-photo.types';
import { cloneDeep } from 'lodash';

export const AddPhoto: React.FC<AddPhotoProps> = ({ onSubmit, isLoading }) => {
  const user = useSelector(userSelectors.getUser);
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

  const picturePromtOnAction = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);

    const copy = Object.assign({}, user);
    if (copy) {
      copy.profileImageUrl = imageBaseString;
      appDispatch(userActions.updateUser(copy));
    }

    if (!userProfilePicture) {
      await createNewDocument({
        data: imageBaseString,
        userId: user?.id || '',
        fileType: FileTypeEnum.ProfileImage,
        fileName: `ProfilePicture_${user?.id}.png`,
      });
    } else {
      updateDocument(userProfilePicture, imageBaseString);
    }

    // save details with request updateUser
    const userCopy = cloneDeep(user);

    if (userCopy) {
      if (imageBaseString?.length > 0) {
        userCopy.profileImageUrl = imageBaseString;
      }
      appDispatch(userActions.updateUser(userCopy));
      appDispatch(userThunkActions.updateUser(userCopy));
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
        isLoading={isLoading}
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
            onAction={picturePromtOnAction}
            onDelete={userProfilePicture ? handleDelete : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </>
  );
};
