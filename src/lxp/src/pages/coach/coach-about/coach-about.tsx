import { LocalStorageKeys, UserDto, useTheme } from '@ecdlink/core';
import { FileTypeEnum } from '@ecdlink/graphql';
import * as styles from './coach-about.styles';
import {
  ActionListDataItem,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  ProfileAvatar,
  renderIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import {
  initialCoachAboutValues,
  CoachAboutModel,
  coachAboutModelSchema,
} from '@schemas/coach/coach-about';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { DialogFormInput } from '@models/practitioner/DialogFormInput';
import { setStorageItem } from '@utils/common/local-storage.utils';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { userActions, userSelectors } from '@store/user';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyticsActions } from '@store/analytics';
import { useDocuments } from '@hooks/useDocuments';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '@store';
import ROUTES from '@routes/routes';

export const CoachAbout: React.FC = () => {
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [editAddressFieldVisible, setEditAddressFieldVisible] = useState(false);
  const pictureStorageKey = LocalStorageKeys.practitionerProfilePicture;
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const {
    createNewDocument,
    deleteDocument,
    updateDocument,
    userProfilePicture,
  } = useDocuments();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Coach About',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const user = useSelector(userSelectors.getUser);

  useEffect(() => {
    if (user) {
      setNewStackListItems(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getDefaultFormvalues = () => {
    if (user) {
      const tempCoach: CoachAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user.email,
      };
      return tempCoach;
    } else {
      return initialCoachAboutValues;
    }
  };

  const {
    register: coachAboutRegister,
    formState: coachAboutFormState,
    getValues: coachAboutFormGetValues,
  } = useForm({
    resolver: yupResolver(coachAboutModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  const setNewStackListItems = (currentUser: UserDto) => {
    const list: ActionListDataItem[] = [
      {
        title: 'First Name',
        subTitle: currentUser?.firstName,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        switchTextStyles: true,
        onActionClick: () => {
          editField({
            label: 'First Name',
            formFieldName: 'name',
            value: coachAboutFormGetValues().name,
          });
        },
      },
      {
        title: 'Surname',
        subTitle: currentUser?.surname,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        switchTextStyles: true,
        onActionClick: () => {
          editField({
            label: 'Surname',
            formFieldName: 'surname',
            value: coachAboutFormGetValues().surname,
          });
        },
      },
      {
        title: 'Cellphone Number',
        subTitle: currentUser?.phoneNumber || 'Add an Cellphone Number',
        switchTextStyles: true,
        actionName: currentUser?.phoneNumber ? 'Edit' : 'Add',
        actionIcon: currentUser?.phoneNumber ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.phoneNumber ? 'outlined' : 'filled',
        onActionClick: () => {
          editField({
            label: 'Cellphone Number',
            formFieldName: 'cellphone',
            value: coachAboutFormGetValues().cellphone,
          });
        },
      },
      {
        title: 'Email address',
        subTitle: currentUser?.email || 'Add an Email Address',
        switchTextStyles: true,
        actionName: currentUser?.email ? 'Edit' : 'Add',
        actionIcon: currentUser?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.email ? 'outlined' : 'filled',
        onActionClick: () => {
          editField({
            label: 'Email Address',
            formFieldName: 'email',
            value: coachAboutFormGetValues().email,
          });
        },
      },
      {
        title: 'Work address',
        subTitle: 'Add a work address',
        switchTextStyles: true,
        actionName: currentUser?.email ? 'Edit' : 'Add',
        actionIcon: currentUser?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.email ? 'outlined' : 'filled',
        onActionClick: () => {
          addressEditField({
            label: 'Address',
            formFieldName: 'email',
            value: coachAboutFormGetValues().email,
          });
        },
      },
    ];
    setListItems(list);
  };

  const addressEditField = (
    formInputToLoad: DialogFormInput<CoachAboutModel>
  ): void => {
    setDialogFormInput(formInputToLoad);
    setEditAddressFieldVisible(true);
  };

  const closeAddressEditField = () => {
    setEditAddressFieldVisible(false);
  };

  const editField = (formInputToLoad: DialogFormInput<CoachAboutModel>) => {
    setDialogFormInput(formInputToLoad);
    setEditFieldVisible(true);
  };

  const saveEdit = async () => {
    if (coachAboutFormState.errors[dialogFormInput.formFieldName]) {
      setDisplayError(true);
    } else {
      setEditFieldVisible(false);
      await saveCoachUserData();
    }
  };

  const [dialogFormInput, setDialogFormInput] = useState<
    DialogFormInput<CoachAboutModel>
  >({
    label: '',
    formFieldName: 'name',
    value: '',
  });

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
  };

  const deleteProfilePicture = () => {
    if (userProfilePicture) deleteDocument(userProfilePicture);

    const copy = Object.assign({}, user);
    if (copy) {
      copy.profileImageUrl = '';
      appDispatch(userActions.updateUser(copy));
    }

    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    setStorageItem(imageBaseString, pictureStorageKey);
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
  };

  const saveCoachUserData = () => {
    const coachForm = coachAboutFormGetValues();
    const copy = Object.assign({}, user);
    if (copy) {
      copy.firstName = coachForm.name;
      copy.surname = coachForm.surname;
      copy.phoneNumber = coachForm.cellphone;
      copy.email = coachForm.email;

      appDispatch(userActions.updateUser(copy));

      setNewStackListItems(copy);
    }
  };

  return (
    <div className={styles.container}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'About me'}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.COACH.PROFILE.ROOT)}
        displayOffline={!isOnline}
      >
        <div className={'w-full inline-flex justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={userProfilePicture?.file || ''}
            size={'header'}
            onPressed={displayProfilePicturePrompt}
            hasConsent={true}
          />
        </div>
        <StackedList
          className={'bg-uiBg'}
          listItems={listItems}
          type={'ActionList'}
        ></StackedList>
      </BannerWrapper>

      <Dialog
        stretch={true}
        borderRadius="normal"
        visible={editFieldVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <div className={styles.labelContainer}>
            <Typography
              type="body"
              className=""
              color="textDark"
              text={dialogFormInput.label}
              weight="bold"
            ></Typography>
            <div onClick={closeEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </div>
          </div>
          <FormInput<CoachAboutModel>
            visible={true}
            nameProp={dialogFormInput.formFieldName}
            register={coachAboutRegister}
            disabled={false}
            className={!displayError ? 'mb-6' : ''}
          />
          {displayError && (
            <div className={'mt-2'}>
              <Typography
                type="help"
                color="errorMain"
                text={
                  coachAboutFormState.errors[dialogFormInput.formFieldName]
                    ?.message || ''
                }
                className={'mb-6'}
              ></Typography>
            </div>
          )}
          <Button
            type="filled"
            color="primary"
            className={'w-full'}
            onClick={saveEdit}
          >
            {renderIcon('SaveIcon', styles.buttonIcon)}
            <Typography
              type="help"
              className="mr-2"
              color="white"
              text={'Save'}
            ></Typography>
          </Button>
        </div>
      </Dialog>
      <Dialog
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title="Profile Photo"
            onClose={displayProfilePicturePrompt}
            onAction={picturePromptOnAction}
            onDelete={userProfilePicture ? deleteProfilePicture : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
      <Dialog
        stretch={true}
        borderRadius="normal"
        position={DialogPosition.Full}
        visible={editAddressFieldVisible}
      >
        <div className={'p-4'}>
          <div className={styles.labelContainer}>
            <Typography
              type="body"
              className=""
              color="textDark"
              text={dialogFormInput.label}
              weight="bold"
            ></Typography>
            <div onClick={closeAddressEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
