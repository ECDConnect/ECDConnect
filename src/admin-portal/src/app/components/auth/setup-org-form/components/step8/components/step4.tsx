import { Typography } from '@ecdlink/ui';
import { UseFormGetValues, UseFormRegister } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';
import FormColorField from '../../../../../form-color-field/form-color-field';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
  register: UseFormRegister<any>;
}

export const Step4: React.FC<StepProps> = ({ getValues, register }) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 4`} />
      <div>
        <Typography
          type="help"
          color="textDark"
          text={`App colours`}
          weight="bold"
        />
        <div className="mt-2 flex gap-4">
          <div className="w-2/12">
            <Typography type="help" color="textMid" text={`Primary`} />
            <FormColorField
              setValue={() => {}}
              currentColor={getValues()?.primaryColor ?? ''}
              label={''}
              nameProp={'primaryColor'}
              register={register}
              error={''}
              isAdminPortalField={true}
              disabled={true}
            />
          </div>
          <div className="w-2/12">
            <Typography type="help" color="textMid" text={`Secondary`} />
            <FormColorField
              setValue={() => {}}
              currentColor={getValues()?.secondaryColor ?? ''}
              label={''}
              nameProp={'secondaryColor'}
              register={register}
              error={''}
              isAdminPortalField={true}
              disabled={true}
            />
          </div>
          <div className="w-2/12">
            <Typography type="help" color="textMid" text={`Tertiary`} />
            <FormColorField
              setValue={() => {}}
              currentColor={getValues()?.tertiaryColor ?? ''}
              label={''}
              nameProp={'tertiaryColor'}
              register={register}
              error={''}
              isAdminPortalField={true}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
