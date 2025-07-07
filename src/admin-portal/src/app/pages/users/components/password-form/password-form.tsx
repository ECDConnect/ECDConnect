import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';

/* eslint-disable-next-line */
export interface PasswordFormProps {
  formKey: string;
  isEdit: boolean;
  errors: any;
  register: UseFormRegister<any>;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  formKey,
  isEdit = false,
  errors,
  register,
}) => {
  return (
    <form key={formKey}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <FormField
              label={isEdit ? 'Reset Password' : ''}
              nameProp={'password'}
              register={register}
              type={'password'}
              error={errors.password?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PasswordForm;
