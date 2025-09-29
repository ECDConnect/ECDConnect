import {
  ChildDto,
  FormComponentProps,
  getAvatarColor,
  RoleSystemNameEnum,
  useDialog,
} from '@ecdlink/core';
import {
  Dropdown,
  FormInput,
  Typography,
  Button,
  Alert,
  UserAlertListDataItem,
  StackedList,
  ActionModal,
  DialogPosition,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  childBasicInfoFormSchema,
  ChildBasicInfoModel,
} from '@schemas/child/child-registration/child-basic-info';
import { classroomsSelectors, classroomsThunkActions } from '@store/classroom';
import { format } from 'date-fns';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ChildMatchingDto } from './child-basic-info.types';
import { useAppDispatch } from '@/store';
import { childrenThunkActions } from '@/store/children';
import { debounce } from 'lodash';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';
import iconRobot from '../../../../assets/iconRobot.svg';
import childRegistrationForm from '@/assets/ECD_connect_registration_form.pdf';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { ChildRegistrationDto } from '@/models/child/child-registration.dto';
import { copyToClip } from '@utils/common/clipboard.utils';
import { practitionerSelectors } from '@/store/practitioner';
import { useHistory, useLocation } from 'react-router';
import {
  ChildRegistrationRouteState,
  ChildRegistrationSteps,
} from '../../child-registration/child-registration.types';
import { CaregiverChildRegistrationModal } from '../../components/caregiver-child-registration-modal/caregiver-child-registration-modal';
import { getUser } from '@/store/user/user.selectors';
import ROUTES from '@/routes/routes';
import {
  TabsItemForPrincipal,
  TabsItems,
} from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { ClassDashboardRouteState } from '@/pages/business/business.types';
import { ChildProfileRouteState } from '../../child-profile/child-profile.types';
import { EditPlaygroupsRouteState } from '@/pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups.types';

export const ChildBasicInfo: React.FC<
  FormComponentProps<ChildBasicInfoModel>
