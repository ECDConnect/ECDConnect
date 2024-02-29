import {
  Divider,
  Dropdown,
  FormInput,
  SearchDropDown,
  SearchDropDownOption,
  Typography,
} from '@ecdlink/ui';
import {
  ClinicModel,
  ClinicPanelCreateProps,
  DistrictModel,
  districtInitialValues,
  districtSchema,
} from '../../clinics.types';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { SaveIcon } from '@heroicons/react/solid';
import { AddDistrict, EditDistrict, GetAllProvince } from '@ecdlink/graphql';
import { useMutation, useQuery } from '@apollo/client';

export const CreateDistrictPanel = (props: ClinicPanelCreateProps) => {
  const { data: provinceData, refetch } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });
  const [addDistrictMutation, { loading: loadingAddDistrict }] =
    useMutation(AddDistrict);
  const [editDistrictMutation, { loading: loadingEditDistrict }] =
    useMutation(EditDistrict);

  const {
    register: districtRegister,
    formState: districtFormState,
    getValues: districtGetValues,
    setValue: districtSetValue,
    control,
  } = useForm({
    resolver: yupResolver(districtSchema),
    defaultValues: districtInitialValues,
    mode: 'onBlur',
  });

  const { errors, isValid: isDistrictValid, isDirty } = districtFormState;
  console.log({ isDistrictValid });
  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const watchFields = useWatch({ control });
  const disableButton = !watchFields?.districtName || !watchFields?.province;
  console.log({ watchFields });
  console.log({ disableButton });

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
  }, [addDistrictMutation, watchFields?.districtName, watchFields?.province]);

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
  }, [
    editDistrictMutation,
    props?.district?.id,
    watchFields?.districtName,
    watchFields?.province,
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

  console.log({ props });

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
      <Divider dividerType="dashed" className="py-8" />
      <div className="flex flex-col gap-4">
        <FormInput<DistrictModel>
          register={districtRegister}
          error={errors?.districtName}
          nameProp={'districtName'}
          placeholder="District name"
          label="District name *"
          subLabel="The combination of clinic name & sub-district must be unique."
          type={'text'}
          maxCharacters={50}
          maxLength={50}
          isAdminPortalField={true}
          // disabled={isView}
          // value={messageTitle}
          onChange={(event) => {
            districtSetValue('districtName', event.target.value);
          }}
        />
        <Dropdown
          placeholder={'Click to select sub-district'}
          className={'justify-between'}
          label={'Sub-district *'}
          // disabled={loading}
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
    </div>
  );
};
