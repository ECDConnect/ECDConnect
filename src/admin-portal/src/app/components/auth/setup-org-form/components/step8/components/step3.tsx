import { Typography } from '@ecdlink/ui';
import { UseFormGetValues } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
}

export const Step3: React.FC<StepProps> = ({ getValues }) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 3`} />
      <div>
        <Typography type="body" weight="bold" color="textDark" text={`Logos`} />
        <div className="mt-4 mb-2 grid grid-cols-3 gap-6">
          <div className="border-primary rounded-md border">
            <img
              src={getValues().darkVersionLogo}
              alt="dark logo"
              className="h-48 w-48"
            />
          </div>
          <div className="border-primary rounded-md border">
            <img
              src={getValues().lightVersionLogo}
              alt="dark logo"
              className="h-48 w-48"
            />
          </div>
          <div className="border-primary rounded-md border">
            <img
              src={getValues().favicon}
              alt="dark logo"
              className="h-48 w-48"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
