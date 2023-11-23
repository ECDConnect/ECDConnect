import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  Button,
  ButtonGroup,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
  Dropdown,
  ButtonGroupTypes,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import * as styles from '../../edit-practitioner-profile.styles';
import {
  EditPlaygroupModel,
  editPlaygroupSchema,
} from '@schemas/practitioner/edit-playgroups';
import {
  buttonDays,
  dayTypes,
  EditPlaygroupProps,
} from './edit-playgroup.form.types';
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
import { classroomsSelectors } from '@/store/classroom';

const playgroupId = 'c8858630-bb66-4d93-b93f-295cf7cd9ed5';

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
  const programmeType = useSelector(
    classroomsSelectors.getClassroomProgrammeType()
  );
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
  } = useForm<EditPlaygroupModel>({
    resolver: yupResolver(editPlaygroupSchema),
    mode: 'onBlur',
    defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isFullDay, meetingDays, name } = useWatch({
    control: playgroupFormControl,
    defaultValue: playgroup,
  });

  const {
    isValid,
    errors: { name: playgroupName },
  } = playgroupsFormState;

  const isPlaygroup = useMemo(
    () => programmeType?.id === playgroupId,
    [programmeType?.id]
  );

  const isFormValid = () => {
    const isValidFields = isPlaygroup
      ? typeof isFullDay === 'boolean' && isValid
      : isValid;
    return isValidFields && meetingDays && meetingDays?.length > 1;
  };

  const [practitionersList, setPractitionersList] = useState<
    { label: string; value: any }[]
  >([]);

  useEffect(() => {
    const _list = practitioners
      ?.map((p) => {
        if (p?.user?.firstName && p?.user?.surname) {
          return {
            label: `${p?.user?.firstName} ${p?.user?.surname}`,
            value: p.userId,
          };
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
  }, [practitioners]);

  const getCannotDeletePlaygroupRender = (submit: () => void) => {
    return (
      <ActionModal
        title={`Cannot delete this class`}
        paragraphs={[
          'You cannot delete this class because there are still children in the class.',
          'Please move the children to a different class before deleting.',
        ]}
        actionButtons={[
          {
            text: 'Okay',
            textColour: 'white',
            colour: 'primary',
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
            colour: 'primary',
            type: 'filled',
            onClick: () => {
              onDelete && onDelete();
              submit();
            },
            leadingIcon: 'TrashIcon',
          },
          {
            text: 'Cancel',
            textColour: 'primary',
            colour: 'primary',
            type: 'outlined',
            onClick: () => cancel(),
            leadingIcon: 'XIcon',
          },
        ]}
      />
    );
  };

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
    <>
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
              className={'mt-3 w-full'}
              selectedValue={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <Typography
        text={playgroupName?.message || ''}
        className="text-errorMain -mb-4"
        type={'small'}
      />
      <div className="mt-5">
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
      {isPlaygroup && (
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
      )}
      <Divider className="mt-4 mb-2" />
      <>
        <Button
          type="filled"
          color="primary"
          className={'mt-10 w-full'}
          onClick={() => {
            onSubmit(
              isPlaygroup
                ? getPlaygroupFormValues()
                : { ...getPlaygroupFormValues(), isFullDay: undefined }
            );
          }}
          disabled={!isFormValid()}
        >
          {renderIcon(
            `${isNew ? 'ArrowCircleRightIcon' : 'SaveIcon'}`,
            styles.icon
          )}

          <Typography
            type={'help'}
            text={`${isNew ? 'Next' : 'Save'}`}
            color={'white'}
          />
        </Button>
        {!isNew && (
          <Button
            type="outlined"
            color="primary"
            className="mt-10 w-full"
            onClick={confirmDelete}
          >
            {renderIcon('TrashIcon', styles.iconPrimary)}
            <Typography type={'help'} text={'Delete'} color={'primary'} />
          </Button>
        )}
      </>
    </>
  );
};
