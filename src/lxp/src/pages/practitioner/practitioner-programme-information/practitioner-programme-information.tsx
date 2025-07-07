import {
  NOTIFICATION,
  useDialog,
  useNotifications,
  useSnackbar,
  useTheme,
} from '@ecdlink/core';
import {
  FileTypeEnum,
  PractitionerColleagues,
  WorkflowStatusEnum,
} from '@ecdlink/graphql';
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
  Alert,
  Card,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PhotoPrompt } from '../../../components/photo-prompt/photo-prompt';
import { useDocuments } from '@hooks/useDocuments';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  ProgrammeNameModel,
  programmeNameSchema,
} from '@schemas/practitioner/practitioner-programme-information';
import { useAppDispatch } from '@store';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@store/classroom';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import * as styles from './practitioner-programme-information.styles';
import ROUTES from '@routes/routes';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { Colours } from '@ecdlink/ui';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { EditAddress } from './edit-address/edit-address';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { useTenant } from '@/hooks/useTenant';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { JoinOrAddPreschoolModal } from '@/components/join-or-add-preschool-modal/join-or-add-preschool-modal';
import { formatAddress } from '@/components/address-map/address-map';
import TransparentLayer from '../../../assets/TransparentLayer.png';
import { p } from 'msw/lib/glossary-297d38ba';
import { is } from 'date-fns/locale';

