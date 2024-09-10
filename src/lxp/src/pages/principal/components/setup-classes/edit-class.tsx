import {
  Typography,
  FormInput,
  Dropdown,
  ButtonGroup,
  ButtonGroupTypes,
  Button,
} from '@ecdlink/ui';
import {
  EditClassModel,
  editClassroomSchema,
} from '@/schemas/practitioner/edit-class';
import { useAppDispatch } from '@/store';
import { Weekdays } from '@/utils/practitioner/playgroups-utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from '@/store/classroom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { newGuid } from '@/utils/common/uuid.utils';
import { practitionerSelectors } from '@/store/practitioner';
import { buttonDays } from '../setup-classes/setup-classes.types';
import { yesNoOptions } from '../add-programme-form/add-programme-form.types';
import { userSelectors } from '@/store/user';
import { useTenant } from '@/hooks/useTenant';

// TODO: Refactor this into add-class component
export const EditClass = ({
  classToEdit,
  onSubmit,
  editClassroomId,
}: {
  classToEdit: EditClassModel;
  editClassroomId: string;
  onSubmit: () => void;
}) => {
  const appDispatch = useAppDispatch();
  const tenant = useTenant();
  const isOpenAccess = tenant?.isOpenAccess;
  const practitioners = useSelector(
    practitionerSelectors?.getPrincipalPractitioners
  );
  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );

  const { setValue, getValues, register, control, trigger } =
    useForm<EditClassModel>({
      defaultValues: {
        ...classToEdit,
        classroomId: editClassroomId,
      },
      resolver: yupResolver(editClassroomSchema),
      mode: 'onBlur',
      reValidateMode: 'onBlur',
    });
  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: any }[]
  >([]);
  const user = useSelector(userSelectors.getUser);

  const { name, meetEveryday, meetingDays, practitionerId, isFullDay } =
    useWatch({
      control,
    });

  const isValid = name && meetingDays && practitionerId;

  useEffect(() => {
    const _list = practitioners
      ?.map((p) => {
        if (isOpenAccess) {
          if (p.firstName) {
            return { label: `${p.firstName}`, value: p.userId };
          }
        }
        if (p.firstName && p.surname && !isOpenAccess) {
          return { label: `${p.firstName} ${p.surname}`, value: p.userId };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    _list.push({
      label: currentPractitioner?.user?.fullName || '',
      value: currentPractitioner?.userId,
    });

    setPractitionersList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (meetEveryday == null) return;
    if (meetEveryday) {
      setValue('meetingDays', [1, 2, 3, 4, 5]);
    } else {
      setValue(
        'meetingDays',
        meetingDays?.length === 5 ? [] : (meetingDays as number[])
      );
    }
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetEveryday, setValue, trigger]);

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classToEdit.id)
  );

  const isFormValid = () => {
    const meetingDays = getValues().meetingDays;
    return isValid && meetingDays && meetingDays?.length > 1;
  };

  const saveEditedClassroom = () => {
    // Get updated classroom programmes
    const updatedClassroomProgrammes = classroomGroup!.classProgrammes.map(
      (programme) => {
        const removed = !(meetingDays || []).includes(programme.meetingDay);
        return {
          ...programme,
          isActive: !removed,
          synced: !removed,
        };
      }
    );

    // Add new
    (meetingDays as number[]).forEach((i) => {
      if (!classToEdit.meetingDays.includes(i)) {
        updatedClassroomProgrammes.push({
          id: newGuid(),
          classroomGroupId: classToEdit.id,
          isFullDay: isFullDay || false,
          meetingDay: i,
          isActive: true,
          programmeStartDate: new Date().toUTCString(),
          synced: false,
        });
      }
    });

    appDispatch(
      classroomsActions.updateClassroomGroup({
        id: classToEdit.id,
        name: name || '',
        classroomId: editClassroomId,
        userId: practitionerId!,
        learners: [], // Todo might need to check on this
        classProgrammes: updatedClassroomProgrammes,
      })
    );

    appDispatch(
      classroomsThunkActions.updateClassroomGroup({
        id: classToEdit.id,
        classroomGroup: {
          classroomId: editClassroomId,
          id: classToEdit.id,
          name: name || '',
          userId: practitionerId!,
          learners: [],
        },
      })
    );

    appDispatch(classroomsThunkActions.upsertClassroomGroupProgrammes({}));

    onSubmit();
  };

  const deleteClassroom = () => {
    appDispatch(
      classroomsActions.deleteClassroomGroup({
        id: classToEdit.id,
        name: classToEdit.name ?? '',
        classroomId: editClassroomId,
      })
    );

    onSubmit();
  };

  return (
    <div>
      <div className=" flex flex-col gap-4 pb-20">
        <Typography
          type={'h1'}
          text={name}
          color={'primary'}
          className={'my-3'}
        />

        <FormInput<EditClassModel>
          type="text"
          label={`Give your class a name`}
          register={register}
          nameProp={'name'}
          hint="Optional"
          placeholder={'e.g. Elephant'}
        />

        <div>
          <Controller
            name={'practitionerId'}
            control={control}
            defaultValue={''}
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
        {/* {programmeType?.enumId === ProgrammeTypeEnum.Playgroup && (
          <div>
            <span>
              Do children attend this class for half the day or the full day?
            </span>
            <div className="mt-2">
              <Controller
                name={'isFullDay'}
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <ButtonGroup<boolean>
                    inputRef={ref}
                    options={isFullDayOptions}
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
        )} */}

        <div>
          <span>{`Does ${classToEdit.name} class meet everyday?`}</span>
          <div className="mt-2">
            <Controller
              name={'meetEveryday'}
              control={control}
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
                control={control}
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
                    selectedOptions={value}
                    color="secondary"
                  />
                )}
              />
            </div>
          </div>
        )}

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
            saveEditedClassroom();
          }}
        />
        <Button
          icon="ViewGridAddIcon"
          type={'outlined'}
          color={'quatenary'}
          text="Delete Class"
          textColor="quatenary"
          className="w-full"
          disabled={!isFormValid()}
          onClick={() => {
            deleteClassroom();
          }}
        />
      </div>
    </div>
  );
};
