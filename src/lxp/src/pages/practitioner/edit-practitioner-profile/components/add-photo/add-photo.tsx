import { FileTypeEnum } from '@ecdlink/graphql';
import {
  Button,
  Dialog,
  Divider,
  ProfileAvatar,
  Typography,
  DialogPosition,
  renderIcon,
  Card,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PhotoPrompt } from '../../../../../components/photo-prompt/photo-prompt';
import { useDocuments } from '@hooks/useDocuments';
import { useAppDispatch } from '@store';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import * as styles from '../../edit-practitioner-profile.styles';
import { AddPhotoProps } from './add-photo.types';
import { cloneDeep } from 'lodash';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';

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

  const picturePromtOnAction = async (
    imageBaseString: string,
    isProfileEmojiPic?: boolean
  ) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
    const copy = Object.assign({}, user);
    if (copy) {
      copy.profileImageUrl = imageBaseString;
      copy.profilePicIsEmoji = isProfileEmojiPic;
      appDispatch(userActions.updateUser(copy));
    }

    // if (!userProfilePicture) {
    //   await createNewDocument({
    //     data: imageBaseString,
    //     userId: user?.id || '',
    //     fileType: FileTypeEnum.ProfileImage,
    //     fileName: `ProfilePicture_${user?.id}.png`,
    //   });
    // } else {
    //   updateDocument(userProfilePicture, imageBaseString);
    // }

    // save details with request updateUser
    const userCopy = cloneDeep(user);

    if (userCopy) {
      if (imageBaseString?.length > 0) {
        userCopy.profileImageUrl = imageBaseString;
        copy.profilePicIsEmoji = isProfileEmojiPic;
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
      <div className="flex w-full flex-col gap-11">
        <div className="mt-6 flex w-full px-4">
          <Card
            className="bg-uiBg mb-6 flex w-full flex-col items-center gap-3 p-6"
            borderRaduis="xl"
            shadowSize="lg"
          >
            <div className="">
              <Cebisa />
            </div>
            <Typography
              color="textDark"
              text={`Last step - add your photo!`}
              type={'h3'}
              align="center"
            />
          </Card>
        </div>
      </div>
      <div className={'inline-flex w-full justify-center pt-16 pb-12'}>
        <ProfileAvatar
          dataUrl={userProfilePicture?.file ?? user?.profileImageUrl ?? ''}
          size={'header'}
          onPressed={displayProfilePicturePrompt}
          hasConsent={true}
        />
      </div>

      <Divider dividerType="solid" className="mb-4" />

      <Button
        className="w-full"
        color="quatenary"
        type="filled"
        onClick={() => {
          onSubmit(userProfilePicture?.file ? '' : undefined);
        }}
        isLoading={isLoading}
      >
        {renderIcon(
          userProfilePicture?.file || user?.profileImageUrl
            ? 'SaveIcon'
            : 'ClockIcon',
          'mr-2 text-white w-5'
        )}
        <Typography
          type="h6"
          className="ml-2"
          text={
            userProfilePicture?.file || user?.profileImageUrl ? 'Save' : 'Skip'
          }
          color="white"
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
            onDelete={
              userProfilePicture || user?.profileImageUrl
                ? handleDelete
                : undefined
            }
            isProfileEmojis={true}
            showEmojiOption={true}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </>
  );
};
