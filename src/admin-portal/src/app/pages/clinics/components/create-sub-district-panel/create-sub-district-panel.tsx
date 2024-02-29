import {
  Alert,
  Divider,
  Dropdown,
  FormInput,
  SearchDropDown,
  SearchDropDownOption,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import {
  ClinicModel,
  ClinicPanelCreateProps,
  subDistrictModel,
  subDistrictInitialValues,
  subDistrictSchema,
} from '../../clinics.types';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { SaveIcon, TrashIcon } from '@heroicons/react/solid';
import {
  AddSubDistrict,
  EditSubDistrict,
  GetDistrictsAndStats,
} from '@ecdlink/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { NOTIFICATION, useNotifications } from '@ecdlink/core';

export const CreateSubDistrictPanel = (props: ClinicPanelCreateProps) => {
  const { data: districtData, refetch } = useQuery(GetDistrictsAndStats, {
    fetchPolicy: 'cache-and-network',
  });
  const [addSubDistrictMutation, { loading: loadingAddSubDistrict }] =
    useMutation(AddSubDistrict);
  const [editSubDistrictMutation, { loading: loadingEditSubDistrict }] =
    useMutation(EditSubDistrict);

  const {
    register: subDistrictRegister,
    formState: subDistrictFormState,
    getValues: subDistrictGetValues,
    setValue: subDistrictSetValue,
    control,
  } = useForm({
    resolver: yupResolver(subDistrictSchema),
    defaultValues: subDistrictInitialValues,
    mode: 'onBlur',
  });

  const { errors, isValid: isDistrictValid, isDirty } = subDistrictFormState;
  console.log({ isDistrictValid });
  const [districts, setDistricts] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const { setNotification } = useNotifications();
  const watchFields = useWatch({ control });
  const disableButton = !watchFields?.subDistrictName || !watchFields?.district;
  console.log({ watchFields });
  console.log({ disableButton });

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

  const handleSaveData = useCallback(() => {
    if (props?.isEdit) {
      editDistrict();
      props.closeDialog(true);
    } else {
      addDistrict();
      props.closeDialog(true);
    }
  }, [addDistrict, editDistrict, props]);
  console.log({ districtData });
  useEffect(() => {
    if (districtData?.districtsAndStats?.length > 0) {
      console.log('haaaaa');
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

  console.log({ props });

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
      {props?.isEdit && (
        <div className="flex">
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.subDistrict?.totalClinics} clinics`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.subDistrict?.totalTeamLeads} Team Leads`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
          />
          <StatusChip
            backgroundColour="successMain"
            borderColour="successMain"
            text={`${props?.subDistrict?.totalHCWs} CHWs`}
            textColour={'white'}
            className={'mr-2 px-3 py-1.5'}
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
        <FormInput<subDistrictModel>
          register={subDistrictRegister}
          error={errors?.subDistrictName}
          nameProp={'subDistrictName'}
          placeholder="Sub-district name"
          label="Sub-district name *"
          type={'text'}
          maxCharacters={50}
          maxLength={50}
          isAdminPortalField={true}
          // disabled={isView}
          // value={messageTitle}
          onChange={(event) => {
            subDistrictSetValue('subDistrictName', event.target.value);
          }}
        />
        <Dropdown
          placeholder={'Click to select district'}
          className={'justify-between'}
          label={'District *'}
          // disabled={loading}
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
      <div className="mt-2 flex flex-row">
        <button
          type="submit"
          onClick={handleSaveData}
          className={`bg-white ${
            disableButton ? 'opacity-25' : ''
          } focus:outline-none border-secondary text-secondary flex inline-flex w-full items-center justify-center rounded-2xl border px-14 py-2.5 text-sm font-medium shadow-sm focus:ring-2 focus:ring-offset-2`}
          disabled={disableButton}
        >
          <TrashIcon width="22px" className="mr-2" />
          Remove district
        </button>
      </div>
    </div>
  );
};
