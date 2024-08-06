import { Typography } from '@ecdlink/ui';
import { UseFormGetValues } from 'react-hook-form';
import { SetupOrgModel } from '../../../../../../schemas/setup-org';
import { useMemo } from 'react';
import { SmsProviders } from '../../step5/step5';

interface StepProps {
  getValues?: UseFormGetValues<SetupOrgModel>;
}

export const Step5: React.FC<StepProps> = ({ getValues }) => {
  const renderSMSProviderInfo = useMemo(() => {
    if (getValues().smsProvider === SmsProviders.BulkSMS) {
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Typography
              type="help"
              weight="bold"
              color="textDark"
              text={`BulkSMS - Token ID`}
            />
            <Typography
              type="help"
              color="textDark"
              text={getValues().tokenId}
            />
          </div>
          <div>
            <Typography
              type="help"
              weight="bold"
              color="textDark"
              text={`BulkSMS - Token Secret`}
            />
            <Typography
              type="help"
              color="textDark"
              text={getValues().tokenSecret}
            />
          </div>
          <div>
            <Typography
              type="help"
              weight="bold"
              color="textDark"
              text={`BulkSMS - Token Basic Auth`}
            />
            <Typography
              type="help"
              color="textDark"
              text={getValues().tokenBasicAuth}
            />
          </div>
        </div>
      );
    }

    if (getValues().smsProvider === SmsProviders.iTouch) {
      return (
        <div className="flex flex-col gap-6">
          <div>
            <Typography
              type="help"
              weight="bold"
              color="textDark"
              text={`ITouch - Token username`}
            />
            <Typography
              type="help"
              color="textDark"
              text={getValues().tokenUserName}
            />
          </div>
          <div>
            <Typography
              type="help"
              weight="bold"
              color="textDark"
              text={`ITouch - Token password`}
            />
            <Typography
              type="help"
              color="textDark"
              text={getValues().tokenPassword}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`SMSPortal - API key`}
          />
          <Typography type="help" color="textDark" text={getValues().apiKey} />
        </div>
        <div>
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`SMSPortal - API secret`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues().apiSecret}
          />
        </div>
      </div>
    );
  }, [getValues]);
  return (
    <div className="flex flex-col gap-6">
      <Typography type="h2" color="textDark" text={`Step 5`} />
      <div>
        <div>
          <Typography
            type="help"
            weight="bold"
            color="textDark"
            text={`SMS provider`}
          />
          <Typography
            type="help"
            color="textDark"
            text={getValues().smsProvider}
          />
        </div>
      </div>
      {renderSMSProviderInfo}
    </div>
  );
};
