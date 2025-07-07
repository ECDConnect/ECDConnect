import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';

export interface PrincipalFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const PrincipalForm: React.FC<PrincipalFormProps> = ({
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
              label={'Attendance Register Link'}
              nameProp={'attendanceRegisterLink'}
              register={register}
              error={errors.attendanceRegisterLink?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Parent Fees'}
              nameProp={'parentFees'}
              type="number"
              register={register}
              error={errors.parentFees?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Language Used In Groups'}
              nameProp={'languageUsedInGroups'}
              register={register}
              error={errors.languageUsedInGroups?.message}
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
          <div className="sm:col-span-3">
            <FormField
              label={'Consent For Photo'}
              nameProp={'consentForPhoto'}
              type="checkbox"
              register={register}
              error={errors.consentForPhoto?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Send Invite'}
              nameProp={'sendInvite'}
              type="checkbox"
              register={register}
              error={errors.sendInvite?.message}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PrincipalForm;
