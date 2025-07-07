import { Typography } from '@ecdlink/ui';
import { UseFormGetValues } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
}

export const Step2: React.FC<StepProps> = ({ getValues }) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 2`} />
      <div>
        <Typography
          type="body"
          weight="bold"
          color="textDark"
          text={`App URL`}
        />
        <Typography
          type="body"
          color="textDark"
          text={`${getValues().applicationUrl}.ecdconnect.co.za` || 'None'}
        />
      </div>
    </div>
  );
};
