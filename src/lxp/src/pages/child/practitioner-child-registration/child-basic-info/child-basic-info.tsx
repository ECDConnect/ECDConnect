import { FormComponentProps, getAvatarColor } from '@ecdlink/core';
import {
  Dropdown,
  FormInput,
  Typography,
  Button,
  Alert,
  UserAlertListDataItem,
  StackedList,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  childBasicInfoFormSchema,
  ChildBasicInfoModel,
} from '@schemas/child/child-registration/child-basic-info';
import { classroomsSelectors } from '@store/classroom';
import { format } from 'date-fns';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ChildMatchingDto } from './child-basic-info.types';
import { useAppDispatch } from '@/store';
import { childrenThunkActions } from '@/store/children';
import { debounce } from 'lodash';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const ChildBasicInfo: React.FC<
  FormComponentProps<ChildBasicInfoModel>
> = ({ onSubmit }) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();
  const allClassroomGroups = useSelector(
    classroomsSelectors?.getClassroomGroups
  );

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

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.FIND_CREATED_CHILD
  );

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

  const getSelectedClassroomGroup = (): string => {
    const values = getValues();

    return values.playgroupId ?? '';
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedDispatch = useCallback(
    debounce((firstName, surname, practitionerId) => {
      appDispatch(
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
        selectedValue={getSelectedClassroomGroup()}
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
        text="Next"
        icon="ArrowCircleRightIcon"
        iconPosition="start"
        disabled={!formState.isValid || isLoading}
        isLoading={isLoading}
        type="filled"
        color="quatenary"
        textColor="white"
        onClick={() => {
          onSubmit(getValues());
        }}
      />
    </div>
  );
};
