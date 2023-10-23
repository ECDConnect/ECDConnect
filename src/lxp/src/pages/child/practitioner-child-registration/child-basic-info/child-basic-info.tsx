import { FormComponentProps, getAvatarColor } from '@ecdlink/core';
import {
  Divider,
  Dropdown,
  FormInput,
  Typography,
  Button,
  Alert,
  UserAlertListDataItem,
  StackedList,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  childBasicInfoFormSchema,
  ChildBasicInfoModel,
} from '@schemas/child/child-registration/child-basic-info';
import { classroomsSelectors } from '@store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import { format } from 'date-fns';
import { ChildService } from '@/services/ChildService';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ChildMatchingDto } from './child-basic-info.types';
import { useLocation } from 'react-router';
import { PractitionerChildRegisterState } from '../types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { filterUniqueClassrooms } from '@/utils/classroom/classroom';
import { UNSURE_CLASS } from '@/constants/classroom';

export const ChildBasicInfo: React.FC<
  FormComponentProps<ChildBasicInfoModel>
> = ({ onSubmit }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const allClassroomGroups = useSelector(
    classroomsSelectors?.getAllClassroomGroups
  );
  const location = useLocation<PractitionerChildRegisterState>();

  const practitionerIdFromCoachFlow = location?.state?.practitionerId;

  const practitionerFromCoachFlow = useSelector(
    getPractitionerByUserId(practitionerIdFromCoachFlow || '')
  );
  const allPractitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitionerFromPractitionerFlow = useSelector(
    practitionerSelectors.getPractitioner
  );

  const practitioner =
    practitionerFromPractitionerFlow || practitionerFromCoachFlow;
  const isTrainee = practitioner?.isTrainee;
  const isPrincipal = practitioner?.isPrincipal;

  const userId = practitioner?.userId;

  const practitionersForPrincipal = allPractitioners?.filter(
    (item) => item.principalHierarchy === userId
  );
  const classroomsByPractitionersForPrincipal = allClassroomGroups.filter(
    (item) =>
      practitionersForPrincipal?.some(
        (practitioner) => practitioner.userId === item.userId
      )
  );
  // Practitioners who are not principals OR FAAs should not be able to see the “Unsure” class or add children to the unsure class
  const classroomForPractitioner = allClassroomGroups
    .filter((item) => item.userId === userId)
    .filter(
      (item) =>
        (isTrainee && item) || (!isTrainee && item.name !== UNSURE_CLASS)
    );

  let classroomsForPrincipal = isPrincipal
    ? [...classroomForPractitioner, ...classroomsByPractitionersForPrincipal]
    : allClassroomGroups;

  classroomsForPrincipal = filterUniqueClassrooms(classroomsForPrincipal);

  const [checkChild, setCheckChild] = useState<ChildMatchingDto>();
  const [listItems, setListItems] = useState<UserAlertListDataItem[]>([]);

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

  const setNewStackListItems = (checkChild: ChildMatchingDto) => {
    const list: UserAlertListDataItem[] = [
      {
        profileDataUrl: checkChild?.profileImageUrl || '',
        title: `${checkChild?.fullName}` || '',
        subTitle:
          `Added by ${checkChild?.practitionerName} on ${format(
            new Date(checkChild?.createdByDate!),
            'dd MMM yyyy'
          )}.` ?? '',
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

  const onNext = (formValue: ChildBasicInfoModel) => {
    onSubmit(formValue);
  };

  const getSelectedClassroom = (): string => {
    const values = getValues();

    return values.playgroupId ?? '';
  };

  useEffect(() => {
    if (firstName && surname && isOnline) {
      const checkChildMatching = async () => {
        const res = await new ChildService(
          userAuth?.auth_token!
        ).childCreatedByDetail(userAuth?.id!, firstName, surname);

        setCheckChild(res as ChildMatchingDto);
      };

      checkChildMatching();
    }
  }, [firstName, surname, userAuth?.auth_token, userAuth?.id, isOnline]);

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
        selectedValue={getSelectedClassroom()}
        list={
          !isPrincipal
            ? classroomForPractitioner.map((x) => ({
                label: x.name,
                value: x.id || '',
              }))
            : classroomsForPrincipal.map((x) => ({
                label: x.name,
                value: x.id || '',
              }))
        }
        onChange={(classroomId: string) => {
          setValue('playgroupId', classroomId, { shouldValidate: true });
        }}
      />

      {checkChild && (
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

      <Divider dividerType="solid" className="my-4" />
      <Button
        text="Next"
        icon="ArrowCircleRightIcon"
        iconPosition="start"
        disabled={!formState.isValid}
        type="filled"
        color="primary"
        textColor="white"
        onClick={() => {
          onNext(getValues());
        }}
      />
    </div>
  );
};
