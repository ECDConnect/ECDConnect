import {
  LocalStorageKeys,
  UserDto,
  useDialog,
  usePrevious,
} from '@ecdlink/core';
import {
  ActionListDataItem,
  ActionModal,
  Avatar,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  IMAGE_WIDTH,
  PasswordInput,
  ProfileAvatar,
  StackedList,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
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
import { EditEmail } from './edit-email/edit-email';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { NextOfKin } from './next-of-kin/next-of-kin';
import { getReportingPeriodForProfileUsePhotoInReport } from '@/utils/child/child-profile-utils';
import { PractitionerAboutRouteState } from './practitioner-about.types';
import { BackToCommunityDialog } from '@/pages/coach/coach-about/components/back-to-community-dialog/indext';
import { useTenant } from '@/hooks/useTenant';
import { DialogFormInput } from '@/models/practitioner/DialogFormInput';
import {
  PractitionerAccountModel,
  initialPractitionerAccountValues,
  practitionerAccountModelSchema,
} from '@/schemas/practitioner/practitioner-account';
import { UserResetPasswrodParams } from '@/store/user/user.types';
import { communitySelectors } from '@/store/community';
import TransparentLayer from '../../../assets/TransparentLayer.png';

export const PractitionerAbout: React.FC = () => {
  const location = useLocation<PractitionerAboutRouteState>();
  const history = useHistory();
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const { userProfilePicture, deleteDocument } = useDocuments();

  const communityProfile = useSelector(communitySelectors.getCommunityProfile);
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [editiCellPhoneNumber, setEditiCellPhoneNumber] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [addNextToKin, setAddNextToKin] = useState(false);
  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;

  const isFromCommunityWelcome = location?.state?.isFromCommunityWelcome;
  const wasFromCommunityWelcome = usePrevious(isFromCommunityWelcome);
  const [openChangeCommunityPic, setOpenChangeCommunityPic] = useState(false);

  const [dialogFormInput, setDialogFormInput] = useState<
    DialogFormInput<PractitionerAccountModel>
  >({ label: '', formFieldName: 'password', value: '' });
  const {
    register: practitionerAccountRegister,
    formState: practitionerAccountFormState,
    getValues: practitionerAccountFormGetValues,
    watch,
  } = useForm({
    resolver: yupResolver(practitionerAccountModelSchema),
    defaultValues: initialPractitionerAccountValues,
    mode: 'onChange',
  });

  const { isValid } = practitionerAccountFormState;
  const { password } = watch();

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
  const pictureStorageKey = LocalStorageKeys.practitionerProfilePicture;
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const reportingPeriod = useMemo(
    () => getReportingPeriodForProfileUsePhotoInReport(new Date()),
    []
  );

  const avatar =
    userProfilePicture?.file ||
    user?.profileImageUrl ||
    userProfilePicture?.reference;

  useEffect(() => {
    if (user) {
      setNewStackListItems(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, practitioner]);

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: PractitionerAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user.email || '',
      };
      return tempPractitioner;
    } else {
      return initialPractitionerAboutValues;
    }
  };

  const { getValues: practitionerAboutFormGetValues } = useForm({
    resolver: yupResolver(practitionerAboutModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  const handleUsingPhotoInReports = (using: boolean) => {
    dialog({
      position: DialogPosition.Bottom,
      render: (submit, cancel) => (
        <ActionModal
          className="bg-white"
          icon={'QuestionMarkIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={
            using
              ? `Your ${appName} profile photo will be added to the ${reportingPeriod.monthName} ${reportingPeriod.year} progress reports`
              : `Your ${appName} profile photo will not be added to the ${reportingPeriod.monthName} ${reportingPeriod.year} progress reports`
          }
          detailText={
            using
              ? `You have already created at least one caregiver report and cannot change this choice for the ${reportingPeriod.monthName} ${reportingPeriod.year} reports.

            If you want to change your profile photo, tap the camera icon on your profile.`
              : `You have already created at least one caregiver report and cannot change this choice for the ${reportingPeriod.monthName} ${reportingPeriod.year} reports.`
          }
          actionButtons={[
            {
              text: 'Close',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                submit();
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      ),
    });
  };

  const updatePractitionerUsePhotoReportPermission = async (
    usePhotoInReport: string
  ) => {
    await appDispatch(
      practitionerThunkActions.updatePractitionerUsePhotoInReport({
        practitionerId: practitioner?.userId,
        usePhotoInReport: usePhotoInReport,
      })
    );
  };

  const promptPhotoReportPermission = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          className="bg-white"
          icon={'QuestionMarkCircleIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          importantText={`Would you like to include your profile photo on your ${reportingPeriod?.monthName} ${reportingPeriod?.year} child progress reports?`}
          actionButtons={[
            {
              text: 'Yes, include photo!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                submit();
                updatePractitionerUsePhotoReportPermission(
                  `${reportingPeriod?.monthName}-${reportingPeriod?.year}-yes`
                );
              },
              leadingIcon: 'CheckCircleIcon',
            },
            {
              text: 'No, skip',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                submit();
                updatePractitionerUsePhotoReportPermission(
                  `${reportingPeriod?.monthName}-${reportingPeriod?.year}-no`
                );
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  // const getPhotoOnProgressReportItem = (): ActionListDataItem => {
  //   var item: ActionListDataItem = {
  //     title: `Photo on ${reportingPeriod.monthName} progress report`,
  //     subTitle: '',
  //     switchTextStyles: true,
  //     actionName: '',
  //     actionIcon: '',
  //     buttonType: 'filled',
  //     onActionClick: () => {},
  //   };
  //   const prefix = `${reportingPeriod.monthName}-${reportingPeriod.year}-`;
  //   const hasAnswered =
  //     !!practitioner?.usePhotoInReport &&
  //     practitioner?.usePhotoInReport.startsWith(prefix);
  //   const answer = hasAnswered
  //     ? practitioner?.usePhotoInReport?.endsWith('-yes')
  //       ? 'yes'
  //       : 'no'
  //     : undefined;
  //   if (!hasAnswered && !hasCreatedReportForCurrentPeriod) {
  //     item = {
  //       ...item,
  //       subTitle: `Add your photo to ${reportingPeriod.monthName} report`,
  //       actionName: 'Add',
  //       actionIcon: 'PlusIcon',
  //       onActionClick: () => {
  //         promptPhotoReportPermission();
  //       },
  //     };
  //   }
  //   if (hasAnswered && !hasCreatedReportForCurrentPeriod) {
  //     item = {
  //       ...item,
  //       subTitle:
  //         answer === 'yes'
  //           ? `Photo added to ${reportingPeriod.monthName} report`
  //           : `Photo not added to ${reportingPeriod.monthName} report`,
  //       actionName: 'Edit',
  //       actionIcon: 'PencilIcon',
  //       onActionClick: () => {
  //         promptPhotoReportPermission();
  //       },
  //     };
  //   }
  //   if (hasAnswered && hasCreatedReportForCurrentPeriod) {
  //     item = {
  //       ...item,
  //       subTitle:
  //         answer === 'yes'
  //           ? `Photo added to ${reportingPeriod.monthName} report`
  //           : `Photo not added to ${reportingPeriod.monthName} report`,
  //       actionName: 'View',
  //       actionIcon: 'EyeIcon',
  //       onActionClick: () => {
  //         handleUsingPhotoInReports(answer === 'yes');
  //       },
  //     };
  //   }
  //   return item;
  // };

  const setNewStackListItems = (currentUser: UserDto) => {
    const list: ActionListDataItem[] = [
      {
        title: 'Cellphone Number',
        subTitle: currentUser?.phoneNumber || 'Add an Cellphone Number',
        switchTextStyles: true,
        actionName: currentUser?.phoneNumber ? 'Edit' : 'Add',
        actionIcon: currentUser?.phoneNumber ? 'PencilIcon' : 'PlusIcon',
        buttonType: 'filled',
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
        buttonType: 'filled',
        onActionClick: () => {
          setEditEmail(true);
        },
      },
      {
        title: 'Password',
        subTitle: 'Edit your password',
        switchTextStyles: true,
        actionName: 'Edit',
        actionIcon: currentUser?.email ? 'PencilIcon' : 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => {
          editField({
            label: 'Password',
            formFieldName: 'password',
            value: practitionerAccountFormGetValues().password,
          });
        },
      },
      {
        title: 'Community profile',
        subTitle: communityProfile
          ? 'Edit your profile'
          : 'Create a community profile',
        switchTextStyles: true,
        actionName: communityProfile ? 'Edit' : 'Add',
        actionIcon: communityProfile ? 'PencilIcon' : 'PlusIcon',
        buttonType: 'filled',
        buttonColor: communityProfile ? 'secondaryAccent2' : 'quatenary',
        textColor: communityProfile ? 'secondary' : 'white',
        onActionClick: communityProfile
          ? () => history.push(ROUTES.COMMUNITY.PROFILE)
          : () => history.push(ROUTES.COMMUNITY.WELCOME),
      },
    ];

    setListItems(list);
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

    await savePractitionerUserData(imageBaseString);
  };

  const savePractitionerUserData = (imageBaseString: string = '') => {
    const practitionerForm = practitionerAboutFormGetValues();
    const copy = cloneDeep(user);
    if (copy) {
      copy.firstName = practitionerForm.name;
      copy.surname = practitionerForm.surname;
      copy.phoneNumber = practitionerForm.cellphone!;
      copy.email = practitionerForm.email;
      if (imageBaseString?.length > 0) {
        copy.profileImageUrl = imageBaseString;
      }

      appDispatch(userActions.updateUser(copy));
      appDispatch(userThunkActions.updateUser(copy));

      setNewStackListItems(copy);
      if (isFromCommunityWelcome) {
        setOpenChangeCommunityPic(true);
      }
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

  const editField = (
    formInputToLoad: DialogFormInput<PractitionerAccountModel>
  ) => {
    setDialogFormInput(formInputToLoad);
    setEditFieldVisible(true);
  };

  const saveNewPassword = async () => {
    if (isValid) {
      setEditFieldVisible(false);
      await savePractitionerPasswordUserData();
    }
  };

  const savePractitionerPasswordUserData = async () => {
    if (user) {
      const practitionerForm = practitionerAccountFormGetValues();

      const resetModel: UserResetPasswrodParams = {
        newPassword: practitionerForm.password,
      };

      appDispatch(userThunkActions.resetUserPassword(resetModel));
    }
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
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
      <Dialog fullScreen visible={editEmail} position={DialogPosition.Top}>
        <EditEmail setEditEmail={setEditEmail} user={user} />
      </Dialog>
      <Dialog fullScreen visible={addNextToKin} position={DialogPosition.Top}>
        <NextOfKin setAddNextOfKin={setAddNextToKin} user={user} />
      </Dialog>
      <BannerWrapper
        showBackground
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={'About me'}
        color={'primary'}
        size="medium"
        renderBorder
        renderOverflow={false}
        onBack={() => {
          history.push(ROUTES.PRACTITIONER.PROFILE.ROOT, {
            isFromCommunityWelcome: false,
          } as PractitionerAboutRouteState);
        }}
        displayOffline={!isOnline}
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
          <StackedList
            className={'h-auto bg-white'}
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
        visible={editProfilePictureVisible}
        position={DialogPosition.Bottom}
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title="Profile Photo"
            onClose={handlePicturePromptOnClose}
            onAction={picturePromtOnAction}
            onDelete={
              userProfilePicture || avatar ? deleteProfilePicture : undefined
            }
            isProfileEmojis={true}
            showEmojiOption={true}
            resolutionLimit={IMAGE_WIDTH}
          ></PhotoPrompt>
        </div>
      </Dialog>
      <Dialog
        borderRadius="normal"
        stretch={true}
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
          <PasswordInput<PractitionerAccountModel>
            visible={true}
            strengthMeterVisible={true}
            nameProp={dialogFormInput.formFieldName}
            register={practitionerAccountRegister}
            disabled={false}
            className={'mb-6'}
            value={password}
          />
          <Button
            type="filled"
            color="quatenary"
            className={'w-full'}
            onClick={saveNewPassword}
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
        borderRadius="normal"
        className="rounded-2xl p-4"
        visible={openChangeCommunityPic}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="text-textDark bg-white p-4"
          customIcon={
            <ProfileAvatar size="header" hasConsent={true} dataUrl={avatar} />
          }
          icon={'QuestionMarkIcon'}
          iconColor="white"
          iconBorderColor="infoMain"
          title="Looking good"
          actionButtons={[
            {
              text: 'Go back to Community page',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                history?.push(ROUTES.COMMUNITY.ROOT);
              },
              leadingIcon: 'ArrowCircleLeftIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
};
