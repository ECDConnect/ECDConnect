import { ClassroomDto, useTheme } from '@ecdlink/core';
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
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { EditAddress } from './edit-address/edit-address';

export const PractitionerProgrammeInformation: React.FC = () => {
  const history = useHistory();

  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const user = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const programmeType = useSelector(
    classroomsSelectors.getClassroomProgrammeType()
  );
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
  }, [classroom, classroomGroups, programmeType, otherColleaguesFiltered]);

  const displayProfilePicturePrompt = () => {
    setEditProfilePictureVisible(!editProfilePictureVisible);
  };

  const closeEditField = () => {
    setEditFieldVisible(false);
  };

  const saveClassroomPicture = async (imageBaseString: string) => {
    setEditProfilePictureVisible(!editProfilePictureVisible);

    if (classroomImage) {
      await updateDocument(classroomImage, imageBaseString);
    } else {
      const fileName = `ClassroomPicture_${classroom?.id}.png`;
      await createNewDocument(
        {
          data: imageBaseString,
          fileName,
          fileType: FileTypeEnum.ClassroomProfile,
          userId: user?.id || '',
          status: WorkflowStatusEnum.DocumentPendingVerification,
        },
        classroom?.id
      );
    }

    setClassImageBaseString(imageBaseString);
  };

  const setClassImageBaseString = (imageBaseString?: string) => {
    const copy = Object.assign({}, classroom);
    if (copy) {
      copy.classroomImageUrl = imageBaseString;
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

  useEffect(() => {
    getPractitionerColleagues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (otherColleagues && user?.firstName) {
      const filteredColleagues = otherColleagues?.filter(
        (item) => !item?.name.includes(user?.firstName)
      );
      const firstNameFilteredColleagues = filteredColleagues.map((item) => ({
        name: item?.name.split(' ')[0],
        title: item?.title,
      }));
      setOtherColleaguesFiltered(firstNameFilteredColleagues);
    }
  }, [otherColleagues, user?.firstName]);

  const getStackedListItems = () => {
    const stackedActionList: ActionListDataItem[] = [
      {
        title: 'Programme name',
        subTitle:
          classroomForPractitionerAnyType?.id &&
          practitioner?.isPrincipal !== true &&
          practitioner?.isRegistered
            ? classroomForPractitionerAnyType?.name
            : practitioner?.isRegistered
            ? classroom?.name || 'None'
            : 'None',
        switchTextStyles: true,
        actionName:
          practitioner?.isRegistered && practitioner?.isPrincipal !== true
            ? ''
            : 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick:
          practitioner?.isRegistered !== null ||
          practitioner?.isLeaving !== null
            ? classroomForPractitionerAnyType?.id &&
              practitioner?.isPrincipal !== true
              ? () => {}
              : () => setEditFieldVisible(true)
            : practitioner?.isPrincipal !== true
            ? () => history.push(ROUTES.PRACTITIONER?.PROFILE?.EDIT)
            : () => {
                history.push(ROUTES?.PRINCIPAL.SETUP_PROFILE);
                return;
              },
      },
    ];

    if (
      practitioner?.isRegistered !== null ||
      practitioner?.isLeaving !== null
    ) {
      stackedActionList.push(
        {
          title: 'Location',
          subTitle:
            classroom?.siteAddress?.addressLine1 || classroom?.classSiteAddress,
          switchTextStyles: true,
          actionName: isPrincipal ? 'Add/Edit' : '',
          actionIcon: 'PlusIcon',
          onActionClick: () => setShowEditAddress(true),
        },
        {
          title: 'Type of ECD service',
          subTitle: programmeType?.description,
          switchTextStyles: true,
        }
      );
    }

    if (
      (practitioners?.length! > 0 || otherColleaguesFiltered?.length! > 0) &&
      (practitioner?.isRegistered !== null ||
        isPrincipal !== false ||
        practitioner?.isLeaving !== null)
    ) {
      stackedActionList.push({
        title: 'Other practitioners on site',
        subTitle: isPrincipal
          ? practitionersList?.map((x) => x?.user?.firstName).join(', ')
          : otherColleaguesFiltered?.map((x: any) => x?.name).join(', '),
        switchTextStyles: true,
        actionName:
          practitioners?.length! > 0 || otherColleaguesFiltered?.length! > 0
            ? isPrincipal
              ? 'Edit'
              : 'View'
            : 'Add',
        actionIcon: isPrincipal ? 'PencilIcon' : 'EyeIcon',
        onActionClick: () => {
          history.push(ROUTES.PRINCIPAL.PRACTITIONER_LIST, {
            returnRoute: ROUTES.PRACTITIONER.PROGRAMME_INFORMATION,
          });
        },
      });
    }

    if (classroomGroups.length > 0) {
      stackedActionList.push({
        title: 'Classes',
        subTitle: classroomGroups
          ?.filter((x) => x.name !== NoPlaygroupClassroomType.name)
          .map((x) => x.name)
          .join(', '),
        switchTextStyles: true,
        actionName: isPrincipal ? 'Edit' : 'View',
        actionIcon: isPrincipal ? 'PencilIcon' : 'EyeIcon',
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS, { a: 'hello' });
        },
      });
    }

    if (!!classroom && (isPrincipal || practitioner?.isFundaAppAdmin)) {
      const feeUpdatedThisYear =
        !!classroom?.preschoolFeeAmountLastUpdateDate &&
        new Date(classroom.preschoolFeeAmountLastUpdateDate).getFullYear() ===
          new Date().getFullYear();

      stackedActionList.push({
        title: 'Monthly preschool fee',
        subTitle: !!classroom.preschoolFeeAmount
          ? `R ${classroom.preschoolFeeAmount}`
          : feeUpdatedThisYear
          ? 'No fee'
          : 'Add the preschool fee',
        switchTextStyles: true,
        actionName: !!classroom.preschoolFeeAmount ? 'Edit' : 'Add',
        actionIcon: !!classroom.preschoolFeeAmount ? 'PencilIcon' : 'PlusIcon',
        onActionClick: () => {
          history.push(ROUTES.CLASSROOM.UPDATE_FEE);
        },
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
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={classroom?.name}
        color={'primary'}
        renderOverflow={false}
        onBack={() => history.push(ROUTES.PRACTITIONER.PROFILE.ROOT)}
        displayOffline={!isOnline}
      >
        <div className={'inline-flex w-full justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={classroomImage?.file || ''}
            size={'header'}
            onPressed={displayProfilePicturePrompt}
            hasConsent={true}
          />
        </div>
        {practitioner?.isRegistered === null &&
          practitioner?.principalHierarchy &&
          !isPrincipal && (
            <div className="flex justify-center">
              <Alert
                type="info"
                title={`You have been added to ${classroomForPractitionerAnyType?.name}`}
                list={[`Edit your profile to accept or disagree. `]}
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

        {practitioner?.isRegistered === null &&
          !practitioner?.principalHierarchy &&
          !isPrincipal && (
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
                    onClick={() =>
                      history.push(ROUTES?.PRINCIPAL.SETUP_PROFILE)
                    }
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
              text={'Programme Name'}
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
          ></PhotoPrompt>
        </div>
      </Dialog>
    </div>
  );
};
