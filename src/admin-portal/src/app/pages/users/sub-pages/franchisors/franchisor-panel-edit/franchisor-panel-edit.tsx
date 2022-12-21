import { useMutation } from '@apollo/client';
import {
  FranchisorDto,
  franchisorSchema,
  initialFranchisorValues,
  NOTIFICATION,
  useNotifications,
  siteAddressSchema,
  initialSiteAddressValues,
} from '@ecdlink/core';
import {
  FranchisorInput,
  CreateSiteAddress,
  UpdateFranchisor,
  SiteAddressInput,
  UpdateSiteAddress,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FranchisorForm from '../../../components/franchisor-form/franchisor-form';
import SiteAddressForm from '../../../components/site-address-form/site-address-form';
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

  const [createSiteAddress] = useMutation(CreateSiteAddress);
  const [updateFranchisor] = useMutation(UpdateFranchisor);
  const [updateSiteAddress] = useMutation(UpdateSiteAddress);

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

  // SITE ADDRESS FORMS
  const {
    register: siteAddressRegister,
    setValue: siteAddressSetValue,
    getValues: siteAddressGetValues,
  } = useForm({
    resolver: yupResolver(siteAddressSchema),
    defaultValues: { ...initialSiteAddressValues },
    mode: 'onBlur',
  });
  const { errors: siteAddressFormErrors } = franchisorFormState;

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

      if (franchisor.siteAddress) {
        siteAddressSetValue('name', franchisor.siteAddress.name, {
          shouldValidate: true,
        });
        siteAddressSetValue(
          'addressLine1',
          franchisor.siteAddress.addressLine1,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue(
          'addressLine2',
          franchisor.siteAddress.addressLine2,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue(
          'addressLine3',
          franchisor.siteAddress.addressLine3,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue('ward', franchisor.siteAddress.ward, {
          shouldValidate: true,
        });
        siteAddressSetValue('provinceId', franchisor.siteAddress.province.id, {
          shouldValidate: true,
        });
        siteAddressSetValue('postalCode', franchisor.siteAddress.postalCode, {
          shouldValidate: true,
        });
      }
    }
  }, [franchisor]);

  const onSave = async () => {
    if (isFranchisorValid) {
      const siteAddressId = await saveSiteAddress();
      await saveFranchisor(siteAddressId);
      emitCloseDialog(true);
    }
  };

  const saveFranchisor = async (siteAddressId?: string) => {
    const franchisorForm = franchisorGetValues();

    const franchisorInputModel: FranchisorInput = {
      Id: franchisor.id,
      UserId: franchisor.userId,
      SiteAddressId: siteAddressId,
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

  const saveSiteAddress = async (): Promise<string> => {
    const form = siteAddressGetValues();
    const siteAddressInputModel: SiteAddressInput = {
      Id: franchisor.siteAddressId,
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
    if (franchisor.siteAddressId && siteAddressInputModel.ProvinceId !== '') {
      await updateSiteAddress({
        variables: {
          id: franchisor.siteAddressId,
          input: { ...siteAddressInputModel },
        },
      });
      siteAddressId = franchisor.siteAddressId;
    } else {
      if (siteAddressInputModel.ProvinceId !== '') {
        const returnSiteAddress = await createSiteAddress({
          variables: {
            input: { ...siteAddressInputModel },
          },
        });
        siteAddressId = returnSiteAddress?.data?.createSiteAddress?.id ?? '';
      }
    }

    setNotification({
      title: 'Successfully Updated Franchisor Address!',
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
              Franchisor Detail
            </h3>
          </div>
          <FranchisorForm
            formKey={`editcoach-${new Date().getTime()}-${franchisor.id}`}
            register={franchisorRegister}
            errors={franchisorFormErrors}
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
          user={franchisor.user}
          disabled={!isFranchisorValid}
          onSave={onSave}
        />

        <div className="mx-auto mt-6 max-w-5xl sm:px-6 lg:px-8">
          {getComponent()}
        </div>
      </article>
    </div>
  );
}
