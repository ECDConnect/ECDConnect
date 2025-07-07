import { useMutation } from '@apollo/client';
import {
  CoachDto,
  coachSchema,
  initialCoachValues,
  NOTIFICATION,
  useNotifications,
  siteAddressSchema,
  initialSiteAddressValues,
} from '@ecdlink/core';
import {
  CoachInput,
  CreateSiteAddress,
  UpdateCoach,
  SiteAddressInput,
  UpdateSiteAddress,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CoachForm from '../../../components/coach-form/coach-form';
import SiteAddressForm from '../../../components/site-address-form/site-address-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';

export interface CoachPanelProps {
  coach: CoachDto;
  closeDialog: (value: boolean) => void;
}

export default function CoachPanelEdit({
  coach,
  closeDialog,
}: CoachPanelProps) {
  const { setNotification } = useNotifications();

  const emitCloseDialog = (value: boolean) => {
    closeDialog(value);
  };

  const [createSiteAddress] = useMutation(CreateSiteAddress);
  const [updateCoach] = useMutation(UpdateCoach);
  const [updateSiteAddress] = useMutation(UpdateSiteAddress);

  const {
    register: coachRegister,
    setValue: coachSetValue,
    formState: coachFormState,
    getValues: coachGetValues,
  } = useForm({
    resolver: yupResolver(coachSchema),
    defaultValues: { ...initialCoachValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { errors: coachFormErrors, isValid: isCoachValid } = coachFormState;

  // SITE ADDRESS FORMS
  const {
    register: siteAddressRegister,
    setValue: siteAddressSetValue,
    getValues: siteAddressGetValues,
  } = useForm({
    resolver: yupResolver(siteAddressSchema),
    defaultValues: { ...initialSiteAddressValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { errors: siteAddressFormErrors } = coachFormState;

  useEffect(() => {
    if (coach) {
      coachSetValue('areaOfOperation', coach.areaOfOperation ?? '', {
        shouldValidate: true,
      });
      coachSetValue(
        'secondaryAreaOfOperation',
        coach.secondaryAreaOfOperation ?? '',
        {
          shouldValidate: true,
        }
      );
      coachSetValue(
        'startDate',
        coach.startDate ? new Date(coach.startDate) : undefined,
        {
          shouldValidate: true,
        }
      );

      if (coach.siteAddress) {
        siteAddressSetValue('name', coach.siteAddress.name, {
          shouldValidate: true,
        });
        siteAddressSetValue('addressLine1', coach.siteAddress.addressLine1, {
          shouldValidate: true,
        });
        siteAddressSetValue('addressLine2', coach.siteAddress.addressLine2, {
          shouldValidate: true,
        });
        siteAddressSetValue('addressLine3', coach.siteAddress.addressLine3, {
          shouldValidate: true,
        });
        siteAddressSetValue('ward', coach.siteAddress.ward, {
          shouldValidate: true,
        });
        siteAddressSetValue('provinceId', coach.siteAddress.province.id, {
          shouldValidate: true,
        });
        siteAddressSetValue('postalCode', coach.siteAddress.postalCode, {
          shouldValidate: true,
        });
      }
    }
  }, [coach]);

  const onSave = async () => {
    if (isCoachValid) {
      const siteAddressId = await saveSiteAddress();
      await saveCoach(siteAddressId);
      emitCloseDialog(true);
    }
  };

  const saveCoach = async (siteAddressId?: string) => {
    const coachForm = coachGetValues();

    const coachInputModel: CoachInput = {
      Id: coach.id,
      UserId: coach.userId,
      SiteAddressId: siteAddressId,
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

  const saveSiteAddress = async (): Promise<string> => {
    const form = siteAddressGetValues();
    const siteAddressInputModel: SiteAddressInput = {
      Id: coach.siteAddressId,
      Name: form.name,
      AddressLine1: form.addressLine1,
      AddressLine2: form.addressLine2,
      AddressLine3: form.addressLine3,
      PostalCode: form.postalCode,
      ProvinceId: form.provinceId ?? null,
      Ward: form.ward,
      IsActive: true,
    };

    let siteAddressId = '';
    if (coach.siteAddressId) {
      await updateSiteAddress({
        variables: {
          id: coach.siteAddressId,
          input: { ...siteAddressInputModel },
        },
      });
      siteAddressId = coach.siteAddressId;
    } else {
      const returnSiteAddress = await createSiteAddress({
        variables: {
          input: { ...siteAddressInputModel },
        },
      });
      siteAddressId = returnSiteAddress?.data?.createSiteAddress?.id ?? '';
    }

    setNotification({
      title: 'Successfully Updated Coach Address!',
      variant: NOTIFICATION.SUCCESS,
    });

    return siteAddressId;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Coach Detail
            </h3>
          </div>
          <CoachForm
            formKey={`editcoach-${new Date().getTime()}-${coach.id}`}
            register={coachRegister}
            errors={coachFormErrors}
          />
        </div>

        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Address Detail
            </h3>
          </div>
          <SiteAddressForm
            formKey={`createSiteAddress-${new Date().getTime()}`}
            register={siteAddressRegister}
            errors={siteAddressFormErrors}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <article>
        <UserPanelSave
          user={coach.user}
          disabled={!isCoachValid}
          onSave={onSave}
        />

        <div className="mx-auto mt-6 max-w-5xl sm:px-6 lg:px-8">
          {getComponent()}
        </div>
      </article>
    </div>
  );
}
