import {
  ActionModal,
  Alert,
  Dialog,
  DialogPosition,
  Divider,
  Dropdown,
  FormInput,
  SearchDropDownOption,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import {
  ClinicModel,
  ClinicPanelCreateProps,
  clinicInitialValues,
  clinicSchema,
} from '../../clinics.types';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { SaveIcon, TrashIcon, XIcon } from '@heroicons/react/solid';
import {
  CreateClinic,
  DeleteClinic,
  EditClinic,
  GetAllClinic,
  GetAllTeamLead,
  GetSubDistrictsAndStats,
} from '@ecdlink/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { useHistory } from 'react-router';
import { findObjectWithString } from '../../../../utils/string-utils/string-utils';

export const CreateClinicPanel = (props: ClinicPanelCreateProps) => {
  const { data: subDistrictData } = useQuery(GetSubDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: teamLeadtData } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: clinicsData, refetch } = useQuery(GetAllClinic, {
    fetchPolicy: 'cache-and-network',
  });

  const [addClinictMutation] = useMutation(CreateClinic);
  const [editClinictMutation] = useMutation(EditClinic);
  const [deleteClinicMutation] = useMutation(DeleteClinic);

  const {
    register: clinicRegister,
    formState: clinicFormState,
    setValue: clinicSetValue,
    control,
  } = useForm({
    resolver: yupResolver(clinicSchema),
    defaultValues: clinicInitialValues,
    mode: 'onBlur',
  });

  const { errors, isDirty } = clinicFormState;
  const { setNotification } = useNotifications();
  const history = useHistory();

  const watchFields = useWatch({ control });
  const [duplicateNameMessage, setDuplicatedNameMessage] = useState('');

  const duplicatedName =
    findObjectWithString(
      clinicsData?.GetAllClinic,
      'name',
      watchFields?.name
    ) && watchFields?.name !== props?.clinic?.name;

  useEffect(() => {
    if (duplicatedName) {
      setDuplicatedNameMessage(
        `There is a different clinic with the same name. Please choose a different clinic name.`
      );
    }
  }, [duplicatedName]);

  const disableButton =
    !watchFields?.name ||
    !watchFields?.address ||
    !watchFields?.phoneNumber ||
    !watchFields?.subDistrict ||
    !watchFields?.teamLeadOne;

  const [subDistricts, setSubDistricts] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [teamLeads, setTeamLeads] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const [optionalTeamLeads, setOptionalTeamLeads] = useState<
    SearchDropDownOption<string>[]
  >([]);
  const [handleDeleteModal, setHandleDeleteModal] = useState(false);

  const [formIsDirty, setFormIsDirty] = useState(false);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      setFormIsDirty(true);
    } else {
      setFormIsDirty(false);
    }
  }, [isDirty]);

  useEffect(() => {
    if (props?.isEdit) {
      clinicSetValue('name', props?.clinic?.name);
      clinicSetValue('phoneNumber', props?.clinic?.phoneNumber);
      clinicSetValue('address', props?.clinic?.siteAddress?.addressLine1);
      clinicSetValue('subDistrict', props?.clinic?.subDistrict?.id);
      clinicSetValue(
        'teamLeadOne',
        String(props?.clinic?.teamLeads?.[0]?.teamLead?.id)
      );
      clinicSetValue(
        'teamLeadTwo',
        String(props?.clinic?.teamLeads?.[1]?.teamLead?.id)
      );
    }
  }, [
    clinicSetValue,
    props?.clinic?.name,
    props?.clinic?.phoneNumber,
    props?.clinic?.siteAddress,
    props?.clinic?.subDistrict?.id,
    props?.clinic?.teamLeads,
    props?.isEdit,
  ]);

  useEffect(() => {
    if (subDistrictData?.subDistrictsAndStats?.length > 0) {
      setSubDistricts(
        subDistrictData?.subDistrictsAndStats?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        })
      );
    }
  }, [subDistrictData]);

  useEffect(() => {
    if (teamLeadtData?.allTeamLeads?.length > 0) {
      setTeamLeads(
        teamLeadtData?.allTeamLeads?.map((item) => {
          return {
            value: item?.id,
            label: item?.user?.fullName,
          };
        })
      );
    }
  }, [teamLeadtData]);

  useEffect(() => {
    if (!watchFields?.teamLeadOne && teamLeadtData?.allTeamLeads?.length > 0) {
      const teamLeads = setOptionalTeamLeads(
        teamLeadtData?.allTeamLeads?.map((item) => {
          return {
            value: item?.id,
            label: item?.user?.fullName,
          };
        })
      );
    } else if (teamLeadtData?.allTeamLeads?.length > 0) {
      setOptionalTeamLeads(
        teamLeadtData?.allTeamLeads
          ?.filter((teamLead) => teamLead?.id !== watchFields?.teamLeadOne)
          ?.map((item) => {
            return {
              value: item?.id,
              label: item?.user?.fullName,
            };
          })
      );
    }
  }, [teamLeadtData, watchFields?.teamLeadOne]);

  const addClinic = useCallback(async () => {
    const clinicInputModel = {
      name: watchFields?.name,
      phoneNumber: watchFields?.phoneNumber,
      subDistrictId: watchFields?.subDistrict,
      siteAddressId: watchFields?.address,
      teamLead1Id: watchFields?.teamLeadOne,
      teamLead2Id: watchFields?.teamLeadTwo,
    };
    const response = await addClinictMutation({
      variables: {
        input: { ...clinicInputModel },
      },
    });

    if (response) {
      setNotification({
        title: ` Clinic added!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }
  }, [
    addClinictMutation,
    setNotification,
    watchFields?.address,
    watchFields?.name,
    watchFields?.phoneNumber,
    watchFields?.subDistrict,
    watchFields?.teamLeadOne,
    watchFields?.teamLeadTwo,
  ]);

  const editClinic = useCallback(async () => {
    const districtInputModel = {
      id: props?.clinic?.id,
      name: watchFields?.name,
      phoneNumber: watchFields?.phoneNumber,
      subDistrictId: watchFields?.subDistrict,
      siteAddressId: props?.clinic?.siteAddressId,
      teamLead1Id: watchFields?.teamLeadOne,
      teamLead2Id:
        watchFields?.teamLeadTwo !== '1' ? watchFields?.teamLeadTwo : '',
    };
    const response = await editClinictMutation({
      variables: {
        input: { ...districtInputModel },
      },
    });

    if (response) {
      setNotification({
        title: ` Clinic updated!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }

    history.push({
      pathname: '/clinics/clinics',
    });
  }, [
    editClinictMutation,
    history,
    props?.clinic?.id,
    props?.clinic?.siteAddressId,
    setNotification,
    watchFields?.name,
    watchFields?.phoneNumber,
    watchFields?.subDistrict,
    watchFields?.teamLeadOne,
    watchFields?.teamLeadTwo,
  ]);

  const deleteDistrict = useCallback(async () => {
    const response = await deleteClinicMutation({
      variables: { clinicId: props?.clinic?.id },
    });

    props.closeDialog(true);

    if (response) {
      setNotification({
        title: ` Clinic deleted!`,
        variant: NOTIFICATION.ALERT,
      });
    }
  }, [deleteClinicMutation, props, setNotification]);

  const handleSaveData = useCallback(() => {
    if (props?.isEdit) {
      editClinic();
      props.closeDialog(true);
    } else {
      addClinic();
      props.closeDialog(true);
    }
  }, [addClinic, editClinic, props]);

  return (
    <div className="h-screen">
      {formIsDirty && (
        <div className="focus:outline-none focus:ring-primary absolute right-5 -top-20 z-10 mt-6 flex h-7 items-center rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2">
          <button
            className="focus:outline-none focus:ring-primary rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2"
            onClick={() => setDisplayFormIsDirty(true)}
          >
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      )}
      {props?.isEdit && (
        <div className="flex">
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.clinic?.teamLeads?.length} Team Leads`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${0} CHWs`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
        </div>
      )}
      <Divider dividerType="dashed" className="py-8" />
      {props?.isEdit && (
        <>
          <Alert
            className={'my-4 rounded-xl'}
            title={
              'All updates made below will reflect on all linked clinics, Team Leads and CHWs.'
            }
            list={[
              'You can only delete this sub-district if there are no clinics linked. To delete this sub-district, first delete all clinics linked with this sub-district or select a different sub-district for each clinic.',
            ]}
            type={'warning'}
          />

          <Typography
            type={'h3'}
            text={watchFields?.name}
            color={'textDark'}
            className="my-4"
          />
        </>
      )}
      <div className="flex flex-col gap-4">
        <div>
          <FormInput<ClinicModel>
            register={clinicRegister}
            error={errors?.name || (duplicatedName as any)}
            value={watchFields?.name}
            nameProp={'name'}
            placeholder="Clinic name"
            label="Clinic name *"
            subLabel="The combination of clinic name & sub-district must be unique."
            type={'text'}
            maxCharacters={50}
            maxLength={50}
            isAdminPortalField={true}
            onChange={(event) => {
              clinicSetValue('name', event.target.value);
            }}
          />
          {duplicatedName && (
            <Typography
              text={duplicateNameMessage}
              type={'help'}
              color="errorMain"
            />
          )}
        </div>
        <Dropdown
          placeholder={'Click to select sub-district'}
          className={'justify-between'}
          label={'Sub-district *'}
          selectedValue={watchFields?.subDistrict}
          list={subDistricts}
          onChange={(item) => clinicSetValue('subDistrict', item)}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
        />
        <FormInput<ClinicModel>
          register={clinicRegister}
          error={errors?.phoneNumber}
          nameProp={'phoneNumber'}
          placeholder="Phone number"
          label="Phone number *"
          type={'text'}
          maxLength={50}
          isAdminPortalField={true}
          onChange={(event) => {
            clinicSetValue('phoneNumber', event.target.value);
          }}
        />
        <FormInput<ClinicModel>
          register={clinicRegister}
          error={errors?.name}
          nameProp={'address'}
          value={watchFields?.address}
          placeholder="Address"
          label="Address *"
          type={'text'}
          maxCharacters={50}
          maxLength={50}
          isAdminPortalField={true}
          textInputType="textarea"
          onChange={(event) => {
            clinicSetValue('address', event.target.value);
          }}
        />
        <Dropdown
          placeholder={'Click to select Team Lead'}
          className={'justify-between'}
          label={'Team Lead *'}
          list={teamLeads}
          onChange={(item) => clinicSetValue('teamLeadOne', item)}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
          selectedValue={watchFields?.teamLeadOne}
        />
        <Dropdown
          placeholder={'Click to select Team Lead'}
          className={'justify-between'}
          label={'Team Lead'}
          subLabel="Optional"
          selectedValue={watchFields?.teamLeadTwo}
          list={[
            {
              value: '1',
              label: 'None',
            },
            ...optionalTeamLeads,
          ]}
          onChange={(item) => clinicSetValue('teamLeadTwo', item)}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
        />
      </div>

      <div className="mt-4 flex flex-row">
        <button
          type="submit"
          className={`bg-secondary ${
            disableButton || duplicatedName ? 'opacity-25' : ''
          } focus:outline-none mt-3 flex inline-flex w-full items-center justify-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
          disabled={disableButton || duplicatedName}
          onClick={handleSaveData}
        >
          <SaveIcon width="22px" className="mr-2" />
          Save
        </button>
      </div>
      {props?.isEdit && (
        <div className="mt-2 flex flex-row pb-8">
          <button
            type="submit"
            onClick={() => setHandleDeleteModal(true)}
            className={`focus:outline-none border-secondary text-secondary flex inline-flex w-full items-center justify-center rounded-2xl border bg-white px-14 py-2.5 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2`}
          >
            <TrashIcon width="22px" className="mr-2" />
            Remove clinic
          </button>
        </div>
      )}
      <Dialog
        className="right-50 absolute w-6/12"
        stretch
        visible={handleDeleteModal}
        position={DialogPosition.Middle}
      >
        <ActionModal
          className="z-80"
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to remove this clinic?`}
          actionButtons={[
            {
              text: 'Remove clinic',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => {
                // submit();
                deleteDistrict();
              },
              leadingIcon: 'PencilIcon',
            },
            {
              text: 'Keep editing',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () => setHandleDeleteModal(false),
              leadingIcon: 'TrashIcon',
            },
          ]}
        />
      </Dialog>
      <Dialog
        className="right-50 absolute w-6/12"
        stretch
        visible={displayFormIsDirty}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Discard unsaved changes?`}
          detailText={'If you leave now, you will lose all of your changes.'}
          buttonClass="rounded-2xl"
          actionButtons={[
            {
              text: 'Keep editing',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => setDisplayFormIsDirty(false),
              leadingIcon: 'XIcon',
            },
            {
              text: 'Discard changes',
              textColour: 'white',
              colour: 'secondary',
              type: 'filled',
              onClick: () => {
                props.closeDialog(true);
              },
              leadingIcon: 'TrashIcon',
            },
          ]}
        />
      </Dialog>
    </div>
  );
};
