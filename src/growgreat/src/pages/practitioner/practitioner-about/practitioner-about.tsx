import {
  LanguageDto,
  LocalStorageKeys,
  UserDto,
  useDialog,
  usePrevious,
  useTheme,
} from '@ecdlink/core';
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
  Dropdown,
  Avatar,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useDocuments } from '@/hooks/useDocuments';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { DialogFormInput } from '@/models/practitioner/DialogFormInput';
import {
  initialPractitionerAboutValues,
  PractitionerAboutModel,
  practitionerAboutModelSchema,
} from '@/schemas/practitioner/practitioner-about';
import { useAppDispatch } from '@store';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import { analyticsActions } from '@/store/analytics';
import { setStorageItem } from '@/utils/common/local-storage.utils';
import * as styles from '@/pages/practitioner/practitioner-about/practitioner-about.styles';
import ROUTES from '@/routes/routes';
import { staticDataSelectors } from '@/store/static-data';
import {
  healthCareWorkerSelectors,
  healthCareWorkerThunkActions,
} from '@/store/healthCareWorker';
import { ClinicDetails } from './components/clinicDetails/clinic-details';
import { EditCellPhoneNumber } from './edit-cellphone-number/edit-cellphone-number';
import { PractitionerAboutRouteState } from './practitioner-about.types';
import { BackToCommunityDialog } from './components/back-to-community-modal';
import { communitySelectors } from '@/store/community';
import { LeaderProfileRouteState } from '@/pages/community/team-tab/team/members/leader-profile/types';

