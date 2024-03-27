import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { ClinicDto } from '@ecdlink/core';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { UseFormRegister } from 'react-hook-form';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';
import { Typography } from '@ecdlink/ui';

export interface HealthCareWorkerFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
  clinicId: string;
}

const HealthCareWorkerForm: React.FC<HealthCareWorkerFormProps> = ({
  formKey,
  errors,
  register,
  clinicId,
}) => {
  const { data: clinicsData } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 ">
          <div className="flex flex-row sm:col-span-3">
            <div className="w-full pr-4 sm:col-span-3">
              <Typography text={'Clinic *'} type={'body'} color={'textMid'} />
              <FormSelectorField
                label=""
                nameProp={'clinicId'}
                register={register}
                options={
                  clinicsData &&
                  clinicsData.allPortalClinics &&
                  clinicsData.allPortalClinics.map((x: ClinicDto) => {
                    return {
                      key: x.id,
                      value: x.name,
                    };
                  })
                }
                error={!clinicId && errors?.clinicId?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default HealthCareWorkerForm;
