import { LocalStorageKeys, UserDto, useTheme } from '@ecdlink/core';
import { FileTypeEnum } from '@ecdlink/graphql';
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
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { DialogFormInput } from '@models/practitioner/DialogFormInput';
import {
  initialPractitionerAboutValues,
  PractitionerAboutModel,
  practitionerAboutModelSchema,
} from '@schemas/practitioner/practitioner-about';
import { useAppDispatch } from '@store';
import { userActions, userSelectors, userThunkActions } from '@store/user';
import { analyticsActions } from '@store/analytics';
import { setStorageItem } from '@utils/common/local-storage.utils';
import * as styles from './practitioner-about.styles';
import ROUTES from '@routes/routes';
import { EditCellPhoneNumber } from './edit-cellphone-number/edit-cellphone-number';
import { practitionerSelectors } from '@/store/practitioner';
import { NextToKin } from './next-to-kin/next-to-kin';
import { coachSelectors } from '@/store/coach';

export const PractitionerAbout: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const {
    userProfilePicture,
    deleteDocument,
    createNewDocument,
    updateDocument,
  } = useDocuments();

  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [editiCellPhoneNumber, setEditiCellPhoneNumber] = useState(false);
  const [addNextToKin, setAddNextToKin] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner About',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const coach = useSelector(coachSelectors?.getCoach);
  const pictureStorageKey = LocalStorageKeys.practitionerProfilePicture;
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);

  useEffect(() => {
    if (user) {
      setNewStackListItems(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: PractitionerAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user?.email! || '',
      };
      return tempPractitioner;
    } else {
      return initialPractitionerAboutValues;
    }
  };

  const {
    register: practitionerAboutRegister,
    formState: practitionerAboutFormState,
    getValues: practitionerAboutFormGetValues,
  } = useForm({
    resolver: yupResolver(practitionerAboutModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  const [dialogFormInput, setDialogFormInput] = useState<
    DialogFormInput<PractitionerAboutModel>
  >({
    label: '',
    formFieldName: 'name',
    value: '',
  });

  const { theme } = useTheme();

  const setNewStackListItems = (currentUser: UserDto) => {
    const list: ActionListDataItem[] = [
      {
        title: 'Cellphone Number',
        subTitle: currentUser?.phoneNumber || 'Add an Cellphone Number',
        switchTextStyles: true,
        actionName: currentUser?.phoneNumber ? 'Edit' : 'Add',
        actionIcon: currentUser?.phoneNumber ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.phoneNumber ? 'outlined' : 'filled',
        onActionClick: () => {
          setEditiCellPhoneNumber(true);
        },
      },
      {
        title: 'Email Address',
        subTitle: currentUser?.email || 'Add an Email Address',
        switchTextStyles: true,
        actionName: currentUser?.email ? 'Edit' : 'Add',
        actionIcon: currentUser?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.email ? 'outlined' : 'filled',
        onActionClick: () => {
          editField({
            label: 'Email Address',
            formFieldName: 'email',
            value: practitionerAboutFormGetValues().email,
          });
        },
      },
      {
        title: 'Your SmartStart club',
        subTitle: 'N/A',
        switchTextStyles: true,
        actionName: currentUser?.email ? 'Edit' : 'Add',
        actionIcon: currentUser?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.email ? 'outlined' : 'filled',
        // onActionClick: () => {
        //   editField({
        //     label: 'Email Address',
        //     formFieldName: 'email',
        //     value: practitionerAboutFormGetValues().email,
        //   });
        // },
      },
      {
        title: 'Your SmartStart coach',
        subTitle: coach?.user?.fullName || 'N/A',
        switchTextStyles: true,
      },
      {
        title: 'Next of kin',
        subTitle: currentUser?.emergencyContactFirstName || 'Add next of kin',
        switchTextStyles: true,
        actionName: currentUser?.emergencyContactFirstName ? 'Edit' : 'Add',
        actionIcon: currentUser?.emergencyContactFirstName
          ? 'PencilIcon'
          : 'PlusIcon',
        buttonType: currentUser?.emergencyContactFirstName
          ? 'outlined'
          : 'filled',
        onActionClick: () => {
          setAddNextToKin(true);
        },
      },
      {
        title: 'Signature',
        subTitle: practitioner?.signingSignature
          ? 'Replace your signature'
          : 'Add your signature',
        switchTextStyles: true,
        actionName: practitioner?.signingSignature ? 'Edit' : 'Add',
        actionIcon: practitioner?.signingSignature ? 'PencilIcon' : 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.ABOUT.SIGNATURE);
        },
      },
    ];

    setListItems(list);
  };

  const editField = (
    formInputToLoad: DialogFormInput<PractitionerAboutModel>
  ) => {
    setDialogFormInput(formInputToLoad);
    setEditFieldVisible(true);
  };

  const saveEdit = async () => {
    if (practitionerAboutFormState.errors[dialogFormInput.formFieldName]) {
      setDisplayError(true);
    } else {
      setEditFieldVisible(false);
      await savePractitionerUserData();
    }
  };

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

  const picturePromtOnAction = async (imageBaseString: string) => {
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

    await savePractitionerUserData(imageBaseString);
  };

  const savePractitionerUserData = (imageBaseString: string = '') => {
    const practitionerForm = practitionerAboutFormGetValues();
    const copy = Object.assign({}, user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email;
      if (imageBaseString?.length > 0) {
        copy.profileImageUrl = imageBaseString;
      }

      appDispatch(userActions.updateUser(copy));
      appDispatch(userThunkActions.updateUser(copy));

      setNewStackListItems(copy);
    }
  };

  return (
    <div className={styles.container}>
      <Dialog
        fullScreen
        visible={editiCellPhoneNumber}
        position={DialogPosition.Top}
      >
        <EditCellPhoneNumber
          setEditiCellPhoneNumber={setEditiCellPhoneNumber}
          user={user}
        />
      </Dialog>
      <Dialog fullScreen visible={addNextToKin} position={DialogPosition.Top}>
        <NextToKin setAddNextToKin={setAddNextToKin} user={user} />
      </Dialog>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'About me'}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.PRACTITIONER.PROFILE.ROOT)}
        displayOffline={!isOnline}
      >
        <div className="px-4">
          <div className={'inline-flex w-full justify-center pt-8'}>
            <ProfileAvatar
              dataUrl={userProfilePicture?.file || user?.profileImageUrl}
              size={'header'}
              onPressed={displayProfilePicturePrompt}
              hasConsent={true}
            />
          </div>
          <StackedList
            className={'bg-uiBg h-auto'}
            listItems={listItems}
            type={'ActionList'}
          ></StackedList>
          {practitioner?.signingSignature && (
            <img
              alt="signature"
              className="max-h-24 py-4"
              src={practitioner.signingSignature}
            />
          )}
        </div>
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
          <FormInput<PractitionerAboutModel>
            visible={true}
            nameProp={dialogFormInput.formFieldName}
            register={practitionerAboutRegister}
            disabled={false}
            className={!displayError ? 'mb-6' : ''}
          />
          {displayError && (
            <div className={'mt-2'}>
              <Typography
                type="help"
                color="errorMain"
                text={
                  practitionerAboutFormState.errors[
                    dialogFormInput.formFieldName
                  ]?.message || ''
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
            onAction={picturePromtOnAction}
            onDelete={userProfilePicture ? deleteProfilePicture : undefined}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </div>
  );
};
