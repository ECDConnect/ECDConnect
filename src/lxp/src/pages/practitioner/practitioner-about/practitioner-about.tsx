import {
  LocalStorageKeys,
  UserDto,
  useDialog,
  usePrevious,
  useTheme,
} from '@ecdlink/core';
import { FileTypeEnum } from '@ecdlink/graphql';
import {
  ActionListDataItem,
  ActionModal,
  Avatar,
  BannerWrapper,
  Dialog,
  DialogPosition,
  ProfileAvatar,
  StackedList,
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
import { coachSelectors } from '@/store/coach';
import { contentReportSelectors } from '@/store/content/report';
import { getReportingPeriodForProfileUsePhotoInReport } from '@/utils/child/child-profile-utils';
import { PractitionerAboutRouteState } from './practitioner-about.types';
import { BackToCommunityDialog } from '@/pages/coach/coach-about/components/back-to-community-dialog/indext';

export const PractitionerAbout: React.FC = () => {
  const location = useLocation<PractitionerAboutRouteState>();
  const history = useHistory();
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const {
    userProfilePicture,
    deleteDocument,
    createNewDocument,
    updateDocument,
  } = useDocuments();

  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [editiCellPhoneNumber, setEditiCellPhoneNumber] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [addNextToKin, setAddNextToKin] = useState(false);

  const isFromCommunityWelcome = location?.state?.isFromCommunityWelcome;
  const wasFromCommunityWelcome = usePrevious(isFromCommunityWelcome);

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
  const reportingPeriod = useMemo(
    () => getReportingPeriodForProfileUsePhotoInReport(new Date()),
    []
  );
  const hasCreatedReportForCurrentPeriod = useSelector(
    contentReportSelectors.hasChildSummaryReportsForReportingPeriod(
      reportingPeriod.reportingDate
    )
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

  const { theme } = useTheme();

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
              ? `Your Funda App profile photo will be added to the ${reportingPeriod.monthName} ${reportingPeriod.year} progress reports`
              : `Your Funda App profile photo will not be added to the ${reportingPeriod.monthName} ${reportingPeriod.year} progress reports`
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

  const getPhotoOnProgressReportItem = (): ActionListDataItem => {
    var item: ActionListDataItem = {
      title: `Photo on ${reportingPeriod.monthName} progress report`,
      subTitle: '',
      switchTextStyles: true,
      actionName: '',
      actionIcon: '',
      buttonType: 'filled',
      onActionClick: () => {},
    };
    const prefix = `${reportingPeriod.monthName}-${reportingPeriod.year}-`;
    const hasAnswered =
      !!practitioner?.usePhotoInReport &&
      practitioner?.usePhotoInReport.startsWith(prefix);
    const answer = hasAnswered
      ? practitioner?.usePhotoInReport?.endsWith('-yes')
        ? 'yes'
        : 'no'
      : undefined;
    if (!hasAnswered && !hasCreatedReportForCurrentPeriod) {
      item = {
        ...item,
        subTitle: `Add your photo to ${reportingPeriod.monthName} report`,
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        onActionClick: () => {
          promptPhotoReportPermission();
        },
      };
    }
    if (hasAnswered && !hasCreatedReportForCurrentPeriod) {
      item = {
        ...item,
        subTitle:
          answer === 'yes'
            ? `Photo added to ${reportingPeriod.monthName} report`
            : `Photo not added to ${reportingPeriod.monthName} report`,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick: () => {
          promptPhotoReportPermission();
        },
      };
    }
    if (hasAnswered && hasCreatedReportForCurrentPeriod) {
      item = {
        ...item,
        subTitle:
          answer === 'yes'
            ? `Photo added to ${reportingPeriod.monthName} report`
            : `Photo not added to ${reportingPeriod.monthName} report`,
        actionName: 'View',
        actionIcon: 'EyeIcon',
        onActionClick: () => {
          handleUsingPhotoInReports(answer === 'yes');
        },
      };
    }
    return item;
  };

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
          setEditEmail(true);
        },
      },
      {
        title: 'Your SmartStart club',
        subTitle: 'N/A',
        switchTextStyles: true,
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
      getPhotoOnProgressReportItem(),
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
                history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT, {
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
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'About me'}
        color={'primary'}
        size="medium"
        renderBorder
        renderOverflow={false}
        onBack={() => {
          history.push(
            isFromCommunityWelcome
              ? ROUTES.PRACTITIONER.COMMUNITY.ROOT
              : ROUTES.PRACTITIONER.PROFILE.ROOT,
            {
              isFromCommunityWelcome: false,
            } as PractitionerAboutRouteState
          );
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
          ></PhotoPrompt>
        </div>
      </Dialog>
    </div>
  );
};