export const PractitionerProgrammeInformation: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { showMessage } = useSnackbar();
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const isTrialPeriod = useIsTrialPeriod();

  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

  const [otherColleagues, setOtherColleagues] = useState<any[]>([]);
  const [otherColleaguesFiltered, setOtherColleaguesFiltered] = useState<any>(
    []
  );
  const classroomForPractitionerAnyType: any = classroom;
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionersList = practitioners?.filter(
    (item) => item.userId !== practitioner?.userId
  );

  const isPrincipal = practitioner?.isPrincipal === true;
  const { createNewDocument, classroomImage, updateDocument, deleteDocument } =
    useDocuments();
  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);

  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const { theme } = useTheme();

  const userClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroupsForUser(practitioner?.id || '')
  );

  const missingProgramme =
    (practitioner?.isRegistered === null || practitioner?.isRegistered) &&
    !practitioner?.principalHierarchy &&
    !isPrincipal;

  const hasAccepted =
    ((practitioner?.isRegistered === null || practitioner?.isRegistered) &&
      practitioner?.principalHierarchy &&
      !isPrincipal) ||
    (practitioner?.dateAccepted !== null && !practitioner?.isLeaving);

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner Programme Information',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const {
    control,
    register: programmeNameRegister,
    setValue: setProgrammeNameValue,
  } = useForm<ProgrammeNameModel>({
    resolver: yupResolver(programmeNameSchema),
    mode: 'onChange',
    defaultValues: { name: classroom?.name || '' },
  });
  const { name: updatedProgrammeName } = useWatch<ProgrammeNameModel>({
    control: control,
    defaultValue: { name: classroom?.name || '' },
  });

  useEffect(() => {
    if (classroomGroups || otherColleaguesFiltered) {
      getStackedListItems();
    }
    if (classroom) {
      setProgrammeNameValue('name', classroom?.name || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom, classroomGroups, otherColleaguesFiltered]);

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
  };

  const saveClassroomPicture = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
    // TODO Check if we'll need this create document for images
    // if (classroomImage) {
    //   await updateDocument(classroomImage, imageBaseString);
    // } else {
    //   const fileName = `ClassroomPicture_${classroom?.id}.png`;
    //   await createNewDocument(
    //     {
    //       data: imageBaseString,
    //       fileName,
    //       fileType: FileTypeEnum.ClassroomProfile,
    //       userId: user?.id || '',
    //       status: WorkflowStatusEnum.DocumentPendingVerification,
    //     },
    //     classroom?.id
    //   );
    // }

    setClassImageBaseString(imageBaseString);
  };

  const setClassImageBaseString = (imageBaseString?: string) => {
    const copy = Object.assign({}, classroom);
    if (copy) {
      copy.classroomImageUrl = imageBaseString || '';
    }
    setUpdatedClassroom(copy);
  };

  const deleteClassroomPicture = () => {
    deleteDocument(classroomImage);
    setClassImageBaseString();
    displayProfilePicturePrompt();
  };

  const getPractitionerColleagues = async () => {
    // Check if the practitioner exists
    let practitionerColleagues: PractitionerColleagues[] = [];

    if (userAuth) {
      practitionerColleagues = await new PractitionerService(
        userAuth.auth_token
      ).practitionerColleagues(user?.id!);
    }

    setOtherColleagues(practitionerColleagues);
    return practitionerColleagues;
  };

  const showTrialPeriodCompleteProfileBlockingDialog = () => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return (
          <JoinOrAddPreschoolModal
            onSubmit={onSubmit}
            isTrialPeriod={!!isTrialPeriod}
          />
        );
      },
    });
  };

  useEffect(() => {
    getPractitionerColleagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (otherColleagues && user?.firstName) {
      const filteredColleagues = otherColleagues?.filter(
        (item) =>
          !item?.name?.includes(user?.firstName) ||
          item?.username?.includes(user?.userName)
      );
      const firstNameFilteredColleagues = filteredColleagues.map((item) => ({
        name: item?.name?.split(' ')[0] || item?.username,
        title: item?.title,
        nickName: item?.nickName,
      }));
      setOtherColleaguesFiltered(firstNameFilteredColleagues);
    }
  }, [otherColleagues, user?.firstName, user?.userName]);

  const getStackedListItems = () => {
    const stackedActionList: ActionListDataItem[] = [];

    // Helper function to get styles based on trial period or missing data
    const getButtonStyles = (isTrial: boolean): Partial<ActionListDataItem> => {
      return isTrial
        ? { buttonColor: 'quatenary' as Colours, textColor: 'white' }
        : {};
    };

    // Preschool item
    const preschoolHasInfo =
      !!classroomForPractitionerAnyType?.id && practitioner?.shareInfo;
    const preschoolActionName =
      isTrialPeriod || !practitioner?.shareInfo
        ? 'Add'
        : practitioner?.isPrincipal !== true && practitioner?.isRegistered
        ? ''
        : 'Edit';
    const preschoolActionIcon = isTrialPeriod ? 'PlusIcon' : 'PencilIcon';

    stackedActionList.push({
      title: 'Preschool name',
      subTitle:
        preschoolHasInfo && practitioner?.isRegistered && !missingProgramme
          ? classroomForPractitionerAnyType?.name || 'None'
          : classroom?.name || 'None',
      switchTextStyles: true,
      actionName: preschoolActionName,
      actionIcon: preschoolActionIcon,
      ...getButtonStyles(!!isTrialPeriod),
      onActionClick: (() => {
        if (
          (practitioner?.isRegistered !== null ||
            practitioner?.isLeaving !== null) &&
          !isTrialPeriod
        ) {
          if (
            classroomForPractitionerAnyType?.id &&
            !practitioner?.isPrincipal
          ) {
            return () => {};
          }
          return () => setEditFieldVisible(true);
        }

        if (!practitioner?.isPrincipal) {
          return isTrialPeriod
            ? () => showTrialPeriodCompleteProfileBlockingDialog()
            : () => history.push(ROUTES.PRACTITIONER.PROFILE.EDIT);
        }

        return isTrialPeriod
          ? () => showTrialPeriodCompleteProfileBlockingDialog()
          : () => history.push(ROUTES.PRINCIPAL.SETUP_PROFILE);
      })(),
    });

    if (!missingProgramme || !isTrialPeriod || classroomGroups.length > 0) {
      const classesSubTitle =
        !isTrialPeriod || classroomGroups.length > 0
          ? classroomGroups
              ?.filter((x) => x.name !== NoPlaygroupClassroomType.name)
              .map((x) => x.name)
              .join(', ')
          : 'None';

      const classesActionName =
        practitioner?.shareInfo && !isTrialPeriod
          ? isPrincipal
            ? 'Edit'
            : 'View'
          : 'Add';
      const classesActionIcon = isPrincipal
        ? 'PencilIcon'
        : !practitioner?.shareInfo || isTrialPeriod
        ? 'PlusIcon'
        : 'EyeIcon';

      stackedActionList.push({
        title: 'Classes',
        subTitle: classesSubTitle,
        switchTextStyles: true,
        actionName: classesActionName,
        actionIcon: classesActionIcon,
        ...getButtonStyles(!!isTrialPeriod),
        onActionClick: () => {
          if (isTrialPeriod) {
            showTrialPeriodCompleteProfileBlockingDialog();
          } else {
            history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS);
          }
        },
      });
    }

    // Other Practitioners item
    if (practitioner?.shareInfo || isTrialPeriod) {
      const practitionersSubTitle = isPrincipal
        ? practitionersList
            ?.map((x) => x?.user?.firstName || x?.user?.userName)
            .join(', ')
        : otherColleaguesFiltered
            ?.map((x: any) => x?.name || x?.nickName)
            .join(', ') || 'None';
      const practitionersActionName =
        practitioner?.shareInfo && !isTrialPeriod
          ? isPrincipal
            ? 'Edit'
            : 'View'
          : 'Add';
      const practitionersActionIcon = isPrincipal
        ? 'PencilIcon'
        : isTrialPeriod
        ? 'PlusIcon'
        : 'EyeIcon';

      stackedActionList.push({
        title: 'Other practitioners on site',
        subTitle: practitionersSubTitle,
        switchTextStyles: true,
        actionName: practitionersActionName,
        actionIcon: practitionersActionIcon,
        ...getButtonStyles(!!isTrialPeriod),
        onActionClick: () => {
          if (isTrialPeriod) {
            showTrialPeriodCompleteProfileBlockingDialog();
          } else {
            history.push(ROUTES.PRINCIPAL.PRACTITIONER_LIST, {
              returnRoute: ROUTES.PRACTITIONER.PROGRAMME_INFORMATION,
            });
          }
        },
      });
    }

    // Location item
    if (practitioner?.shareInfo && !isTrialPeriod) {
      const locationHasInfo = !!classroom?.siteAddress;
      const locationActionName = isPrincipal
        ? locationHasInfo
          ? 'Edit'
          : 'Add'
        : '';
      const locationActionIcon = locationHasInfo ? 'PencilIcon' : 'PlusIcon';

      stackedActionList.push({
        title: 'Location',
        subTitle: locationHasInfo
          ? formatAddress(classroom.siteAddress as any)
          : '',
        switchTextStyles: true,
        actionName: locationActionName,
        actionIcon: locationActionIcon,
        ...getButtonStyles(isTrialPeriod || !locationHasInfo),
        onActionClick: () => setShowEditAddress(true),
      });
    }

    setListItems(stackedActionList);
  };

  const savePractitionerName = async () => {
    if (!updatedProgrammeName || updatedProgrammeName === classroom?.name)
      return;

    if (classroom) {
      setUpdatedClassroom(classroom);
    }
  };

  const setUpdatedClassroom = async (classroomDto: ClassroomDto) => {
    const copy = Object.assign({}, classroomDto);
    if (copy) {
      copy.name = updatedProgrammeName as string;

      appDispatch(classroomsActions.updateClassroom(copy));

      await appDispatch(classroomsThunkActions.upsertClassroom({}));
    }
  };

  return (
    <div className={styles.container}>
      <BannerWrapper
        showBackground={true}
        size="medium"
        renderBorder={true}
        backgroundUrl={TransparentLayer}
        backgroundImageColour={'primary'}
        title={classroom?.name}
        color={'primary'}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.PRACTITIONER.PROFILE.ROOT)}
        displayOffline={!isOnline}
      >
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={classroom?.classroomImageUrl || ''}
            size={'header'}
            onPressed={isPrincipal ? displayProfilePicturePrompt : () => {}}
            hasConsent={true}
            isPreschoolImage={true}
            canChangeImage={practitioner?.isPrincipal ? true : false}
          />
        </div>

        {!isPrincipal &&
          !hasAccepted &&
          !missingProgramme &&
          !isTrialPeriod && (
            <div className="flex justify-center">
              <Alert
                type="info"
                title={`You have been added to ${classroomForPractitionerAnyType?.name}`}
                list={[`Connect with your principal & manage your classes.`]}
                className={'mt-4 w-11/12'}
                button={
                  <Button
                    text="Edit profile"
                    icon="PencilIcon"
                    type={'filled'}
                    color={'primary'}
                    textColor={'white'}
                    onClick={() =>
                      history.push(ROUTES.PRACTITIONER?.PROFILE?.EDIT)
                    }
                  />
                }
              />
            </div>
          )}

        {!isPrincipal && missingProgramme && !isOpenAccess && (
          <div className="flex justify-center">
            <Alert
              type="error"
              title={`You have not been added to a programme.`}
              list={[
                `Ask the principal/owner of your programme to add you to Funda App. `,
                `If you are the principal/owner of the programme, edit your profile. `,
              ]}
              className={'mt-4 w-11/12'}
              button={
                <Button
                  text="Edit profile"
                  icon="PencilIcon"
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  onClick={() => history.push(ROUTES?.PRINCIPAL.SETUP_PROFILE)}
                />
              }
            />
          </div>
        )}
        <StackedList
          className="px-4"
          listItems={listItems}
          type={'ActionList'}
        ></StackedList>
      </BannerWrapper>
      {practitioner?.isPrincipal && (
        <div className="mb-28 flex w-full justify-center">
          <Card
            className={'bg-adminBackground mt-4	 w-11/12 rounded-xl shadow-lg'}
          >
            <div className={'mt-6 ml-4'}>
              <Typography
                type={'h1'}
                color="textDark"
                text={`Copy the code to invite practitioners`}
                className={'mt-6 ml-4'}
              />
              <Typography
                type={'body'}
                color="textMid"
                text={`You can invite new practitioners to your preschool by sharing the code: ${classroom?.preschoolCode}`}
                className={'mt-4 ml-4'}
              />
              <div className="flex justify-center">
                <Button
                  type="filled"
                  color="quatenary"
                  className={'mt-6 mb-6 w-11/12 rounded-2xl'}
                  onClick={() => {
                    //TODO: what if copy fails?
                    navigator?.clipboard?.writeText &&
                      navigator?.clipboard?.writeText(
                        classroom?.preschoolCode!
                      );
                    showMessage({
                      message: 'Preschool code copied!',
                      type: 'success',
                    });
                  }}
                >
                  {renderIcon(
                    'ArrowCircleRightIcon',
                    'w-5 h-5 color-white text-white mr-1'
                  )}
                  <Typography
                    type="body"
                    className="mr-4"
                    color="white"
                    text={'Copy preschool code'}
                  ></Typography>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      <Dialog
        fullScreen
        visible={showEditAddress}
        position={DialogPosition.Full}
      >
        <EditAddress
          setShowEditAddress={setShowEditAddress}
          practitioner={practitioner}
        />
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
              color="textDark"
              text={'Preschool'}
              weight="bold"
            ></Typography>
            <div onClick={closeEditField}>
              {renderIcon('XIcon', 'h-6 w-6 text-uiLight')}
            </div>
          </div>
          <FormInput<ProgrammeNameModel>
            register={programmeNameRegister}
            nameProp={'name'}
            className={'mb-6'}
          />
          <Button
            type="filled"
            color="primary"
            className={'w-full'}
            onClick={() => {
              setEditFieldVisible(false);
              savePractitionerName();
            }}
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
            onAction={saveClassroomPicture}
            onDelete={classroomImage ? deleteClassroomPicture : undefined}
          />
        </div>
      </Dialog>
    </div>
  );
};
