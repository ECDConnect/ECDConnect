import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  Button,
  ButtonGroup,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ButtonGroupTypes } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
  const isFormValid = () => {
    return isValid && meetingDays && meetingDays?.length > 1;
  };

  const getCannotDeletePlaygroupRender = (submit: () => void) => {
    return (
      <ActionModal
        title={`Cannot delete this playgroup`}
        paragraphs={[
          'You cannot delete this playgroup because there are still children in the playgroup.',
          'Please move the children to a different playgroup before deleting.',
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
          `Are you sure you want to delete ${playgroup?.name} playgroup?`,
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
        label={`Give your playgroup a name`}
        register={playgroupFormRegister}
        nameProp={'name'}
        placeholder={'E.g. Tuesday Group'}
      />
      <Typography
        text={playgroupName?.message || ''}
        className="text-errorMain -mb-4"
        type={'small'}
      />
      <div className="mt-5">
        <span className={styles.label}>{`When does ${
          name ? `"${name}"` : 'the'
        } playgroup meet?`}</span>
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
      <Divider className="mt-4 mb-2" />
      <>
        <Button
          type="filled"
          color="primary"
          className={'w-full mt-10'}
          onClick={() => {
            onSubmit(getPlaygroupFormValues());
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
            className="w-full mt-10"
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
