import { useMutation } from '@apollo/client';
import {
  FranchisorDto,
  franchisorSchema,
  initialFranchisorValues,
  NOTIFICATION,
  useNotifications,
} from '@ecdlink/core';
import { FranchisorInput, UpdateFranchisor } from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FranchisorForm from '../../../components/franchisor-form/franchisor-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';

export interface FranchisorPanelProps {
  franchisor: FranchisorDto;
  closeDialog: (value: boolean) => void;
}

export default function FranchisorPanelEdit({
  franchisor,
  closeDialog,
}: FranchisorPanelProps) {
  const { setNotification } = useNotifications();

  const emitCloseDialog = (value: boolean) => {
    closeDialog(value);
  };

  const [updateFranchisor] = useMutation(UpdateFranchisor);

  const {
    register: franchisorRegister,
    setValue: franchisorSetValue,
    formState: franchisorFormState,
    getValues: franchisorGetValues,
  } = useForm({
    resolver: yupResolver(franchisorSchema),
    defaultValues: initialFranchisorValues,
    mode: 'onBlur',
  });
  const { errors: franchisorFormErrors, isValid: isFranchisorValid } =
    franchisorFormState;

  useEffect(() => {
    if (franchisor) {
      franchisorSetValue('areaOfOperation', franchisor.areaOfOperation ?? '', {
        shouldValidate: true,
      });
      franchisorSetValue(
        'secondaryAreaOfOperation',
        franchisor.secondaryAreaOfOperation ?? '',
        {
          shouldValidate: true,
        }
      );
      franchisorSetValue(
        'startDate',
        franchisor.startDate ? new Date(franchisor.startDate) : undefined,
        {
          shouldValidate: true,
        }
      );
    }
  }, [franchisor, franchisorSetValue]);

  const onSave = async () => {
    if (isFranchisorValid) {
      await saveFranchisor();
      emitCloseDialog(true);
    }
  };

  const saveFranchisor = async () => {
    const franchisorForm = franchisorGetValues();

    const franchisorInputModel: FranchisorInput = {
      Id: franchisor.id,
      UserId: franchisor.userId,
      AreaOfOperation: franchisorForm.areaOfOperation,
      SecondaryAreaOfOperation: franchisorForm.secondaryAreaOfOperation,
      StartDate: franchisorForm.startDate,
      IsActive: true,
    };

    await updateFranchisor({
      variables: {
        id: franchisor.id,
        input: { ...franchisorInputModel },
      },
    });

    setNotification({
      title: 'Successfully Updated Franchisor!',
      variant: NOTIFICATION.SUCCESS,
    });
  };

  const getComponent = () => {
    return (
      <FranchisorForm
        formKey={`editfranchisor-${new Date().getTime()}-${franchisor.id}`}
        register={franchisorRegister}
        errors={franchisorFormErrors}
      />
    );
  };

  return (
    <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
      <article>
        <UserPanelSave
          user={franchisor.user}
          disabled={!isFranchisorValid}
          onSave={onSave}
        />

        <div className="mt-6 max-w-5xl mx-auto sm:px-6 lg:px-8">
          {getComponent()}
        </div>
      </article>
    </div>
  );
}
