import { useQuery } from '@apollo/client/react/hooks/useQuery';
import { LanguageDto, TeamLeadDto } from '@ecdlink/core';
import { GetAllClinic, GetAllLanguage, GetAllTeamLead } from '@ecdlink/graphql';
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

  const { data: teamLeadData } = useQuery(GetAllTeamLead, {
    fetchPolicy: 'cache-and-network',
  });

  return (
    <form key={formKey} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 ">
          <div className="flex flex-row sm:col-span-3">
            <div className="w-6/12 pr-4 sm:col-span-3">
              <FormSelectorField
                label="Team Lead"
                nameProp={'teamLeadId'}
                register={register}
                options={
                  teamLeadData &&
                  teamLeadData.allTeamLeads &&
                  teamLeadData.allTeamLeads.map((x: TeamLeadDto) => {
                    return {
                      key: x.id,
                      value: x.user.fullName,
                    };
                  })
                }
                error={errors.teamLeadId?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default HealthCareWorkerForm;
