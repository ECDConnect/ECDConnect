import {
  EditClassModel,
  editClassroomSchema,
} from '@/schemas/practitioner/edit-class';
import { useAppDispatch } from '@store';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';
import {
  Typography,
  FormInput,
  ButtonGroup,
  ButtonGroupTypes,
  Button,
  Dropdown,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { classroomsActions, classroomsSelectors } from '@store/classroom';
import { newGuid } from '@/utils/common/uuid.utils';
import { useSelector } from 'react-redux';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { buttonDays } from './setup-classes.types';
import { yesNoOptions } from '../add-programme-form/add-programme-form.types';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { useTenant } from '@/hooks/useTenant';
import { userSelectors } from '@/store/user';
import { useNotificationService } from '@/hooks/useNotificationService';

export const AddClassForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const classroom = useSelector(classroomsSelectors.getClassroom);
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const { stopService } = useNotificationService();
  const practitioners = useSelector(
    practitionerSelectors.getPrincipalPractitioners
  );
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const userData = useSelector(userSelectors.getUser);
  const [classCount, setClassCount] = useState(1);
  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: any }[]
  >([]);

  const appDispatch = useAppDispatch();
  const {
    setValue: setClassFormValue,
    getValues: getClassFormValues,
    register: classFormRegister,
    reset: resetClassForm,
    control: classFormControl,
    trigger,
  } = useForm<EditClassModel>({
    resolver: yupResolver(editClassroomSchema),
    mode: 'onBlur',
    defaultValues: {
      classroomId: '',
      name: '',
      practitionerId: '',
      isFullDay: true,
    },
    reValidateMode: 'onBlur',
  });

  const classroomGroup = useSelector(classroomsSelectors.getClassroomGroups);

  const { name, meetEveryday, practitionerId } = useWatch({
    control: classFormControl,
  });

  useEffect(() => {
    if (meetEveryday == null) return;

    if (!meetEveryday) {
      setClassFormValue('meetingDays', []);
    } else {
      setClassFormValue('meetingDays', [1, 2, 3, 4, 5]);
    }

    trigger();
  }, [meetEveryday, setClassFormValue, trigger]);

  useEffect(() => {
    setClassCount(classroomGroup.length + 1);
  }, [classroomGroup]);

  useEffect(() => {
    const _list = (practitioners ?? [])
      ?.filter((item) => item?.userId)
      ?.map((p) => {
        if (isOpenAccess) {
          if (p.firstName) {
            return { label: `${p.firstName}`, value: p.userId };
          }
        }
        if ((p.firstName && p.surname && !isOpenAccess) || p?.idNumber) {
          return {
            label: `${p.firstName || p?.idNumber} ${p.surname}`,
            value: p.userId,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    _list.push({
      label:
        currentPractitioner?.user?.fullName ||
        currentPractitioner?.user?.userName ||
        '',
      value: currentPractitioner?.userId,
    });

    const filteredList = _list.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.value === value.value)
    );

    setPractitionersList(filteredList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid = () => {
    const meetingDays = getClassFormValues().meetingDays;
    return meetingDays && meetingDays?.length > 1 && practitionerId;
  };

  const saveClassData = async () => {
    const data = getClassFormValues();
    const today = new Date().toISOString();
    if (data) {
      const classroomGroupId = newGuid();
      const classroomGroupModel: ClassroomGroupDto = {
        id: classroomGroupId,
        classroomId: classroom?.id ?? '',
        name: data?.name || `Class ${classCount}`,
        userId: data?.practitionerId!,
        learners: [],
        classProgrammes: data.meetingDays.map((x) => {
          return {
            id: newGuid(),
            classroomGroupId: classroomGroupId,
            meetingDay: x,
            isActive: true,
            programmeStartDate: today,
            isFullDay: data?.isFullDay || false,
            synced: false,
          };
        }),
      };

      // moving database calls to setup-principal final step
      await appDispatch(
        classroomsActions.createClassroomGroup(classroomGroupModel)
      );

      (async () =>
        await appDispatch(
          practitionerThunkActions.getPractitionerByUserId({
            userId: userData?.id || '',
          })
        ).unwrap())().then(() => {
        stopService();
      });
    }
  };

  const addAnotherClass = () => {
    saveClassData();
    resetClassForm({
      name: '',
      practitionerId: '',
      isFullDay: true,
    });
  };

  return (
    <div>
      <div className=" flex flex-col gap-4 pb-8">
        <Typography
          type={'h1'}
          text={name || `Add class ${classCount}`}
          color={'primary'}
          className={'my-3'}
        />

        <FormInput<EditClassModel>
          type="text"
          label={`Give your class a name`}
          register={classFormRegister}
          nameProp={'name'}
          hint="Optional"
          placeholder={'e.g. Elephant'}
        />

        <div>
          <Controller
            name={'practitionerId'}
            defaultValue={''}
            control={classFormControl}
            render={({ field: { onChange, value, ref } }) => (
              <Dropdown<string>
                inputRef={ref}
                placeholder={'Select a practitioner'}
                list={practitionersList}
                fillType="clear"
                label={'Which Practitioner teaches this class?'}
                fullWidth
                className={'mt-3 w-full'}
                selectedValue={value}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div>
          <span>{`Does ${
            name ? `${name}` : 'this'
          } class meet everyday?`}</span>
          <div className="mt-2">
            <Controller
              name={'meetEveryday'}
              control={classFormControl}
              render={({ field: { onChange, value, ref } }) => (
                <ButtonGroup<boolean>
                  inputRef={ref}
                  options={yesNoOptions}
                  onOptionSelected={onChange}
                  selectedOptions={value}
                  color="secondary"
                  type={ButtonGroupTypes.Button}
                  className={'w-full'}
                />
              )}
            />
          </div>
        </div>

        {meetEveryday === false && (
          <div>
            <span>{`When does ${
              name ? `"${name}"` : 'the'
            } class meet? `}</span>
            <span>You must choose at least 2 days</span>
            <div className="mt-2 -mb-4">
              <Controller
                name={'meetingDays'}
                control={classFormControl}
                render={({ field: { onChange, value, ref } }) => (
                  <ButtonGroup<number>
                    inputRef={ref}
                    type={ButtonGroupTypes.Chip}
                    options={buttonDays}
                    onOptionSelected={(value: number | number[]) => {
                      if (typeof value !== 'number') {
                        value = value.sort();
                      }
                      onChange(value as Weekdays[]);
                    }}
                    multiple
                    selectedOptions={value || []}
                    color="secondary"
                  />
                )}
              />
            </div>
          </div>
        )}

        <Button
          icon="ViewGridAddIcon"
          type={'outlined'}
          color={'quatenary'}
          text="Add another class"
          className="w-full"
          disabled={!isFormValid()}
          onClick={addAnotherClass}
          textColor="quatenary"
        />
      </div>

      <div className="max-h-20 w-full bg-white pb-4">
        <Button
          size="normal"
          className="w-full"
          type="filled"
          color="quatenary"
          text="Save"
          textColor="white"
          icon="SaveIcon"
          disabled={!isFormValid()}
          onClick={() => {
            saveClassData();
            onSubmit();
          }}
        />
      </div>
    </div>
  );
};
