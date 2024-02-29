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
  clinicInitialValues,
  clinicSchema,
} from '../../clinics.types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SaveIcon } from '@heroicons/react/solid';

export const CreateClinicPanel = (props: ClinicPanelCreateProps) => {
  const {
    register: clinicRegister,
    formState: clinicFormState,
    getValues: clinicGetValues,
    setValue: clinicSetValue,
  } = useForm({
    resolver: yupResolver(clinicSchema),
    defaultValues: clinicInitialValues,
    mode: 'onBlur',
  });

  const { errors, isValid: isClinicValid, isDirty } = clinicFormState;

  const [taskFilterOptions, setTaskFilterOptions] = useState<
    SearchDropDownOption<string>[]
  >([]);
  return (
    <div className="h-screen">
      <Divider dividerType="dashed" className="py-8" />
      <div className="flex flex-col gap-4">
        <FormInput<ClinicModel>
          register={clinicRegister}
          error={errors?.name}
          nameProp={'name'}
          placeholder="Clinic name"
          label="Clinic name *"
          subLabel="The combination of clinic name & sub-district must be unique."
          type={'text'}
          maxCharacters={50}
          maxLength={50}
          isAdminPortalField={true}
          // disabled={isView}
          // value={messageTitle}
          onChange={(event) => {
            clinicSetValue('name', event.target.value);
          }}
        />
        <Dropdown
          placeholder={'Click to select sub-district'}
          className={'justify-between'}
          label={'Sub-district *'}
          // disabled={loading}
          list={taskFilterOptions}
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
          maxCharacters={50}
          maxLength={50}
          isAdminPortalField={true}
          // disabled={isView}
          // value={messageTitle}
          onChange={(event) => {
            clinicSetValue('phoneNumber', event.target.value);
          }}
        />
        <FormInput<ClinicModel>
          register={clinicRegister}
          error={errors?.name}
          nameProp={'address'}
          placeholder="Address"
          label="Clinic name *"
          subLabel="The combination of clinic name & sub-district must be unique."
          type={'text'}
          maxCharacters={50}
          maxLength={50}
          isAdminPortalField={true}
          textInputType="textarea"
          // disabled={isView}
          // value={messageTitle}
          onChange={(event) => {
            clinicSetValue('address', event.target.value);
          }}
        />
        <Dropdown
          placeholder={'Click to select Team Lead'}
          className={'justify-between'}
          label={'Team Lead *'}
          // disabled={loading}
          list={taskFilterOptions}
          onChange={(item) => clinicSetValue('teamLeadOne', item)}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
        />
        <Dropdown
          placeholder={'Click to select Team Lead'}
          className={'justify-between'}
          label={'Team Lead'}
          subLabel="Optional"
          // disabled={loading}
          list={taskFilterOptions}
          onChange={(item) => clinicSetValue('teamLeadTwo', item)}
          fullWidth
          labelColor="textMid"
          fillColor="adminPortalBg"
        />
      </div>

      <div className="mt-4 flex flex-row">
        <button
          type="submit"
          className={`bg-secondary focus:outline-none mt-3 flex inline-flex w-full items-center justify-center rounded-2xl border border-transparent px-14 py-2.5 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2`}
          disabled={isClinicValid}
        >
          <SaveIcon width="22px" className="mr-2" />
          Save & publish
        </button>
      </div>
    </div>
  );
};
