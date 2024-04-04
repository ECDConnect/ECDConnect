import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { ClinicDto } from '@ecdlink/core';
import { GetAllPortalClinics } from '@ecdlink/graphql';
import { UseFormRegister } from 'react-hook-form';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';

export interface TeamLeadFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const TeamLeadForm: React.FC<TeamLeadFormProps> = ({
  formKey,
  errors,
  register,
}) => {
  const { data } = useQuery(GetAllPortalClinics, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <form key={formKey} className="space-y-4 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <FormSelectorField
              label="Clinic"
              nameProp={'clinicId'}
              register={register}
              options={
                data &&
                data.allPortalClinics &&
                data.allPortalClinics.map((x: ClinicDto) => {
                  return { key: x.id, value: x.name };
                })
              }
              error={errors.clinicId?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default TeamLeadForm;
