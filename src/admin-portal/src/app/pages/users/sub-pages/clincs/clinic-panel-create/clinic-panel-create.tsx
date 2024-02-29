import { useMutation } from '@apollo/client';
import {
  initialClinicValues,
  initialSiteAddressValues,
  NOTIFICATION,
  siteAddressSchema,
  useNotifications,
} from '@ecdlink/core';
import {
  PortalClinicModelInput,
  CreateClinic,
  CreateSiteAddress,
  SiteAddressInput,
} from '@ecdlink/graphql';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import ClinicForm from '../../../components/clinic-form/clinic-form';
import SiteAddressForm from '../../../components/site-address-form/site-address-form';
import UserPanelSave from '../../../components/user-panel-save/user-panel-save';
import { UserPanelCreateProps } from '../../../components/users';

export default function ClinicPanelCreate(props: UserPanelCreateProps) {
  const { setNotification } = useNotifications();
  const emitCloseDialog = (value: boolean) => {
    props.closeDialog(value);
  };

  const [createClinic] = useMutation(CreateClinic);
  const [createSiteAddress] = useMutation(CreateSiteAddress);

  // FORMS
  // CLINIC FORMS
  const {
    register: clinicRegister,
    formState: clinicFormState,
    getValues: clinicGetValues,
  } = useForm({
    defaultValues: { ...initialClinicValues, sendInvite: false },
    mode: 'onBlur',
  });
  const { errors: clinicFormErrors, isValid: isClinicValid } = clinicFormState;

  // SITE ADDRESS FORMS
  const { register: siteAddressRegister, getValues: siteAddressGetValues } =
    useForm({
      resolver: yupResolver(siteAddressSchema),
      defaultValues: { ...initialSiteAddressValues, sendInvite: false },
      mode: 'onBlur',
    });
  const { errors: siteAddressFormErrors } = clinicFormState;

  const onSave = async () => {
    await saveSiteAddress();
    emitCloseDialog(true);
  };

  const saveSiteAddress = async () => {
    const form = siteAddressGetValues();
    const siteAddressInputModel: SiteAddressInput = {
      Id: undefined,
      Name: form.name ?? '',
      AddressLine1: form.addressLine1 ?? '',
      AddressLine2: form.addressLine2 ?? '',
      AddressLine3: form.addressLine3 ?? '',
      PostalCode: form.postalCode ?? '',
      ProvinceId: form.provinceId ?? '',
      Ward: form.ward ?? '',
      IsActive: true,
    };

    let siteAddressId = null;

    if (form.provinceId) {
      const returnSiteAddress = await createSiteAddress({
        variables: {
          input: { ...siteAddressInputModel },
        },
      });

      if (returnSiteAddress && returnSiteAddress.data) {
        setNotification({
          title: 'Successfully Created Address!',
          variant: NOTIFICATION.SUCCESS,
        });

        siteAddressId = returnSiteAddress?.data?.createSiteAddress?.id ?? '';
      }
    }

    await saveClinic(siteAddressId);
  };

  const saveClinic = async (siteAddressId?: string) => {
    const clinicForm = clinicGetValues();
    const clinicModel: PortalClinicModelInput = {
      name: clinicForm.name,
      phoneNumber: clinicForm.phoneNumber,
      siteAddressId: siteAddressId,
      subDistrictId: '',
      teamLead1Id: '',
      teamLead2Id: null,
    };

    await createClinic({
      variables: {
        input: { ...clinicModel },
      },
    });

    setNotification({
      title: 'Successfully Created Clinic!',
      variant: NOTIFICATION.SUCCESS,
    });
  };

  const getIsValid = () => {
    console.log(clinicFormErrors);
    let isValid = isClinicValid;
    return isValid ? true : false;
  };

  const getComponent = () => {
    return (
      <>
        <div className="bg-uiBg mt-5 rounded-lg border-b border-gray-200 px-4 py-5">
          <div className="pb-2">
            <h3 className="text-uiMidDark text-lg font-medium leading-6">
              Clinic Detail
            </h3>
          </div>

          <ClinicForm
            formKey={`createclinic-${new Date().getTime()}`}
            register={clinicRegister}
            errors={clinicFormErrors}
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
    <article>
      <UserPanelSave disabled={!getIsValid()} onSave={onSave} />
      <div className="mx-auto mt-5 max-w-5xl">{getComponent()}</div>
    </article>
  );
}
