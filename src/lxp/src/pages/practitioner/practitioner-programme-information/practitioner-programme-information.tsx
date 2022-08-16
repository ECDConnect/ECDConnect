import { ClassroomDto, useTheme } from '@ecdlink/core';
import {
  FileTypeEnum,
  ProgrammeTypeEnum,
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

export const PractitionerProgrammeInformation: React.FC = () => {
  const history = useHistory();

  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const user = useSelector(userSelectors.getUser);

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);
  const programmeType = useSelector(
    classroomsSelectors.getClassroomProgrammeType()
  );

  const { createNewDocument, classroomImage, updateDocument, deleteDocument } =
    useDocuments();
  const [editFieldVisible, setEditFieldVisible] = useState(false);
  const [editProfilePictureVisible, setEditProfilePictureVisible] =
    useState(false);

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
    if (classroomGroups) {
      getStackedListItems();
    }
    if (classroom) {
      setProgrammeNameValue('name', classroom?.name || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroom, classroomGroups, programmeType]);

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

  const getStackedListItems = () => {
    const stackedActionList: ActionListDataItem[] = [
      {
        title: 'Programme name',
        subTitle: classroom?.name,
        switchTextStyles: true,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick: () => {
          setEditFieldVisible(true);
        },
      },
      {
        title: 'Type of ECD service',
        subTitle: programmeType?.description,
        switchTextStyles: true,
      },
    ];

    if (programmeType?.enumId === ProgrammeTypeEnum.Playgroup) {
      stackedActionList.push({
        title: 'Groups',
        subTitle: classroomGroups
          ?.filter((x) => x.name !== NoPlaygroupClassroomType.name)
          .map((x) => x.name)
          .join(','),
        switchTextStyles: true,
        actionName: 'Edit',
        actionIcon: 'PencilIcon',
        onActionClick: () => {
          history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS, {
            returnRoute: ROUTES.PRACTITIONER.PROGRAMME_INFORMATION,
          });
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
      isOnline &&
        (await appDispatch(
          classroomsThunkActions.upsertClassroom({})
        ).unwrap());
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
        <div className={'w-full inline-flex justify-center pt-8'}>
          <ProfileAvatar
            dataUrl={classroomImage?.file || ''}
            size={'header'}
            onPressed={displayProfilePicturePrompt}
            hasConsent={true}
          />
        </div>
        <StackedList listItems={listItems} type={'ActionList'}></StackedList>
      </BannerWrapper>

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
