import { useQuery } from '@apollo/client';
import { ProvinceDto } from '@ecdlink/core';
import { GetAllProvince } from '@ecdlink/graphql';
import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';

export interface SiteAddressFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const SiteAddressForm: React.FC<SiteAddressFormProps> = ({
  formKey,
  errors,
  register,
}) => {
  const { data } = useQuery(GetAllProvince, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <FormField
              label={'Ward'}
              nameProp={'ward'}
              register={register}
              error={errors.ward?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Flat / unit / apartment number'}
              nameProp={'name'}
              register={register}
              error={errors.name?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Street address'}
              nameProp={'addressLine1'}
              register={register}
              error={errors.addressLine1?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Suburb/area'}
              nameProp={'addressLine2'}
              register={register}
              error={errors.addressLine2?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'City'}
              nameProp={'addressLine3'}
              register={register}
              error={errors.addressLine3?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormSelectorField
              label="Province"
              nameProp={'provinceId'}
              register={register}
              options={
                data &&
                data.GetAllProvince &&
                data.GetAllProvince.map((x: ProvinceDto) => {
                  return { key: x.id, value: x.description };
                })
              }
              error={errors.provinceId?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Postal code'}
              nameProp={'postalCode'}
              register={register}
              error={errors.postalCode?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default SiteAddressForm;
