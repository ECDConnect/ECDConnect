import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
export interface FranchisorFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const FranchisorForm: React.FC<FranchisorFormProps> = ({
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
              label={'Area Of Operation'}
              nameProp={'areaOfOperation'}
              register={register}
              error={errors.areaOfOperation?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Secondary Area Of Operation'}
              nameProp={'secondaryAreaOfOperation'}
              register={register}
              error={errors.secondaryAreaOfOperation?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Start Date'}
              nameProp={'startDate'}
              type="date"
              register={register}
              error={errors.startDate?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FranchisorForm;
