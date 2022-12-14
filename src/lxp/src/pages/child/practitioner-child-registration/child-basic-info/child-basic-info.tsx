import { ChildDto, FormComponentProps, LearnerDto } from '@ecdlink/core';
import { getAvatarColor } from '@ecdlink/core';
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
import { childrenSelectors } from '@/store/children';
import { UserDto } from '@/../../../packages/core/src/models/dto/Users/user.dto';
import { format } from 'date-fns';

export const ChildBasicInfo: React.FC<
  FormComponentProps<ChildBasicInfoModel>
> = ({ onSubmit }) => {
  const getAllClassroomGroups = useSelector(
    classroomsSelectors?.getAllClassroomGroups
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const getClassroomForPrincipal = getAllClassroomGroups.filter((item) => {
    return item?.userId === practitioner?.userId || item?.isActive !== true;
  });
  const children = useSelector(childrenSelectors?.getChildren);

  const classroomsForPractitioner = useSelector(
    classroomsSelectors.getClassroom
  );

  const isPrincipal = practitioner?.isPrincipal;
  const [childUserListData, setChildUserListData] =
    useState<UserAlertListDataItem[]>();

  const classroomGroupLearners = useSelector(
    classroomsSelectors.getClassroomGroupLearners
  );

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
  const childAlreadyAdded = children?.find(
    (item) =>
      item?.user?.firstName === firstName! && item?.user?.surname === surname!
  );

  useEffect(() => {
    if (childAlreadyAdded) {
      const childListItem: UserAlertListDataItem[] = [];

      const learner = classroomGroupLearners.find(
        (x) =>
          x.userId === childAlreadyAdded.userId && x.stoppedAttendance == null
      );
      childListItem.push(mapUserListDataItem(childAlreadyAdded, learner));

      setChildUserListData(childListItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childAlreadyAdded]);

  const mapUserListDataItem = (
    childRecord: ChildDto,
    childLearner?: LearnerDto
  ): UserAlertListDataItem => {
    const childUser = childAlreadyAdded as UserDto;

    return {
      id: childRecord.id,
      profileDataUrl: childUser?.profileImageUrl,
      title: `${childAlreadyAdded?.user?.firstName} ${childAlreadyAdded?.user?.surname}`,
      subTitle:
        `Added by ${childAlreadyAdded?.insertedBy?.split(' ')[0]} on ${format(
          new Date(childAlreadyAdded?.insertedDate!),
          'LLL d'
        )}` ?? '',
      profileText: `${
        childAlreadyAdded?.user?.firstName &&
        childAlreadyAdded?.user?.firstName[0]?.toUpperCase()
      }${
        childAlreadyAdded?.user?.surname &&
        childAlreadyAdded?.user?.surname[0]?.toUpperCase()
      }`,
      alertSeverity: 'none',
      avatarColor: getAvatarColor() || '',
    };
  };

  const onNext = (formValue: ChildBasicInfoModel) => {
    onSubmit(formValue);
  };

  const getSelectedClassroom = (): string => {
    const values = getValues();

    return values.playgroupId ?? '';
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
        selectedValue={getSelectedClassroom()}
        list={
          isPrincipal
            ? getClassroomForPrincipal.map((x) => ({
                label: x.name,
                value: x.id || '',
              }))
            : getAllClassroomGroups.map((x) => ({
                label: x.name,
                value: x.id || '',
              }))
        }
        onChange={(classroomId: string) => {
          setValue('playgroupId', classroomId, { shouldValidate: true });
        }}
      />

      {childAlreadyAdded && (
        <div>
          <Alert
            title={`There is already a child named ${
              childAlreadyAdded?.user?.firstName +
              ' ' +
              childAlreadyAdded?.user?.surname
            } at ${classroomsForPractitioner?.name}, born on ${format(
              new Date(childAlreadyAdded?.user?.dateOfBirth!),
              'dd MMM yyyy'
            )}.`}
            type="warning"
            list={[
              'Please make sure that you are not adding the same child again.',
            ]}
            className={'mt-4'}
          />
          {childUserListData && (
            <StackedList
              className={'mt-4'}
              listItems={childUserListData!}
              type={'UserAlertList'}
            />
          )}
        </div>
      )}

      <Divider dividerType="solid" className="my-3" />
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
