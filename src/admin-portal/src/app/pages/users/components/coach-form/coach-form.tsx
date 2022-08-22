import { useQuery } from '@apollo/client';
import { FranchisorDto } from '@ecdlink/core';
import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';
import { GetAllFranchisor } from '@ecdlink/graphql';
export interface CoachFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const CoachForm: React.FC<CoachFormProps> = ({ formKey, errors, register }) => {
  const { data } = useQuery(GetAllFranchisor, {
    fetchPolicy: 'cache-and-network',
  });
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
              type="number"
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
          <div className="sm:col-span-3">
            <FormSelectorField
              label="Franchisor *"
              nameProp={'franchisorId'}
              register={register}
              options={
                data &&
                data.GetAllFranchisor &&
                data.GetAllFranchisor.map((x: FranchisorDto) => {
                  return {
                    key: x.userId,
                    value: x.user.firstName + ' ' + x.user.surname,
                  };
                })
              }
              error={errors.programTypeId?.message}
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

export default CoachForm;
