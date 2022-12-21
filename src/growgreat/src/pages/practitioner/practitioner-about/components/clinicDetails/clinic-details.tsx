import { useMemo } from 'react';
import { ClinicDetailsProps } from './clinic-details.types';
import {
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
  Divider,
} from '@ecdlink/ui';
import { PhoneIcon } from '@heroicons/react/solid';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './clinic-details.styles';
import WhatsLogo from '../../../../../assets/whatsgg.svg';

export const ClinicDetails: React.FC<ClinicDetailsProps> = ({
  healthCareWorker,
  setClinicDetails,
}) => {
  const { isOnline } = useOnlineStatus();

  const { addressLine1, addressLine3, postalCode } =
    healthCareWorker?.teamLead?.clinic?.siteAddress || {};

  const healthCareWorkerAddress = useMemo(
    () =>
      `${addressLine1 && addressLine1 + ', '}${
        addressLine3 && addressLine3 + ', '
      }${postalCode}`,
    [addressLine1, addressLine3, postalCode]
  );

  const call = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${healthCareWorker?.user?.phoneNumber}`);
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Your clinic`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() => setClinicDetails(false)}
        displayOffline={!isOnline}
        backgroundImageColour={'primary'}
      ></BannerWrapper>
      <div className="ml-4">
        <div>
          <Typography
            text={`${healthCareWorker?.teamLead?.clinic?.name}`}
            type="h1"
            color="textDark"
            className={'mt-4'}
          />
        </div>
        {!!healthCareWorkerAddress && (
          <div>
            <div>
              <Typography
                text={`Clinic address:`}
                type="h3"
                color="textDark"
                className={'mt-4'}
              />
              <Typography
                text={!!healthCareWorkerAddress ? healthCareWorkerAddress : ''}
                type="h3"
                color="textMid"
                className={'mt-2'}
              />
            </div>
            <Button
              size="small"
              shape="normal"
              color="primary"
              type="outlined"
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(healthCareWorkerAddress);
              }}
            >
              <Typography type="help" color="primary" text="Copy address" />
              {renderIcon('DocumentDuplicateIcon', styles.buttonIcon)}
            </Button>
          </div>
        )}
        <div>
          <div>
            <Typography
              text={`Clinic phone number:`}
              type="h3"
              color="textDark"
              className={'mt-4'}
            />
            <Typography
              text={
                healthCareWorker?.teamLead?.clinic?.phoneNumber
                  ? `${healthCareWorker?.teamLead?.clinic?.phoneNumber}`
                  : ''
              }
              type="h2"
              color="secondary"
              className={'mt-2'}
            />
          </div>
          <Button
            size="small"
            shape="normal"
            color="primary"
            type="outlined"
            className="mt-4"
            onClick={() =>
              call(healthCareWorker?.teamLead?.clinic?.phoneNumber!)
            }
          >
            {renderIcon('PhoneIcon', styles.buttonIcon)}
            <Typography type="help" color="primary" text="Call clinic" />
          </Button>
        </div>
        <div className="flex justify-center">
          <Divider
            className="text-primaryAccent1 mt-8 w-11/12"
            dividerType="dashed"
          />
        </div>
        <div className="">
          <div>
            <Typography
              text={`${healthCareWorker?.teamLead?.user?.firstName} ${healthCareWorker?.teamLead?.user?.surname}`}
              type="h1"
              color="textDark"
              className={''}
            />
            <Typography
              text={`${healthCareWorker?.teamLead?.clinic?.name} ${healthCareWorker?.teamLead?.jobTitle}`}
              type="h3"
              color="textMid"
              className={''}
            />
          </div>
          <div className="mt-2">
            <Typography
              text={`${healthCareWorker?.teamLead?.user?.firstName}'s phone number:`}
              type="h3"
              color="textDark"
              className={'mt-4'}
            />
            <Typography
              text={
                healthCareWorker?.teamLead?.user?.phoneNumber
                  ? `${healthCareWorker?.teamLead?.user?.phoneNumber}`
                  : ''
              }
              type="h2"
              color="secondary"
              className={'mt-2'}
            />
          </div>
          <div>
            <Typography
              text={``}
              type="h2"
              weight="skinny"
              color="primary"
              className={'ml-4 mt-2'}
            />
          </div>
        </div>
        <div>
          <div className={styles.contactButtons}>
            <Button
              color={'primary'}
              type={'outlined'}
              className={'mr-4 rounded-xl'}
              size={'normal'}
              onClick={whatsapp}
            >
              <div className="flex items-center justify-center">
                <img
                  src={WhatsLogo}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
                />
                <Typography
                  text={`Whatsapp ${healthCareWorker?.teamLead?.user?.firstName}`}
                  type="button"
                  weight="skinny"
                  color="primaryAccent1"
                />
              </div>
            </Button>
            <Button
              color={'primary'}
              type={'outlined'}
              className={'mr-4 rounded-xl'}
              size={'small'}
              onClick={() => call(healthCareWorker?.user?.phoneNumber!)}
            >
              <div className="flex items-center justify-center">
                <PhoneIcon
                  className="text-primary h-7 w-6"
                  aria-hidden="true"
                />
                <Typography
                  text={`Call ${healthCareWorker?.teamLead?.user?.firstName}`}
                  type="button"
                  weight="skinny"
                  color="primary"
                />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
