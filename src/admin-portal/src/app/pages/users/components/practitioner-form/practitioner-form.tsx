import { useQuery } from '@apollo/client';
import { UseFormRegister } from 'react-hook-form';
import FormField from '../../../../components/form-field/form-field';
import FormSelectorField from '../../../../components/form-selector-field/form-selector-field';
import {
  GetAllCoach,
  GetAllHealthCareWorker,
  GetAllPractitioner,
} from '@ecdlink/graphql';
import { CoachDto, PractitionerDto } from '@ecdlink/core';
import { Dropdown } from '@ecdlink/ui';
import { useMemo } from 'react';

export interface PractitionerFormProps {
  formKey: string;
  errors: any;
  register: UseFormRegister<any>;
}

const PractitionerForm: React.FC<PractitionerFormProps> = ({
  formKey,
  errors,
  register,
}) => {
  const { data: coachData } = useQuery(GetAllCoach, {
    fetchPolicy: 'cache-and-network',
  });

  // const { data: principalData } = useQuery(GetAllPractitioner, {
  //   fetchPolicy: 'cache-and-network',
  // });

  return (
    <form key={formKey} className="w-full space-y-4">
      <div className="space-y-4">
        <div className="w-full">
          {/* <div className="sm:col-span-3">
            <FormField
              label={'Attendance Register Link'}
              nameProp={'attendanceRegisterLink'}
              register={register}
              error={errors.attendanceRegisterLink?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Max Children'}
              nameProp={'maxChildren'}
              type="number"
              register={register}
              error={errors.maxChildren?.message}
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
              label={'Month Since Start'}
              nameProp={'monthSinceFranchisee'}
              type="number"
              register={register}
              error={errors.monthSinceFranchisee?.message}
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
              label={'Principal'}
              nameProp={'isPrincipal'}
              type="checkbox"
              register={register}
              error={errors.isPrincipal?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Trainee'}
              nameProp={'isTrainee'}
              type="checkbox"
              register={register}
              error={errors.isTrainee?.message}
            />
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={'Is Funda App Admin'}
              nameProp={'isFundaAppAdmin'}
              type="checkbox"
              register={register}
              error={errors.isFundaAppAdmin?.message}
            />
          </div> */}
          <div className="w-full">
            <FormSelectorField
              label="Practitioner’s coach"
              subLabel="Optional. You will need to add the coach to the admin portal before you can connect them to a practitioner."
              nameProp={'coachHierarchy'}
              register={register}
              options={
                coachData &&
                coachData.GetAllCoach &&
                coachData.GetAllCoach.filter((v) => v.user !== null).map(
                  (x: CoachDto) => {
                    return {
                      key: x.userId,
                      value: x.user.firstName + ' ' + x.user.surname,
                    };
                  }
                )
              }
            />
          </div>
          {/* <div className="sm:col-span-3">
            <FormSelectorField
              label="Principal"
              nameProp={'principalHierarchy'}
              register={register}
              options={
                principalData &&
                principalData.GetAllPractitioner &&
                principalData.GetAllPractitioner.filter(
                  (v) => v.user !== null
                ).map((y: PractitionerDto) => {
                  return {
                    key: y.userId,
                    value: y.user.firstName + ' ' + y.user.surname,
                  };
                })
              }
              multiple
              disabled
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
          </div> */}
        </div>
      </div>
    </form>
  );
};

export default PractitionerForm;
