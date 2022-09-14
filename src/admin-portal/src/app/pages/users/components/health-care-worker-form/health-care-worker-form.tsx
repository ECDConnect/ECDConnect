import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { LanguageDto } from '@ecdlink/core';
import { GetAllLanguage } from '@ecdlink/graphql';
import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';

export interface HealthCareWorkerFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const HealthCareWorkerForm: React.FC<HealthCareWorkerFormProps> = ({
  formKey,
  errors,
  register,
}) => {
  const { data } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <FormSelectorField
              label="Language"
              nameProp={'languageId'}
              register={register}
              options={
                data &&
                data.GetAllLanguage &&
                data.GetAllLanguage.map((x: LanguageDto) => {
                  return { key: x.id, value: x.description };
                })
              }
              error={errors.provinceId?.message}
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

export default HealthCareWorkerForm;
