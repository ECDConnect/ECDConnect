import { useMutation } from '@apollo/client';
import {
  initialPractitionerValues,
  initialSiteAddressValues,
  NOTIFICATION,
  PractitionerDto,
  practitionerSchema,
  siteAddressSchema,
  useNotifications,
} from '@ecdlink/core';
import {
  CreateSiteAddress,
  PractitionerInput,
  SiteAddressInput,
  UpdatePractitioner,
  UpdateSiteAddress,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PractitionerForm from '../../../../components/practitioner-form/practitioner-form';
import SiteAddressForm from '../../../../components/site-address-form/site-address-form';
import UserPanelSave from '../../../../components/user-panel-save/user-panel-save';

export interface PractitionerPanelProps {
  practitioner: PractitionerDto;
  closeDialog: (value: boolean) => void;
}

export default function PractitionerPanelEdit({
  practitioner,
  closeDialog,
}: PractitionerPanelProps) {
  const { setNotification } = useNotifications();

  const emitCloseDialog = (value: boolean) => {
    closeDialog(value);
  };

  const [createSiteAddress] = useMutation(CreateSiteAddress);
  const [updatePractitioner] = useMutation(UpdatePractitioner);
  const [updateSiteAddress] = useMutation(UpdateSiteAddress);

  const {
    register: practitionerRegister,
    setValue: practitionerSetValue,
    formState: practitionerFormState,
    getValues: practitionerGetValues,
  } = useForm({
    resolver: yupResolver(practitionerSchema),
    defaultValues: { ...initialPractitionerValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { errors: practitionerFormErrors, isValid: isPractitionerValid } =
    practitionerFormState;

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
  const { errors: siteAddressFormErrors } = practitionerFormState;

  useEffect(() => {
    if (practitioner) {
      practitionerSetValue(
        'attendanceRegisterLink',
        practitioner.attendanceRegisterLink ?? '',
        {
          shouldValidate: true,
        }
      );
      practitionerSetValue(
        'consentForPhoto',
        practitioner.consentForPhoto ?? false,
        {
          shouldValidate: true,
        }
      );
      practitionerSetValue('parentFees', practitioner.parentFees ?? 0, {
        shouldValidate: true,
      });
      practitionerSetValue(
        'languageUsedInGroups',
        practitioner.languageUsedInGroups ?? '',
        {
          shouldValidate: true,
        }
      );
      practitionerSetValue(
        'startDate',
        practitioner.startDate ? new Date(practitioner.startDate) : undefined,
        {
          shouldValidate: true,
        }
      );

      if (practitioner.siteAddress) {
        siteAddressSetValue('name', practitioner.siteAddress.name, {
          shouldValidate: true,
        });
        siteAddressSetValue(
          'addressLine1',
          practitioner.siteAddress.addressLine1,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue(
          'addressLine2',
          practitioner.siteAddress.addressLine2,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue(
          'addressLine3',
          practitioner.siteAddress.addressLine3,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue('ward', practitioner.siteAddress.ward, {
          shouldValidate: true,
        });
        siteAddressSetValue(
          'provinceId',
          practitioner.siteAddress.province.id,
          {
            shouldValidate: true,
          }
        );
        siteAddressSetValue('postalCode', practitioner.siteAddress.postalCode, {
          shouldValidate: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practitioner]);

  const onSave = async () => {
    if (isPractitionerValid) {
      const siteAddressId = await saveSiteAddress();
      await savePractitioner(siteAddressId);
      emitCloseDialog(true);
    }
  };

  const savePractitioner = async (siteAddressId?: string) => {
    const practitionerForm = practitionerGetValues();

    const practInputModel: PractitionerInput = {
      Id: practitioner.id,
      UserId: practitioner.userId,
      SiteAddressId: siteAddressId,
      AttendanceRegisterLink: practitionerForm.attendanceRegisterLink,
      ConsentForPhoto: practitionerForm.consentForPhoto,
      ParentFees: practitionerForm.parentFees && +practitionerForm.parentFees,
      LanguageUsedInGroups: practitionerForm.languageUsedInGroups,
      StartDate: practitionerForm.startDate,
      IsActive: true,
      Progress: 0,
      ProgressWalkthroughComplete: false,
    };

    await updatePractitioner({
      variables: {
        id: practitioner.id,
        input: { ...practInputModel },
      },
    });

    setNotification({
      title: 'Successfully Updated Practitioner!',
      variant: NOTIFICATION.SUCCESS,
    });
  };

  const saveSiteAddress = async (): Promise<string> => {
    const form = siteAddressGetValues();
    const siteAddressInputModel: SiteAddressInput = {
      Id: practitioner.siteAddressId,
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
    if (practitioner.siteAddressId) {
      await updateSiteAddress({
        variables: {
          id: practitioner.siteAddressId,
          input: { ...siteAddressInputModel },
        },
      });
      siteAddressId = practitioner.siteAddressId;
    } else {
      const returnSiteAddress = await createSiteAddress({
        variables: {
          input: { ...siteAddressInputModel },
        },
      });
      siteAddressId = returnSiteAddress?.data?.createSiteAddress?.id ?? '';
    }

    setNotification({
      title: 'Successfully Updated Practitioner Address!',
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
              Practitioner Detail
            </h3>
          </div>
          <PractitionerForm
            formKey={`editpractitioner-${new Date().getTime()}-${
              practitioner.id
            }`}
            register={practitionerRegister}
            errors={practitionerFormErrors}
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
          user={practitioner.user}
          disabled={!isPractitionerValid}
          onSave={onSave}
        />

        <div className="mx-auto mt-6 max-w-5xl sm:px-6 lg:px-8">
          {getComponent()}
        </div>
      </article>
    </div>
  );
}
