import { useMutation } from '@apollo/client';
import {
  CoachDto,
  coachSchema,
  initialCoachValues,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { CoachInput, UpdateCoach } from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CoachForm from '../../../components/coach-form/coach-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';

export interface CoachPanelProps {
  coach: CoachDto;
  closeDialog: (value: boolean) => void;
}

export default function CoachPanelEdit({ coach, closeDialog }: CoachPanelProps) {
  const { setNotification } = useNotifications();

  const emitCloseDialog = (value: boolean) => {
    closeDialog(value);
  };

  const [updateCoach] = useMutation(UpdateCoach);

  const {
    register: coachRegister,
    setValue: coachSetValue,
    formState: coachFormState,
    getValues: coachGetValues,
  } = useForm({
    resolver: yupResolver(coachSchema),
    defaultValues: initialCoachValues,
    mode: 'onBlur',
  });
  const { errors: coachFormErrors, isValid: isCoachValid } = coachFormState;

  useEffect(() => {
    if (coach) {
      coachSetValue('areaOfOperation', coach.areaOfOperation ?? '', {
        shouldValidate: true,
      });
      coachSetValue('secondaryAreaOfOperation', coach.secondaryAreaOfOperation ?? '', {
        shouldValidate: true,
      });
      coachSetValue('startDate', coach.startDate ? new Date(coach.startDate) : undefined, {
        shouldValidate: true,
      });
    }
  }, [coach, coachSetValue]);

  const onSave = async () => {
    if (isCoachValid) {
      await saveCoach();
      emitCloseDialog(true);
    }
  };

  const saveCoach = async () => {
    const coachForm = coachGetValues();

    const coachInputModel: CoachInput = {
      Id: coach.id,
      UserId: coach.userId,
      AreaOfOperation: coachForm.areaOfOperation,
      SecondaryAreaOfOperation: coachForm.secondaryAreaOfOperation,
      StartDate: coachForm.startDate,
      IsActive: true,
    };

    await updateCoach({
      variables: {
        id: coach.id,
        input: { ...coachInputModel },
      },
    });

    setNotification({
      title: 'Successfully Updated Coach!',
      variant: NOTIFICATION.SUCCESS,
    });
  };

  const getComponent = () => {
    return (
      <CoachForm
        formKey={`editcoach-${new Date().getTime()}-${coach.id}`}
        register={coachRegister}
        errors={coachFormErrors}
      />
    );
  };

  return (
    <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
      <article>
        <UserPanelSave user={coach.user} disabled={!isCoachValid} onSave={onSave} />

        <div className="mt-6 max-w-5xl mx-auto sm:px-6 lg:px-8">{getComponent()}</div>
      </article>
    </div>
  );
}
