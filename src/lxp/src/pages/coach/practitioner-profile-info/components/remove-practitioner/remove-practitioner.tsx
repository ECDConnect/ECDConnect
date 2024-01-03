import {
  ClassroomGroupDto,
  ReasonForLeavingDto,
  ReasonsForPractitionerLeaving,
  UserDto,
} from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  BannerWrapper,
  Button,
  Dialog,
  Divider,
  FormInput,
  Typography,
  renderIcon,
  classNames,
  Dropdown,
  Alert,
  DialogPosition,
} from '@ecdlink/ui';
import { useAppDispatch } from '@store/config';
import { authSelectors } from '@store/auth';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  RemovePractionerModel,
  removePractionerModelSchema,
  initialRemovePractionerValues,
} from '@/schemas/practitioner/remove-practioner';
import * as styles from './remove-practitioner.styles';
import { RemovePractionerProps } from './remove-practitioner.types';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import { PractitionerProfileRouteState } from '../../practitioner-profile-info.types';
import { PractitionerService } from '@/services/PractitionerService';
import ROUTES from '@routes/routes';
import { classroomsForCoachSelectors } from '@/store/classroomForCoach';
import { RemovePractitionerPrompt } from './remove-practitioner-prompt';

export const RemovePractioner: React.FC<RemovePractionerProps> = ({
  removeReasonId,
  onSuccess,
}) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const authUser = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const reasonsForLeaving = useSelector(
    staticDataSelectors.getReasonsForPractitionerLeaving
  );
  const practitionerUserId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerUserId
  );
  const coachClassrooms = useSelector(
    classroomsForCoachSelectors.getClassroomForCoach
  );
  const practitionerClassroom = coachClassrooms?.find(
    (item) => item.userId === practitionerUserId
  );

  //Get list of practitioners for classroom
  const practitionersForClass = useMemo<
    { label: string; value: string }[]
  >(() => {
    return (
      ((practitioner?.isPrincipal || practitioner?.isFundaAppAdmin
        ? practitioners?.filter(
            // If they are the principal, get any practitioners where their principal is this practitioner
            (x) => x.principalHierarchy === practitionerUserId
          )
        : practitioners?.filter(
            // Get other practitioners with the same principal, their principal and not themselves
            (x) =>
              (x.userId === practitioner?.principalHierarchy ||
                x.principalHierarchy === practitioner?.principalHierarchy) &&
              x.userId !== practitionerUserId
          )
      )
        ?.map((p) => {
          if (p?.user?.firstName && p?.user?.surname) {
            return {
              label: `${p?.user?.firstName} ${p?.user?.surname}`,
              value: p.userId,
            };
          }
          return undefined;
        })
        .filter(Boolean) as { label: string; value: string }[]) || []
    );
  }, [practitionerUserId, practitioner, practitioners]);

  const [reasonDetailsVisible, setReasonDetailsVisible] =
    useState<boolean>(false);
  const {
    getValues: getRemovePractionerFormValues,
    setValue: setRemovePractionerFormValues,
    trigger: triggerRemovePractionerForm,
    register: removePractionerFormRegister,
    control: removePractionerFormControl,
  } = useForm<RemovePractionerModel>({
    resolver: yupResolver(removePractionerModelSchema),
    mode: 'onChange',
    defaultValues: !removeReasonId
      ? initialRemovePractionerValues
      : {
          ...initialRemovePractionerValues,
          removeReasonId,
        },
  });

  const { isValid, errors } = useFormState({
    control: removePractionerFormControl,
  });

  const { reassignedClassrooms } = useWatch({
    control: removePractionerFormControl,
  });

  const [removePractionerPromptVisible, setRemovePractionerPromptVisible] =
    useState<boolean>(false);

  const [practitionerClassroomGroups, setPractitionerClassroomGroups] =
    useState<ClassroomGroupDto[]>();

  const classroomsGroupsForPractitioner = async () => {
    const classroomDetails = await new PractitionerService(
      authUser?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(practitioner?.userId!);
    const filteredClasses = classroomDetails.filter((x) => x.name !== 'Unsure');
    setPractitionerClassroomGroups(filteredClasses);
    var mappedClasses = filteredClasses.reduce((obj, val) => {
      return { ...obj, [val.id!]: undefined };
    }, {});
    setRemovePractionerFormValues('reassignedClassrooms', mappedClasses);
    triggerRemovePractionerForm();
    return classroomDetails;
  };

  useEffect(() => {
    classroomsGroupsForPractitioner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioner]);

  useEffect(() => {
    if (!practitionersForClass || !practitionersForClass.length) {
      setRemovePractionerFormValues('requireClassReassignments', false);
    } else {
      if (practitioner?.isPrincipal || practitioner?.isFundaAppAdmin) {
        setRemovePractionerFormValues('requirePrincipal', true);
      }
    }
  }, [practitioner, practitionersForClass]);

  const handleFormSubmit = async (formValues: RemovePractionerModel) => {
    if (isValid) {
      const reassignments = Object.keys(formValues.reassignedClassrooms).map(
        (x) => {
          return {
            classroomGroupId: x,
            practitionerId: formValues.reassignedClassrooms[x],
          };
        }
      );

      await new PractitionerService(
        authUser?.auth_token || ''
      ).RemovePractitioner(
        practitioner?.userId!,
        formValues.removeReasonId,
        formValues.reasonDetail,
        formValues.newPrincipalId,
        reassignments
      );
      await appDispatch(
        practitionerThunkActions.getAllPractitioners({})
      ).unwrap();
    }
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        backgroundColour={'uiBg'}
        renderBorder={true}
        title={`Remove ${practitioner?.user?.firstName}`}
        color={'primary'}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      >
        <div className="flex w-full justify-center">
          <Alert
            className="mt-10 w-11/12 rounded-xl"
            type={'error'}
            title={`${practitioner?.user?.firstName} will be removed from the programme immediately.`}
            list={[
              `If you remove ${practitioner?.user?.firstName} now, they will no longer be able to see child information or perform any actions in the classroom section.`,
            ]}
          />
        </div>
        <div className="py-4' px-4">
          <Typography
            type={'h1'}
            text={`Why is ${practitioner?.user?.firstName} leaving SmartStart?`}
            color={'primary'}
            className={'pt-1'}
          />

          <label className={classNames(styles.label, 'mt-4')}>
            {'Reason for leaving'}
          </label>
          <Dropdown<string>
            placeholder={'Choose reason'}
            fullWidth
            fillType="clear"
            list={
              (reasonsForLeaving &&
                reasonsForLeaving.map((x: ReasonForLeavingDto) => {
                  return { label: x.description, value: x.id || '' };
                })) ||
              []
            }
            selectedValue={getRemovePractionerFormValues().removeReasonId}
            onChange={(item) => {
              setRemovePractionerFormValues('removeReasonId', item);
              triggerRemovePractionerForm();
              setReasonDetailsVisible(
                item === ReasonsForPractitionerLeaving.OTHER
              );
            }}
          />
          {reasonDetailsVisible && (
            <FormInput<RemovePractionerModel>
              label={'Please add details'}
              className={'mt-3'}
              textInputType="textarea"
              register={removePractionerFormRegister}
              nameProp={'reasonDetail'}
              hint={'Optional'}
              placeholder={'E.g. Found the daily routine too difficult'}
              onChange={() => triggerRemovePractionerForm()}
              error={errors.reasonDetail}
            />
          )}
          {(practitioner?.isFundaAppAdmin || practitioner?.isPrincipal) &&
            !!practitionerClassroom &&
            !!practitionersForClass.length && (
              <div>
                <Dropdown
                  placeholder={'Select practitioner'}
                  list={practitionersForClass}
                  fillType="clear"
                  label={`Which practitioner will take over as ${
                    practitioner?.isFundaAppAdmin ? 'FAA' : 'principal'
                  } at ${practitionerClassroom.name}`}
                  fullWidth
                  className={'mt-3 w-11/12'}
                  onChange={(item: any) => {
                    setRemovePractionerFormValues('newPrincipalId', item);
                  }}
                />
                <div className="flex w-full justify-center">
                  <Alert
                    className="mt-10 w-11/12 rounded-xl"
                    type={'info'}
                    title={
                      'If the programme is closing down, please remove all other SmartStarters before removing the principal.'
                    }
                  />
                </div>
              </div>
            )}
          {practitionerClassroomGroups &&
            !!practitionersForClass.length &&
            !!practitionerClassroomGroups.length && (
              <div>
                <Divider dividerType="dashed" className="my-4" />
                <Typography
                  type={'h1'}
                  text={`Reassign ${practitioner?.user?.firstName} classes`}
                  color={'primary'}
                  className={'pt-1'}
                />
                <label className={classNames(styles.label, 'mt-4')}>
                  {`${practitioner?.user?.firstName} is still assigned to ${
                    practitionerClassroomGroups.length
                  } ${
                    practitionerClassroomGroups.length > 1 ? 'classes' : 'class'
                  }`}
                </label>
                <ul>
                  {practitionerClassroomGroups.map(
                    (classroomGroup: ClassroomGroupDto) => {
                      return (
                        <li key={classroomGroup.id}>
                          <Dropdown
                            placeholder={'Select practitioner'}
                            list={practitionersForClass || []}
                            fillType="clear"
                            label={`Which practitioner will teach ${classroomGroup.name}?`}
                            fullWidth
                            className={'mt-3 w-11/12'}
                            onChange={(item: string) => {
                              setRemovePractionerFormValues(
                                'reassignedClassrooms',
                                {
                                  ...reassignedClassrooms,
                                  [classroomGroup.id as string]: item,
                                }
                              );
                              triggerRemovePractionerForm();
                            }}
                          />
                        </li>
                      );
                    }
                  )}
                </ul>
                {!!errors.reassignedClassrooms && (
                  <div className="flex w-full justify-center">
                    <Alert
                      className="mt-10 w-11/12 rounded-xl"
                      type={'error'}
                      title={'You must reassign all classes'}
                    />
                  </div>
                )}
              </div>
            )}
          <div className={'py-4'}>
            <Divider></Divider>
          </div>
          <Button
            onClick={() => setRemovePractionerPromptVisible(true)}
            className="w-full"
            size="small"
            color="errorMain"
            type="filled"
            disabled={!isValid}
          >
            {renderIcon('TrashIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h6"
              className="ml-2"
              text={'Remove SmartStarter'}
              color="white"
            />
          </Button>
          <Button
            onClick={() => history.goBack()}
            className="mt-4 w-full"
            size="small"
            color="primary"
            type="outlined"
          >
            {renderIcon('XIcon', classNames('h-5 w-5 text-primary'))}
            <Typography
              type="h6"
              className="ml-2"
              text="Cancel"
              color="primary"
            />
          </Button>
        </div>
      </BannerWrapper>
      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={removePractionerPromptVisible}
        position={DialogPosition.Bottom}
      >
        <RemovePractitionerPrompt
          practitioner={practitioner}
          onProceed={() => {
            handleFormSubmit(getRemovePractionerFormValues());
            setRemovePractionerPromptVisible(false);
            history.push(ROUTES.COACH.PRACTITIONERS);
            onSuccess();
          }}
          onClose={() => setRemovePractionerPromptVisible(false)}
        />
      </Dialog>
    </>
  );
};

export default RemovePractioner;
