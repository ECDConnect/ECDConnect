import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  Button,
  ButtonGroup,
  DialogPosition,
  FormInput,
  Typography,
  Dropdown,
  ButtonGroupTypes,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import * as styles from '../../edit-practitioner-profile.styles';
import {
  EditPlaygroupModel,
  editPlaygroupSchema,
} from '@schemas/practitioner/edit-playgroups';
import { buttonDays, EditPlaygroupProps } from './edit-playgroup.form.types';
import {
  canDeleteClassroomGroup,
  Weekdays,
} from '@utils/practitioner/playgroups-utils';
import {
  ClassroomGroupDto,
  DialogModalOptions,
  RecursivePartial,
  useDialog,
} from '@ecdlink/core';
import { ClassroomGroupService } from '@services/ClassroomGroupService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@store/auth';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../../modals/offline-sync/online-only-modal';
import { practitionerSelectors } from '@/store/practitioner';
import { yesNoOptions } from '../edit-programme-form/edit-programme-form.types';

export const EditPlaygroupForm: React.FC<EditPlaygroupProps> = ({
  isNew,
  playgroup,
  title = 'Playgroup',
  onDelete,
  onSubmit,
}) => {
  const [selectedDays, setSelectedDays] = useState<Weekdays[]>([]);
  const authUser = useSelector(authSelectors.getAuthUser);
  const [classroomGroup, setClassroomGroup] =
    useState<RecursivePartial<ClassroomGroupDto>>();
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );

  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();
  const {
    getValues: getPlaygroupFormValues,
    formState: playgroupsFormState,
    setValue: setPlaygroupFormValue,
    register: playgroupFormRegister,
    reset: resetPlaygroupFormValue,
    control: playgroupFormControl,
    trigger,
  } = useForm<EditPlaygroupModel>({
    resolver: yupResolver(editPlaygroupSchema),
    mode: 'onBlur',
    defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { meetingDays, name, meetEveryday, userId } = useWatch({
    control: playgroupFormControl,
    defaultValue: playgroup,
  });
  const {
    isValid,
    errors: { name: playgroupName },
  } = playgroupsFormState;

  const isFormValid = () => {
    return isValid && meetingDays && meetingDays?.length > 1 && !!userId;
  };

  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: any }[]
  >([]);

  useEffect(() => {
    const _list = practitioners
      ?.map((p) => {
        if (p?.user?.fullName || p?.user?.userName) {
          return {
            label: `${p?.user?.firstName || p?.user?.userName} ${
              p?.user?.surname !== null ? p?.user?.surname : ''
            }`,
            value: p.userId,
          };
        }
        return undefined;
      })
      .filter(Boolean) as { label: string; value: any }[];

    _list.push({
      label:
        (currentPractitioner?.user?.fullName !== ' ' &&
          currentPractitioner?.user?.fullName !== '' &&
          currentPractitioner?.user?.fullName) ||
        currentPractitioner?.user?.firstName ||
        currentPractitioner?.user?.userName ||
        '',
      value: currentPractitioner?.userId,
    });

    setPractitionersList(_list);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioners]);

  useEffect(() => {
    if (meetEveryday == null) return;

    if (!meetEveryday) {
      setPlaygroupFormValue('meetingDays', []);
    } else {
      setPlaygroupFormValue('meetingDays', [1, 2, 3, 4, 5]);
    }

    trigger();
  }, [meetEveryday, setPlaygroupFormValue, trigger]);

  const getCannotDeletePlaygroupRender = (submit: () => void) => {
    return (
      <ActionModal
        title={`You cannot delete this class`}
        alertMessage="To delete a class, first move all children to a different class or remove children who are no longer in your preschool."
        actionButtons={[
          {
            text: 'Okay',
            textColour: 'white',
            colour: 'quatenary',
            type: 'filled',
            onClick: submit,
            leadingIcon: 'CheckCircleIcon',
          },
        ]}
      />
    );
  };

  const getOnlineOnlyRender = (submit: () => void) => {
    return <OnlineOnlyModal onSubmit={submit}></OnlineOnlyModal>;
  };

  const getDeletePlaygroupRender = (submit: () => void, cancel: () => void) => {
    return (
      <ActionModal
        title={`Delete ${playgroup?.name}.`}
        paragraphs={[
          `Are you sure you want to delete ${playgroup?.name} class?`,
        ]}
        actionButtons={[
          {
            text: 'Delete',
            textColour: 'white',
            colour: 'quatenary',
            type: 'filled',
            onClick: () => {
              onDelete && onDelete();
              submit();
            },
            leadingIcon: 'TrashIcon',
          },
          {
            text: 'Cancel',
            textColour: 'quatenary',
            colour: 'quatenary',
            type: 'outlined',
            onClick: () => cancel(),
            leadingIcon: 'XIcon',
          },
        ]}
      />
    );
  };
  // TODO: refactor this to use the new component: src/lxp/src/components/delete-class
  const confirmDelete = () => {
    let dialogOptionModel: DialogModalOptions = {
      position: DialogPosition.Middle,
      render: () => <></>,
    };

    if (!isOnline) {
      dialogOptionModel = {
        ...dialogOptionModel,
        render: getOnlineOnlyRender,
      };
      displayDialog(dialogOptionModel);
      return;
    }

    const canDeleteGroup = canDeleteClassroomGroup(
      classroomGroup as ClassroomGroupDto
    );

    if (!canDeleteGroup) {
      dialogOptionModel = {
        ...dialogOptionModel,
        render: getCannotDeletePlaygroupRender,
      };
      displayDialog(dialogOptionModel);
      return;
    }

    dialog({
      position: DialogPosition.Middle,
      render: getDeletePlaygroupRender,
    });
  };

  const displayDialog = (options: DialogModalOptions) => {
    dialog(options);
  };

  const handleDaySelection = (selectedDays: Weekdays[]) => {
    setSelectedDays(selectedDays);
    setPlaygroupFormValue('meetingDays', selectedDays, {
      shouldValidate: true,
    });
  };

  useEffect(() => {
    resetPlaygroupFormValue(playgroup);

    if (!playgroup) return;

    if (playgroup.meetingDays) {
      handleDaySelection(playgroup?.meetingDays as Weekdays[]);
    }

    if (playgroup.classroomGroupId) {
      const getClassgroupRequest = async (classroomGroupId: string) => {
        const result = await new ClassroomGroupService(
          authUser?.auth_token || ''
        ).getClassroomGroupById(classroomGroupId);

        setClassroomGroup(result);
      };

      getClassgroupRequest(playgroup.classroomGroupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playgroup]);

  return (
    <div className="flex h-full flex-col">
      <Typography
        type={'h1'}
        text={title}
        color={'primary'}
        className={'my-3'}
      />
      <FormInput<EditPlaygroupModel>
        label={`Give your class a name`}
        register={playgroupFormRegister}
        nameProp={'name'}
        placeholder={'E.g. Tuesday class'}
        value={name}
        hint="Optional"
      />
      <Typography
        text={playgroupName?.message || ''}
        className="text-errorMain -mb-4"
        type={'small'}
      />
      <div>
        <Controller
          name={'userId'}
          control={playgroupFormControl}
          render={({ field: { onChange, value, ref } }) => (
            <Dropdown
              inputRef={ref}
              placeholder={'Select a practitioner'}
              list={practitionersList}
              fillType="clear"
              label={'Which Practitioner teaches this class?'}
              fullWidth
              className={'mt-6 w-full'}
              selectedValue={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="mt-6">
        <span className="text-textDark font-semibold">{`Does ${
          name ? `${name}` : 'this'
        } class meet everyday?`}</span>
        <div className="mt-2">
          <Controller
            name={'meetEveryday'}
            control={playgroupFormControl}
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
        <div className="mt-4">
          <span className={styles.label}>{`When does ${
            name ? `"${name}"` : 'the'
          } class meet?`}</span>
          <span className={styles.hintStyle}>
            You must choose at least 2 days
          </span>
          <div className="mt-2">
            <ButtonGroup<number>
              type={ButtonGroupTypes.Chip}
              options={buttonDays}
              onOptionSelected={(value: number | number[]) => {
                if (typeof value !== 'number') {
                  value = value.sort();
                }
                handleDaySelection(value as Weekdays[]);
              }}
              multiple
              selectedOptions={selectedDays}
              color="secondary"
            />
          </div>
        </div>
      )}
      {/* {isPlaygroup && (
        <div className="mt-1">
          <span className={styles.label}>
            Do children attend this playgroup for half the day or the full day?
          </span>
          <div className="mt-2">
            <ButtonGroup<boolean>
              onOptionSelected={(value: boolean | boolean[]) =>
                setPlaygroupFormValue('isFullDay', value as boolean, {
                  shouldValidate: true,
                })
              }
              type={ButtonGroupTypes.Button}
              options={dayTypes}
              selectedOptions={isFullDay}
              color="secondary"
            />
          </div>
        </div>
      )} */}
      <div className="mt-auto">
        <Button
          type="filled"
          color="quatenary"
          className={'mt-10 w-full'}
          onClick={() => {
            onSubmit(
              // isPlaygroup
              //   ? getPlaygroupFormValues()
              //   :
              {
                ...getPlaygroupFormValues(),
                isFullDay: undefined,
                name: !name ? title : name,
              }
            );
          }}
          disabled={!isFormValid()}
          icon={isNew ? 'ArrowCircleRightIcon' : 'SaveIcon'}
          text={isNew ? 'Next' : 'Save'}
          textColor="white"
        />
        {!isNew && (
          <Button
            type="outlined"
            color="quatenary"
            className="mt-4 w-full"
            onClick={confirmDelete}
            icon="TrashIcon"
            text="Delete"
            textColor="quatenary"
          />
        )}
      </div>
    </div>
  );
};