export const PractitionerAbout: React.FC = () => {
  const location = useLocation<PractitionerAboutRouteState>();
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
  const [editLanguageFieldVisible, setEditLanguageFieldVisible] =
    useState(false);
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [editiCellPhoneNumber, setEditiCellPhoneNumber] = useState(false);
  const user = useSelector(userSelectors.getUser);

  const healthCareWorker = useSelector(
    healthCareWorkerSelectors?.getHealthCareWorker
  );

  const languages = useSelector(staticDataSelectors.getLanguages);
  const clinic = useSelector(communitySelectors.getClinicSelector);

  const pictureStorageKey = LocalStorageKeys.practitionerProfilePicture;
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [clinicDetails, setClinicDetails] = useState(false);

  const dialog = useDialog();
  const isFromCommunityWelcome = location?.state?.isFromCommunityWelcome;
  const wasFromCommunityWelcome = usePrevious(isFromCommunityWelcome);

  const avatar =
    userProfilePicture?.file ||
    user?.profileImageUrl ||
    userProfilePicture?.reference;

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: PractitionerAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user.email || '',
        languageId: user?.languageId || healthCareWorker?.languageId || '',
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
    setValue: practitionerAboutFormSetValue,
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
    const selectedLanguage = languages?.find(
      (item) => item?.id === practitionerAboutFormGetValues('languageId')
    );
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
        title: 'Your clinic & GGC team',
        subTitle: clinic?.name || '',
        switchTextStyles: true,
        actionName: 'View',
        actionIcon: 'EyeIcon',
        buttonType: 'filled',
        onActionClick: () => {
          setClinicDetails(true);
        },
      },
      ...(!!clinic?.teamLeads?.length
        ? clinic?.teamLeads?.map(
            (leader, index) =>
              ({
                title: `Your Team Leader ${index + 1}`,
                subTitle: `${leader?.firstName ?? ''} ${leader?.surname}`,
                switchTextStyles: true,
                actionName: 'View',
                actionIcon: 'EyeIcon',
                buttonType: 'filled',
                onActionClick: () =>
                  history.push(
                    ROUTES.COMMUNITY.TEAM.MEMBERS.LEADER_PROFILE.replace(
                      ':leaderId',
                      leader?.id!
                    ),
                    { isFromAboutPage: true } as LeaderProfileRouteState
                  ),
              } as ActionListDataItem)
          )
        : [
            {
              title: 'Your Team Leader',
              subTitle: 'None',
              switchTextStyles: true,
            } as ActionListDataItem,
          ]),
      {
        title: 'Preferred language on app',
        subTitle: selectedLanguage?.description || 'Add a language',
        switchTextStyles: true,
        actionName: selectedLanguage?.description ? 'Edit' : 'Add',
        actionIcon: selectedLanguage?.description ? 'PencilIcon' : 'PlusIcon',
        buttonType: selectedLanguage?.description ? 'outlined' : 'filled',
        onActionClick: () => {
          editField({
            label: 'Language',
            formFieldName: 'languageId',
            value: practitionerAboutFormGetValues().languageId,
          });
        },
      },
    ];

    setListItems(list);
  };

  const editField = (
    formInputToLoad: DialogFormInput<PractitionerAboutModel>
  ) => {
    if (formInputToLoad.label === 'Language') {
      setDialogFormInput(formInputToLoad);
      return setEditLanguageFieldVisible(true);
    } else {
      setDialogFormInput(formInputToLoad);
      setEditFieldVisible(true);
    }
  };

  const saveEdit = async () => {
    if (practitionerAboutFormState.errors[dialogFormInput.formFieldName]) {
      setDisplayError(true);
    } else {
      setEditFieldVisible(false);
      setEditLanguageFieldVisible(false);
      savePractitionerUserData();
    }
  };

  const displayProfilePicturePrompt = useCallback(() => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  }, [editProfilePictureVisible]);

  const handlePicturePromptOnClose = () => {
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
                } as PractitionerAboutRouteState);
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
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
    setEditLanguageFieldVisible(false);
  };

  const deleteProfilePicture = () => {
    if (userProfilePicture) deleteDocument(userProfilePicture);

    const copy = Object.assign({}, user);
    if (copy) {
      copy.profileImageUrl = '';
      appDispatch(userActions.updateUser(copy));
    }

    if (!isFromCommunityWelcome) {
      setEditProfilePictureVisible(!editProfilePictureVisible);
    }
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
  };

  const savePractitionerUserData = () => {
    const practitionerForm = practitionerAboutFormGetValues();

    const copy = Object.assign({}, user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone;
      copy.email = practitionerForm.email;
      copy.languageId = practitionerForm.languageId;

      appDispatch(userActions.updateUser(copy));
      appDispatch(userThunkActions.updateUser(copy));
      appDispatch(
        healthCareWorkerThunkActions.updateHealthCareWorker({
          userId: user?.id!,
          input: {
            languageId: practitionerForm.languageId,
            isRegistered: healthCareWorker?.isRegistered!,
          },
        })
      );

      setNewStackListItems(copy);
    }
  };

  useEffect(() => {
    if (isFromCommunityWelcome && !wasFromCommunityWelcome) {
      displayProfilePicturePrompt();
    }
  }, [
    displayProfilePicturePrompt,
    isFromCommunityWelcome,
    wasFromCommunityWelcome,
  ]);

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

  useEffect(() => {
    if (user) {
      setNewStackListItems(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className={styles.container}>
      <Dialog fullScreen visible={clinicDetails} position={DialogPosition.Top}>
        <ClinicDetails setClinicDetails={setClinicDetails} />
      </Dialog>
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
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'About me'}
        size="medium"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.PRACTITIONER.PROFILE.ROOT)}
        displayOffline={!isOnline}
      >
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={userProfilePicture?.file || user?.profileImageUrl || ''}
            size={'header'}
            className="bg-secondary"
            onPressed={displayProfilePicturePrompt}
            hasConsent={true}
          />
        </div>
        <StackedList
          className={'px-4'}
          listItems={listItems}
          type={'ActionList'}
        />
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
            />
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
              />
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
            />
          </Button>
        </div>
      </Dialog>
      <Dialog
        stretch={true}
        borderRadius="normal"
        visible={editLanguageFieldVisible}
        position={DialogPosition.Middle}
      >
        <div className={'p-4'}>
          <div className={styles.labelContainer}>
            <Typography
              type="body"
              className=""
              color="textDark"
              text={'Change preferred language on CHW Connect'}
              weight="bold"
            />
            <div onClick={closeEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </div>
          </div>
          <Dropdown
            placeholder={'Choose language'}
            list={
              (languages &&
                languages.map((language: LanguageDto) => ({
                  label: language.description,
                  value: language.id || '',
                }))) ||
              []
            }
            fillType="clear"
            fullWidth={true}
            label={'Language'}
            selectedValue={practitionerAboutFormGetValues().languageId}
            onChange={(item: string) => {
              practitionerAboutFormSetValue('languageId', item, {
                shouldValidate: true,
              });
            }}
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
              />
            </div>
          )}
          <Button
            type="filled"
            color="primary"
            className={'mt-4 w-full'}
            onClick={saveEdit}
          >
            {renderIcon('SaveIcon', styles.buttonIcon)}
            <Typography
              type="help"
              className="mr-2"
              color="white"
              text={'Save'}
            />
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
            onClose={handlePicturePromptOnClose}
            onAction={picturePromtOnAction}
            onDelete={userProfilePicture ? deleteProfilePicture : undefined}
          />
        </div>
      </Dialog>
    </div>
  );
};
