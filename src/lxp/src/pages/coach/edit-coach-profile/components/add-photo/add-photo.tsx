import { PhotoPrompt } from '../../../../../components/photo-prompt/photo-prompt';
import { FileTypeEnum } from '@ecdlink/graphql';
import { coachActions, coachSelectors, coachThunkActions } from '@store/coach';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import * as styles from '../../edit-coach-profile.styles';
import { useDocuments } from '@hooks/useDocuments';
import { AddPhotoProps } from './add-photo.types';
import {
  DialogPosition,
  renderIcon,
  Button,
  Dialog,
  Divider,
  ProfileAvatar,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { useState } from 'react';
import { cloneDeep } from 'lodash';

export const AddPhoto: React.FC<AddPhotoProps> = ({ onSubmit }) => {
  const coach = useSelector(coachSelectors.getCoach);
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

  const picturePromptOnAction = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);

    const copy = Object.assign({}, coach);
    if (copy) {
      const tmpUser = Object.assign({}, copy.user);
      tmpUser.profileImageUrl = imageBaseString;
      copy.user = tmpUser;

      appDispatch(coachActions.updateCoach(copy));
      appDispatch(coachThunkActions.updateCoach(copy));
    }

    if (!userProfilePicture) {
      await createNewDocument({
        data: imageBaseString,
        userId: coach?.user?.id || '',
        fileType: FileTypeEnum.ProfileImage,
        fileName: `ProfilePicture_${coach?.user?.id}.png`,
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
            : 'Add a photo of yourself so your practitioners will recognise you.'
        }
        type="body"
        color="textDark"
        className="font-medium"
      />

      <div className={'inline-flex w-full justify-center pt-16 pb-12'}>
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
