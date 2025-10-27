import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useAppDispatch } from '@/store';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useDocuments } from '@/hooks/useDocuments';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useSnackbar } from '@ecdlink/core';

interface EditLogoProps {
  setShowEditLogo: (item: boolean) => void;
}

export const EditLogo: React.FC<EditLogoProps> = ({ setShowEditLogo }) => {
  const { isOnline } = useOnlineStatus();
  const { classroomImage, deleteDocument } = useDocuments();
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [classImageString, setClassImageString] = useState<string>();
  const appDispatch = useAppDispatch();

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal === true;
  const { showMessage } = useSnackbar();

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const saveClassroomPicture = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
    setClassImageString(imageBaseString);
  };

  const saveLogo = async () => {
    if (!classroom) {
      return;
    }
    const copy = Object.assign({}, classroom);
    if (copy) {
      copy.classroomImageUrl = classImageString || '';
      appDispatch(classroomsActions.updateClassroom(copy));
      await appDispatch(classroomsThunkActions.upsertClassroom({}));
    }
  };

  const deleteClassroomPicture = () => {
    deleteDocument(classroomImage);
    setClassImageString('');
    displayProfilePicturePrompt();
  };

  return (
    <div>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title={`Preschool logo`}
        onBack={() => setShowEditLogo(false)}
        className="p-4"
      >
        <Typography
          type="h2"
          color="textDark"
          text={'Add/edit your preschool logo'}
        />

        <div className="inline-flex w-full justify-center pt-8 pb-20">
          <ProfileAvatar
            dataUrl={classImageString || classroom?.classroomImageUrl || ''}
            size={'header'}
            onPressed={isPrincipal ? displayProfilePicturePrompt : () => {}}
            hasConsent={true}
            isPreschoolImage={true}
            canChangeImage={isPrincipal ? true : false}
          />
        </div>
        <Alert
          className="my-6 rounded-md"
          title={`Your preschool logo will be added to each attendance register, income statement and child progress report.`}
          type="info"
        />
        <div className="mb-4 mt-4 w-full self-end">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="quatenary"
            text="Save"
            textColor="white"
            icon="SaveIcon"
            disabled={!classImageString}
            onClick={() => {
              saveLogo();
              setShowEditLogo(false);
              showMessage({
                message: 'Preschool logo updated!',
                type: 'success',
              });
            }}
          />
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="quatenary"
            text="Cancel"
            textColor="quatenary"
            icon="XIcon"
            onClick={() => setShowEditLogo(false)}
          />
        </div>
      </BannerWrapper>
      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title={
              classroom?.classroomImageUrl!!
                ? 'Update preschool logo'
                : 'Preschool logo'
            }
            onClose={displayProfilePicturePrompt}
            onAction={saveClassroomPicture}
            onDelete={classroomImage ? deleteClassroomPicture : undefined}
          />
        </div>
      </Dialog>
    </div>
  );
};
