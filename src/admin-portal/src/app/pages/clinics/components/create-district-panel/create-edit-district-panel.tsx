import {
  ActionModal,
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
  DistrictModel,
  districtInitialValues,
  districtSchema,
} from '../../clinics.types';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { SaveIcon, TrashIcon, XIcon } from '@heroicons/react/solid';
import {
  AddDistrict,
  DeleteDistrict,
  EditDistrict,
  GetAllProvince,
  GetDistrictsAndStats,
} from '@ecdlink/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';
import { findObjectWithString } from '../../../../utils/string-utils/string-utils';

export const CreateEditDistrictPanel = (props: ClinicPanelCreateProps) => {
  const { data: provinceData } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: districtData } = useQuery(GetDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });

  const [addDistrictMutation] = useMutation(AddDistrict);
  const [editDistrictMutation] = useMutation(EditDistrict);
  const [deleteDistrictMutation] = useMutation(DeleteDistrict);

  const {
    register: districtRegister,
    formState: districtFormState,
    setValue: districtSetValue,
    control,
  } = useForm({
    resolver: yupResolver(districtSchema),
    defaultValues: districtInitialValues,
    mode: 'onBlur',
  });

  const { errors, isDirty } = districtFormState;
  const watchFields = useWatch({ control });
  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const [formIsDirty, setFormIsDirty] = useState(false);
  const [displayFormIsDirty, setDisplayFormIsDirty] = useState(false);
  const [duplicateNameMessage, setDuplicatedNameMessage] = useState('');

  const duplicatedName = findObjectWithString(
    districtData?.districtsAndStats,
    'name',
    watchFields?.districtName,
    props?.isEdit
  );

  useEffect(() => {
    if (duplicatedName) {
      setDuplicatedNameMessage(
        `There is a different district the same name. Please choose a different district name.`
      );
    }
  }, [duplicatedName]);

  useEffect(() => {
    if (isDirty) {
      setFormIsDirty(true);
    } else {
      setFormIsDirty(false);
    }
  }, [isDirty]);

  const { setNotification } = useNotifications();
  const disableButton = !watchFields?.districtName || !watchFields?.province;
  const [handleDeleteModal, setHandleDeleteModal] = useState(false);

  const addDistrict = useCallback(async () => {
    const districtInputModel = {
      name: watchFields?.districtName,
      provinceId: watchFields?.province,
    };
    const response = await addDistrictMutation({
      variables: {
        input: { ...districtInputModel },
      },
    });

    if (response) {
      setNotification({
        title: `District added!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }
  }, [
    addDistrictMutation,
    setNotification,
    watchFields?.districtName,
    watchFields?.province,
  ]);

  const editDistrict = useCallback(async () => {
    const districtInputModel = {
      id: props?.district?.id,
      name: watchFields?.districtName,
      provinceId: watchFields?.province,
    };
    const response = await editDistrictMutation({
      variables: {
        input: { ...districtInputModel },
      },
    });

    if (response) {
      setNotification({
        title: `District updated!`,
        variant: NOTIFICATION.SUCCESS,
      });
    }
  }, [
    editDistrictMutation,
    props?.district?.id,
    setNotification,
    watchFields?.districtName,
    watchFields?.province,
  ]);

  const deleteDistrict = useCallback(async () => {
    const response = await deleteDistrictMutation({
      variables: { districtId: props?.district?.id },
    });

    props.closeDialog(true);

    if (response) {
      setNotification({
        title: ` District deleted!`,
        variant: NOTIFICATION.ALERT,
      });
    }
  }, [deleteDistrictMutation, props, setNotification]);

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
    if (provinceData?.GetAllProvince?.length > 0) {
      setProvinces(
        provinceData?.GetAllProvince?.map((item) => {
          return {
            value: item?.id,
            label: item?.description,
          };
        })
      );
    }
  }, [provinceData]);

  useEffect(() => {
    if (props?.isEdit) {
      districtSetValue('districtName', props?.district?.name);
      districtSetValue('province', props?.district?.province?.id);
    }
  }, [
    districtSetValue,
    props?.district?.name,
    props?.district?.province?.id,
    props?.isEdit,
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
            text={`${props?.district?.totalSubDistricts} sub-districts`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.district?.totalClinics} clinics`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.district?.totalTeamLeads} Team Leads`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.district?.totalHCWs} CHWs`}
            textColour={'white'}
            className={'mr-2 px-6 py-1.5'}
          />
        </div>
      )}
      <Divider dividerType="dashed" className="py-8" />
      <div className="flex flex-col gap-4">
        <div>
          <FormInput<DistrictModel>
            register={districtRegister}
            error={errors?.districtName || duplicatedName}
            nameProp={'districtName'}
            placeholder="District name"
            label="District name *"
            subLabel="The combination of clinic name & sub-district must be unique."
            type={'text'}
            maxCharacters={50}
            value={watchFields?.districtName}
            maxLength={50}
            isAdminPortalField={true}
            onChange={(event) => {
              districtSetValue('districtName', event.target.value);
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
          placeholder={'Click to select Province'}
          className={'justify-between'}
          label={'Province *'}
          selectedValue={watchFields?.province}
          list={provinces}
          onChange={(item) => districtSetValue('province', item)}
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
          Save & publish
        </button>
      </div>
      {props?.isEdit && props?.district?.subDistricts?.length === 0 && (
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
            Remove district
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
          importantText={`Are you sure you want to remove this district?`}
          actionButtons={[
            {
              text: 'Remove district',
              textColour: 'secondary',
              colour: 'secondary',
              type: 'outlined',
              onClick: () => {
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
