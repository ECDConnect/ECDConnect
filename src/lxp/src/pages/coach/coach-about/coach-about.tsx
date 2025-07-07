import {
  LocalStorageKeys,
  CoachDto,
  UserDto,
  useTheme,
  useDialog,
} from '@ecdlink/core';
import { FileTypeEnum } from '@ecdlink/graphql';
import {
  ActionListDataItem,
  Avatar,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  FormInput,
  ProfileAvatar,
  renderIcon,
  StackedList,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { cloneDeep } from 'lodash';

import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { DialogFormInput } from '@models/practitioner/DialogFormInput';
import { setStorageItem } from '@utils/common/local-storage.utils';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { coachActions, coachSelectors, coachThunkActions } from '@store/coach';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { yupResolver } from '@hookform/resolvers/yup';
import { childrenSelectors } from '@/store/children';
import { analyticsActions } from '@store/analytics';
import { useDocuments } from '@hooks/useDocuments';
import * as styles from './coach-about.styles';
import { useAppDispatch } from '@store';
import ROUTES from '@routes/routes';
import {
  initialCoachAboutValues,
  CoachAboutModel,
  coachAboutModelSchema,
} from '@schemas/coach/coach-about';
import { CoachAboutRouteState } from './coach-about.types';
import { usePrevious } from 'react-use';
import { BackToCommunityDialog } from './components/back-to-community-dialog/indext';
import { VerifyPhoneNumberAuthCode } from '@/components/user-registration/components/verify-phone-number';
import { AuthService } from '@/services/AuthService';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export const CoachAbout: React.FC = () => {
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const [openVerifyPhoneNumber, setOpenVerifyPhoneNumber] = useState(false);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const { theme } = useTheme();
  const {
    createNewDocument,
    deleteDocument,
    updateDocument,
    userProfilePicture,
  } = useDocuments();

  const dialog = useDialog();

  const location = useLocation<CoachAboutRouteState>();
  const isFromCommunityWelcome = location?.state?.isFromCommunityWelcome;
  const wasFromCommunityWelcome = usePrevious(isFromCommunityWelcome);

  const pictureStorageKey = LocalStorageKeys.coachProfilePicture;

  const [oldUserNumber, setOldUserNumber] = useState('');

  useEffect(() => {
    if (user?.phoneNumber) {
      setOldUserNumber(user?.phoneNumber);
    }
  }, []);

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

  const practitioners = useSelector(
    practitionerForCoachSelectors.getPractitionersForCoach
  );
  const children = useSelector(childrenSelectors.getChildren);
  const coach = useSelector(coachSelectors.getCoach);
  const user = useSelector(userSelectors.getUser);

  const avatar =
    userProfilePicture?.file ||
    user?.profileImageUrl ||
    userProfilePicture?.reference;

  useEffect(() => {
    if (coach) setNewStackListItems(coach);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coach]);

  const getDefaultFormvalues = () => {
    if (coach) {
      const tmpCoach: CoachAboutModel = {
        name: coach.user?.firstName || '',
        surname: coach.user?.surname || '',
        cellphone: coach.user?.phoneNumber || '',
        email: coach.user?.email || '',
        signingSignature: coach.signingSignature || '',
        address: coach.siteAddressId || '',
      };

      return tmpCoach;
    } else {
      return initialCoachAboutValues;
    }
  };

  const {
    register: coachAboutRegister,
    formState: coachAboutFormState,
    getValues: coachAboutFormGetValues,
    watch: coachAboutFormWatch,
  } = useForm({
    resolver: yupResolver(coachAboutModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  useEffect(() => {
    coachAboutFormWatch();
  }, [coachAboutFormWatch]);

  const { cellphone } = coachAboutFormWatch();

  const setNewStackListItems = (currentUser: CoachDto) => {
    const list: ActionListDataItem[] = [
      {
        title: 'First Name',
        subTitle: currentUser?.user?.firstName,
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
        subTitle: currentUser?.user?.surname,
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
        subTitle: currentUser?.user?.phoneNumber || 'Add an Cellphone Number',
        switchTextStyles: true,
        actionName: currentUser?.user?.phoneNumber ? 'Edit' : 'Add',
        actionIcon: currentUser?.user?.phoneNumber ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.user?.phoneNumber ? 'filled' : 'outlined',
        onActionClick: () => {
          editField({
            label: 'Cellphone Number',
            formFieldName: 'cellphone',
            value: cellphone,
          });
        },
      },
      {
        title: 'Email address',
        subTitle: currentUser?.user?.email || 'Add an Email Address',
        switchTextStyles: true,
        actionName: currentUser?.user?.email ? 'Edit' : 'Add',
        actionIcon: currentUser?.user?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: currentUser?.user?.email ? 'filled' : 'outlined',
        onActionClick: () => {
          editField({
            label: 'Email Address',
            formFieldName: 'email',
            value: coachAboutFormGetValues().email,
          });
        },
      },
    ];
    setListItems(list);
  };

  const handleSaveNewPhone = async () => {
    // await saveCoachUserData();
    const resendAuthCode = await new AuthService().SendOAAuthCode(
      user?.userName!,
      coachAboutFormGetValues()?.cellphone
    );

    setOpenVerifyPhoneNumber(true);
  };

  const editField = (formInputToLoad: DialogFormInput<CoachAboutModel>) => {
    setDialogFormInput(formInputToLoad);
    setEditFieldVisible(true);
  };

  const saveEdit = async () => {
    if (coachAboutFormState.errors[dialogFormInput.formFieldName]) {
      setDisplayError(true);
    } else {
      if (dialogFormInput.formFieldName === 'cellphone') {
        handleSaveNewPhone();
        return;
      }
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

  const displayProfilePicturePrompt = useCallback(() => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  }, [editProfilePictureVisible]);

  const handlePicturePromptOnClose = useCallback(() => {
    if (isFromCommunityWelcome) {
      return dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onClose) => {
          return (
            <BackToCommunityDialog
              hideTitle={!avatar}
              avatar={
                avatar ? (
                  <Avatar dataUrl={avatar} size="header" className="mb-4" />
                ) : undefined
              }
              onSubmit={() => {
                history.push(ROUTES.COMMUNITY.ROOT, {
                  isFromCommunityWelcome: false,
                } as CoachAboutRouteState);
                onClose();
              }}
              onClose={() => {
                displayProfilePicturePrompt();
                onClose();
              }}
            />
          );
        },
      });
    }

    displayProfilePicturePrompt();
  }, [
    avatar,
    dialog,
    displayProfilePicturePrompt,
    history,
    isFromCommunityWelcome,
  ]);

  const closeEditField = () => {
    setEditFieldVisible(false);
  };

  const deleteProfilePicture = () => {
    if (userProfilePicture) deleteDocument(userProfilePicture);

    const coachCopy = cloneDeep(coach);
    const userCopy = cloneDeep(user);

    if (coachCopy && userCopy) {
      userCopy.profileImageUrl = '';
      Object.assign(coachCopy.user as UserDto, userCopy);
      appDispatch(coachActions.updateCoach(coachCopy));
      appDispatch(userActions.updateUser(userCopy));
    }

    if (!isFromCommunityWelcome) {
      setEditProfilePictureVisible(!editProfilePictureVisible);
    }
  };

  const picturePromptOnAction = async (imageBaseString: string) => {
    setStorageItem(imageBaseString, pictureStorageKey);

    if (!isFromCommunityWelcome) {
      setEditProfilePictureVisible(!editProfilePictureVisible);
    }

    const copy = Object.assign({}, user);
    if (copy) {
      copy.profileImageUrl = imageBaseString;
      appDispatch(userActions.updateUser(copy));
    }

    saveCoachUserData(imageBaseString);
  };

  const saveCoachUserData = async (imageBaseString: string = '') => {
    const coachForm = coachAboutFormGetValues();
    const coachCopy = cloneDeep(coach);
    const userCopy = cloneDeep(user);

    if (coachCopy && userCopy) {
      userCopy.firstName = coachForm.name;
      userCopy.surname = coachForm.surname;
      userCopy.phoneNumber = coachForm.cellphone;
      userCopy.email = coachForm.email;
      userCopy.fullName = `${userCopy.firstName} ${userCopy.surname}`;
      if (imageBaseString?.length > 0) {
        userCopy.profileImageUrl = imageBaseString;
      }

      Object.assign(coachCopy.user as UserDto, userCopy);

      await appDispatch(userActions.updateUser(userCopy));
      await appDispatch(userThunkActions.updateUser(userCopy));

      await appDispatch(coachActions.updateCoach(coachCopy));
      await appDispatch(coachThunkActions.updateCoach(coachCopy));

      setNewStackListItems(coachCopy);
    }
  };

  const saveNewPractitionerUserData = async (imageBaseString: string = '') => {
    const coachForm = coachAboutFormGetValues();
    const coachCopy = cloneDeep(coach);
    const userCopy = cloneDeep(user);

    if (coachCopy && userCopy) {
      userCopy.firstName = coachForm.name;
      userCopy.surname = coachForm.surname;
      userCopy.phoneNumber = coachForm?.cellphone;
      userCopy.email = coachForm.email;
      userCopy.fullName = `${userCopy.firstName} ${userCopy.surname}`;
      if (imageBaseString?.length > 0) {
        userCopy.profileImageUrl = imageBaseString;
      }

      Object.assign(coachCopy.user as UserDto, userCopy);

      await appDispatch(userActions.updateUser(userCopy));
      await appDispatch(userThunkActions.updateUser(userCopy));

      await appDispatch(coachActions.updateCoach(coachCopy));
      await appDispatch(coachThunkActions.updateCoach(coachCopy));

      setNewStackListItems(coachCopy);
    }
  };

  useEffect(() => {
    if (isFromCommunityWelcome && !wasFromCommunityWelcome) {
      displayProfilePicturePrompt();
    }
  }, [
    displayProfilePicturePrompt,
    wasFromCommunityWelcome,
    isFromCommunityWelcome,
  ]);

  return (
    <div className={styles.container}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={'About me'}
        color={'primary'}
        size="medium"
        renderBorder={true}
        renderOverflow={true}
        onBack={() => {
          isFromCommunityWelcome
            ? history.goBack()
            : history.push(ROUTES.COACH.PROFILE.ROOT, {
                isFromCommunityWelcome: false,
              } as CoachAboutRouteState);
        }}
        displayOffline={!isOnline}
        backgroundColour={'white'}
      >
        <div className="px-4">
          <div className={'inline-flex w-full justify-center pt-8'}>
            <ProfileAvatar
              dataUrl={avatar}
              size={'header'}
              onPressed={displayProfilePicturePrompt}
              hasConsent={true}
            />
          </div>
          <div className="my-4 flex justify-center">
            {practitioners && (
              <StatusChip
                className="mr-2"
                backgroundColour="infoDark"
                textColour={'white'}
                borderColour="infoDark"
                text={`${practitioners?.length} practitioners`}
              />
            )}
            {children && (
              <StatusChip
                className={'ml-2'}
                backgroundColour="primary"
                textColour={'white'}
                borderColour="primary"
                text={`${children.length} children`}
              />
            )}
          </div>
          <StackedList
            className={'white'}
            listItems={listItems}
            type={'ActionList'}
          ></StackedList>
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
            color="quatenary"
            className={'w-full'}
            onClick={saveEdit}
          >
            {renderIcon('SaveIcon', styles.buttonIcon)}
            <Typography
              type="h6"
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
        <PhotoPrompt
          title="Profile Photo"
          onClose={handlePicturePromptOnClose}
          onAction={picturePromptOnAction}
          onDelete={
            userProfilePicture || avatar ? deleteProfilePicture : undefined
          }
          showEmojiOption={true}
          isProfileEmojis={true}
        ></PhotoPrompt>
      </Dialog>
      <Dialog
        visible={openVerifyPhoneNumber}
        position={DialogPosition.Full}
        className="w-full"
        stretch
      >
        <VerifyPhoneNumberAuthCode
          closeAction={setOpenVerifyPhoneNumber}
          username={user?.userName!}
          handleChangePhoneNumber={saveCoachUserData}
          isFromEditCellPhone={true}
          saveNewPractitionerUserData={saveCoachUserData}
          setEditiCellPhoneNumber={setEditFieldVisible}
          phoneNumber={cellphone}
        />
      </Dialog>
    </div>
  );
};
