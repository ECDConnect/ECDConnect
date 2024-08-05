import { Typography } from '@ecdlink/ui';
import { UseFormGetValues } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
}

export const Step7: React.FC<StepProps> = ({ getValues }) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 7`} />
      <Typography type="h3" color="textDark" text={`Super-administrator 1`} />
      <div>
        <div className="flex flex-col gap-2">
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`Super-administrator first name`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues()?.superAdmin1FirstName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`Super-administrator surname`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues()?.superAdmin1Surname}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`Super-administrator email address`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues()?.superAdmin1Email}
          />
        </div>
      </div>
      <Typography type="h3" color="textDark" text={`Super-administrator 2`} />
      <div>
        <div className="flex flex-col gap-2">
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`Super-administrator first name`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues()?.superAdmin2FirstName}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`Super-administrator surname`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues()?.superAdmin2Surname}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`Super-administrator email address`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues()?.superAdmin2Email}
          />
        </div>
      </div>
    </div>
  );
};
