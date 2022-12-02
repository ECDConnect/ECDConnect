import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';

export interface ClinicFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const ClinicForm: React.FC<ClinicFormProps> = ({
  formKey,
  errors,
  register,
}) => {
  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <FormField
              label={'Clinic name *'}
              nameProp={'name'}
              register={register}
              error={errors.name?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Clinic Phone Number *'}
              nameProp={'phoneNumber'}
              register={register}
              error={errors.phoneNumber?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ClinicForm;