> = ({ onSubmit }) => {
  const {
    getValues,
    setValue,
    register,
    formState,
    control: childInfoFormControl,
  } = useForm<ChildBasicInfoModel>({
    resolver: yupResolver(childBasicInfoFormSchema),
    mode: 'onBlur',
    defaultValues: {},
  });

  const { firstName, surname } = useWatch({
    control: childInfoFormControl,
  });

  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<ChildRegistrationRouteState>();
  const [checkChild, setCheckChild] = useState<ChildMatchingDto>();
  const [listItems, setListItems] = useState<UserAlertListDataItem[]>([]);
  const [registeredChild, setRegisteredChild] =
    useState<ChildRegistrationDto>();
  const [childRegistrationDetails, setChildRegistrationDetails] =
    useState<ChildRegistrationDto>();
  const [loadingLink, setLoadingLink] = useState(false);

  const allClassroomGroups = useSelector(
    classroomsSelectors?.getClassroomGroups
  );

  const user = useSelector(getUser);
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const isPractitionerView =
    user?.roles?.some(
      (role) => role.systemName === RoleSystemNameEnum.Practitioner
    ) || isPrincipal;
  const isCoachView = user?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );

  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.FIND_CREATED_CHILD
  );

  // List of children available with similar name
  const setNewStackListItems = (checkChild: ChildMatchingDto) => {
    const list: UserAlertListDataItem[] = [
      {
        profileDataUrl: checkChild?.profileImageUrl || '',
        title: `${checkChild?.fullName}` || '',
        subTitle: `Added by ${checkChild?.practitionerName} on ${format(
          new Date(checkChild?.createdByDate!),
          'dd MMM yyyy'
        )}.`,
        profileText:
          `${
            checkChild?.fullName?.split(' ')[0] || ''.toUpperCase()
          }${checkChild?.fullName?.split(' ')[1].toUpperCase()}` || '',
        alertSeverity: 'none',
        avatarColor: getAvatarColor() || '',
        breaksSubtitleLine: true,
      },
    ];

    setListItems(list);
  };

  useEffect(() => {
    if (checkChild) {
      setNewStackListItems(checkChild);
    }
  }, [checkChild]);

  const getSelectedClassroomGroupId = (): string => {
    const values = getValues();
    return values.playgroupId ?? '';
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDispatch = useCallback(
    debounce((firstName, surname, practitionerId) => {
      dispatch(
        childrenThunkActions.findCreatedChild({
          firstName,
          surname,
          practitionerId,
        })
      ).then((response) => {
        if (response?.type.includes('fulfilled')) {
          setCheckChild(response?.payload || undefined);
        }
      });
    }, 300),
    []
  );

  useEffect(() => {
    if (firstName && surname && isOnline && userAuth?.id) {
      debouncedDispatch(firstName, surname, userAuth?.id!);
    }
    return () => {
      debouncedDispatch.cancel();
    };
  }, [firstName, surname, userAuth?.id, isOnline, debouncedDispatch]);

  useEffect(() => {
    if (allClassroomGroups.length === 0) {
      handleNoClasses();
    }
  }, [allClassroomGroups]);

  // menu option calls

  const onDownloadChildForm = () => {
    const pdfUrl = childRegistrationForm;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'child_registration_form.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const onUploadSelf = async (newChild: ChildRegistrationDto) => {
    if (isOnline) {
      await goToChildRegistration(newChild);
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const goToChildRegistration = async (newChild: ChildRegistrationDto) => {
    history.replace('/child-registration', {
      newChild,
      childId: newChild?.childId,
      step: ChildRegistrationSteps.registrationForm,
      practitionerId: isCoachView ? practitioner?.id : null,
    });
  };

  // This should just sync children and classgroups (to get the newly created child)
  const refetchData = async () => {
    await dispatch(childrenThunkActions.getChildren({ overrideCache: true }));
    await dispatch(
      classroomsThunkActions.getClassroomGroups({ overrideCache: true })
    );
  };

  const generateCaregiverChildToken = async () => {
    const newChild = await dispatch(
      childrenThunkActions.generateCaregiverChildToken({
        firstName: firstName,
        surname: surname,
        classgroupId: getSelectedClassroomGroupId(),
      })
    ).unwrap();
    setRegisteredChild(newChild);
    showMenuOptions(newChild);
    refetchData();
  };

  const onExit = () => {
    if (isPractitionerView) {
      if (isPrincipal) {
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItemForPrincipal.CLASSES,
        } as ClassDashboardRouteState);
      } else {
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.CLASSES,
        } as ClassDashboardRouteState);
      }
    } else {
      history.push(ROUTES.COACH.PRACTITIONERS);
    }
  };

  const createLink = async (newChild: ChildRegistrationDto) => {
    setLoadingLink(true);
    const childDetails = await dispatch(
      childrenThunkActions.refreshCaregiverChildToken({
        childId: newChild?.childId,
        classgroupId: newChild?.classroomGroupId,
      })
    ).unwrap();
    setChildRegistrationDetails(childDetails);

    const linkCopied = await copyToClip(childDetails.caregiverRegistrationUrl);

    const selectedClassroom = allClassroomGroups.find(
      (x) => x.id === getSelectedClassroomGroupId()
    );

    const whatsapp = () => {
      const textMessage = `${practitioner?.user?.firstName} practitioner has invited you to register you child at their care centre. Tap this link to register ${firstName} for ${selectedClassroom?.name}: ${childDetails.caregiverRegistrationUrl}`;
      const whatsAppLink = `whatsapp://send?text=${textMessage}`;
      window.open(whatsAppLink);
    };

    setLoadingLink(false);
    dialog({
      color: 'bg-white',
      render: (onSubmit, onCancel) => {
        // if (!!practitioner?.id) {
        //   return (
        //     <CaregiverMultipleChildrenModal
        //       title="Link copied!"
        //       onSubmit={() => {
        //         history.goBack();
        //         onSubmit();
        //       }}
        //       onCancel={() => {
        //         onExit();
        //         onCancel();
        //       }}
        //     />
        //   );
        // }

        return (
          <CaregiverChildRegistrationModal
            onSubmit={whatsapp}
            onCancel={() => {
              onExit();
              onCancel();
            }}
            firstName={firstName || ''}
            caregiverUrl={newChild?.caregiverRegistrationUrl || ''}
            couldCopyToClipboard={linkCopied}
          />
        );
      },
      position: DialogPosition.Middle,
    });
  };

  const gotoChildProfile = (childId: string, classroomGroupId: string) => {
    history.push(ROUTES.CHILD_PROFILE, {
      childId: childId,
      classroomGroupIdFromRedirect: classroomGroupId,
    } as ChildProfileRouteState);
  };

  const handleNoClasses = () => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            title={`Add a class first!`}
            detailText={`You need to add a class before you can add children.`}
            icon={'ExclamationCircleIcon'}
            iconColor="alertMain"
            iconSize={20}
            className={'mx-4'}
            actionButtons={[
              {
                text: 'Add a class',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  history.push(ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS, {
                    redirectFromBusinessToAddClass: true,
                  } as EditPlaygroupsRouteState);
                  onClose();
                },
                leadingIcon: 'PlusCircleIcon',
              },
              {
                text: 'Close',
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  history.goBack();
                  onClose();
                },
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const showMenuOptions = (newChild: ChildRegistrationDto) => {
    dialog({
      position: DialogPosition.Middle,
      blocking: true,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            title={``}
            detailText={`How would you like to complete ${firstName}'s registration?`}
            iconSize={20}
            customIcon={
              <div className="text-center">
                <img
                  src={iconRobot}
                  alt="robot"
                  className="mb-2 mr-6 h-24 w-24"
                />
              </div>
            }
            className={'mx-4'}
            actionButtons={[
              {
                text: 'Copy link to send to caregiver',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  createLink(newChild);
                  onExit();
                  onClose();
                },
                leadingIcon: 'LinkIcon',
              },
              {
                text: 'Fill in the registration form',
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  onUploadSelf(newChild);
                  onClose();
                },
                leadingIcon: 'ClipboardListIcon',
              },
              {
                text: 'Download registration form',
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  onDownloadChildForm();
                  onExit();
                  onClose();
                },
                leadingIcon: 'DownloadIcon',
              },
              {
                text: 'Do this later',
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  gotoChildProfile(
                    newChild?.childId!,
                    newChild?.classroomGroupId!
                  );
                  onClose();
                },
                leadingIcon: 'ClockIcon',
              },
            ]}
          />
        );
      },
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography type="h2" color="textDark" text="Child" />
      <Typography type={'h4'} text="Basic details" color={'textMid'} />

      <FormInput<ChildBasicInfoModel>
        className="mt-4"
        register={register}
        nameProp="firstName"
        label="First name"
        placeholder="First name"
      />
      <FormInput<ChildBasicInfoModel>
        className="mt-4"
        register={register}
        nameProp="surname"
        label="Surname"
        placeholder="Surname/Family name"
      />

      <Dropdown<string>
        fullWidth
        className="mt-4"
        label="Which class will the child attend?"
        placeholder="Select class"
        selectedValue={getSelectedClassroomGroupId()}
        list={allClassroomGroups.map((x) => ({
          label: x.name,
          value: x.id || '',
        }))}
        onChange={(classroomId: string) => {
          setValue('playgroupId', classroomId, { shouldValidate: true });
        }}
      />

      {checkChild?.dateOfBirth && (
        <div>
          <Alert
            title={`There is already a child named ${checkChild?.fullName} at ${
              checkChild?.programmeName
            }, born on ${format(
              new Date(checkChild?.dateOfBirth!),
              'dd MMM yyyy'
            )}.`}
            type="warning"
            list={[
              'Please make sure that you are not adding the same child again.',
            ]}
            className={'mt-4'}
          />
          {listItems && (
            <StackedList
              className={'my-4'}
              listItems={listItems}
              type={'UserAlertList'}
            />
          )}
        </div>
      )}

      <Button
        className="mt-auto"
        text="Save"
        icon="SaveIcon"
        iconPosition="start"
        disabled={!formState.isValid || isLoading}
        isLoading={isLoading}
        type="filled"
        color="quatenary"
        textColor="white"
        onClick={() => {
          generateCaregiverChildToken();
        }}
      />
    </div>
  );
};
