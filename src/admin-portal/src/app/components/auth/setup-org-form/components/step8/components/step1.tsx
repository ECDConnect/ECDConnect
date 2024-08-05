import { Typography } from '@ecdlink/ui';
import { UseFormGetValues } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
}

export const Step1: React.FC<StepProps> = ({ getValues }) => {
  return (
    <div className="my-6 flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 1`} />
      <div>
        <Typography
          type="body"
          weight="bold"
          color="textDark"
          text={`Organisation name`}
        />
        <Typography
          type="body"
          color="textDark"
          text={getValues().organisationName || 'None'}
        />
      </div>
      <div>
        <Typography
          type="body"
          weight="bold"
          color="textDark"
          text={`App name`}
        />
        <Typography
          type="body"
          color="textDark"
          text={getValues().applicationName || 'None'}
        />
      </div>
      <div>
        <Typography
          type="body"
          weight="bold"
          color="textDark"
          text={`Email address for receiving app help requests`}
        />
        <Typography
          type="body"
          color="textDark"
          text={getValues()?.organisationEmail || 'None'}
        />
      </div>
    </div>
  );
};
