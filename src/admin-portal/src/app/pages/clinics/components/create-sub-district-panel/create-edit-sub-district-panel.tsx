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
  ClinicPanelCreateProps,
  subDistrictModel,
  subDistrictInitialValues,
  subDistrictSchema,
} from '../../clinics.types';
import { FieldError, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { SaveIcon, TrashIcon, XIcon } from '@heroicons/react/solid';
import {
  AddSubDistrict,
  DeleteSubDistrict,
  EditSubDistrict,
  GetDistrictsAndStats,
  GetSubDistrictsAndStats,
} from '@ecdlink/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { findObjectWithString } from '../../../../utils/string-utils/string-utils';

export const CreateEditSubDistrictPanel = (props: ClinicPanelCreateProps) => {
  const { data: districtData } = useQuery(GetDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: subDistrictData } = useQuery(GetSubDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const [addSubDistrictMutation] = useMutation(AddSubDistrict);
  const [editSubDistrictMutation] = useMutation(EditSubDistrict);
  const [deleteSubDistrictMutation] = useMutation(DeleteSubDistrict);

  const {
    register: subDistrictRegister,
    formState: subDistrictFormState,
    setValue: subDistrictSetValue,
    control,
  } = useForm({
    resolver: yupResolver(subDistrictSchema),
    defaultValues: subDistrictInitialValues,
    mode: 'onChange',
  });

  const { errors, isDirty } = subDistrictFormState;

  const [formIsDirty, setFormIsDirty] = useState(false);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      setFormIsDirty(true);
    } else {
      setFormIsDirty(false);
    }
  }, [isDirty]);

  const [districts, setDistricts] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const { setNotification } = useNotifications();
  const watchFields = useWatch({ control });
  const disableButton = !watchFields?.subDistrictName || !watchFields?.district;
  const [handleDeleteModal, setHandleDeleteModal] = useState(false);
  const [duplicateNameMessage, setDuplicatedNameMessage] = useState('');

  const duplicatedName = findObjectWithString(
    subDistrictData?.subDistrictsAndStats,
    'name',
    watchFields?.subDistrictName,
    props?.isEdit
  );

  useEffect(() => {
    if (duplicatedName) {
      setDuplicatedNameMessage(
        `There is a different sub-district within this district with the same name. Please choose a different sub-district name.`
      );
    }
  }, [duplicatedName]);

  const addDistrict = useCallback(async () => {
    const districtInputModel = {
      name: watchFields?.subDistrictName,
      districtId: watchFields?.district,
    };
    const response = await addSubDistrictMutation({
      variables: {
        input: { ...districtInputModel },
      },
    });

    if (response) {
      setNotification({
        title: ` Sub-district added!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }
  }, [
    watchFields?.subDistrictName,
    watchFields?.district,
    addSubDistrictMutation,
    setNotification,
  ]);

  const editDistrict = useCallback(async () => {
    const districtInputModel = {
      id: props?.subDistrict?.id,
      name: watchFields?.subDistrictName,
      districtId: watchFields?.district,
    };
    const response = await editSubDistrictMutation({
      variables: {
        input: { ...districtInputModel },
      },
    });

    if (response) {
      setNotification({
        title: ` Sub-district updated!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }
  }, [
    editSubDistrictMutation,
    props?.subDistrict?.id,
    setNotification,
    watchFields?.district,
    watchFields?.subDistrictName,
  ]);

  const deleteSubDistrict = useCallback(async () => {
    const response = await deleteSubDistrictMutation({
      variables: { subDistrictId: props?.subDistrict?.id },
    });

    props.closeDialog(true);

    if (response) {
      setNotification({
        title: ` Sub-district deleted!`,
        variant: NOTIFICATION.ALERT,
      });
    }
  }, [deleteSubDistrictMutation, props, setNotification]);

  const handleSaveData = useCallback(() => {
    if (props?.isEdit) {
      editDistrict();
      props.closeDialog(true);
    } else {
      addDistrict();
      props.closeDialog(true);
    }
  }, [addDistrict, editDistrict, props]);

  useEffect(() => {
    if (districtData?.districtsAndStats?.length > 0) {
      setDistricts(
        districtData?.districtsAndStats?.map((item) => {
          return {
            value: item?.id,
            label: item?.name,
          };
        })
      );
    }
  }, [districtData]);

  useEffect(() => {
    if (props?.isEdit) {
      subDistrictSetValue('subDistrictName', props?.subDistrict?.name);
      subDistrictSetValue('district', props?.subDistrict?.district?.id);
    }
  }, [
    props?.isEdit,
    props?.subDistrict?.district?.id,
    props?.subDistrict?.name,
    subDistrictSetValue,
  ]);

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
            text={`${props?.subDistrict?.totalClinics} clinics`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.subDistrict?.totalTeamLeads} Team Leads`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.subDistrict?.totalHCWs} CHWs`}
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
            text={watchFields?.subDistrictName}
            color={'textDark'}
            className="my-4"
          />
        </>
      )}
      <div className="flex flex-col gap-4">
        <div>
          <FormInput<subDistrictModel>
            register={subDistrictRegister}
            error={errors?.subDistrictName || duplicatedName}
            nameProp={'subDistrictName'}
            placeholder="Sub-district name"
            label="Sub-district name *"
            type={'text'}
            maxCharacters={50}
            maxLength={50}
            isAdminPortalField={true}
            value={watchFields?.subDistrictName}
            onChange={(event) => {
              subDistrictSetValue('subDistrictName', event.target.value);
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
          placeholder={'Click to select district'}
          className={'justify-between'}
          label={'District *'}
          selectedValue={watchFields?.district}
          list={districts}
          onChange={(item) => subDistrictSetValue('district', item)}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
        />
      </div>

      <div className="mt-4 flex flex-row">
        <button
          type="submit"
          onClick={handleSaveData}
          className={`bg-secondary ${
            disableButton ? 'opacity-25' : ''
          } focus:outline-none mt-3 flex inline-flex w-full items-center justify-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
          disabled={disableButton}
        >
          <SaveIcon width="22px" className="mr-2" />
          Save
        </button>
      </div>
      {props?.isEdit && props?.subDistrict?.totalClinics === 0 && (
        <div className="mt-2 flex flex-row">
          <button
            type="submit"
            onClick={() => setHandleDeleteModal(true)}
            className={`bg-white ${
              disableButton ? 'opacity-25' : ''
            } focus:outline-none border-secondary text-secondary flex inline-flex w-full items-center justify-center rounded-2xl border px-14 py-2.5 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2`}
            disabled={disableButton}
          >
            <TrashIcon width="22px" className="mr-2" />
            Remove sub-district
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
          importantText={`Are you sure you want to remove this sub-district?`}
          actionButtons={[
            {
              text: 'Remove sub-district',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => {
                // submit();
                deleteSubDistrict();
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
