import { formatPhonenumberInternational } from '@/utils/common/contact-details.utils';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { CommunityProfileDto } from '@ecdlink/core';
import { Alert, Button, Typography } from '@ecdlink/ui';
import { MailIcon, PhoneIcon } from '@heroicons/react/solid';

interface ConnectionContactDetailsProps {
  connectionCommunityProfile: CommunityProfileDto;
}

export const ConnectionContactDetails: React.FC<
  ConnectionContactDetailsProps
> = ({ connectionCommunityProfile }) => {
  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        connectionCommunityProfile?.communityUser?.phoneNumber ?? ''
      )}`
    );
  };

  const call = () => {
    window.open(
      `tel:${connectionCommunityProfile?.communityUser?.phoneNumber}`
    );
  };

  return (
    <div>
      {connectionCommunityProfile?.sharePhoneNumber && (
        <div>
          <Typography
            type={'h3'}
            text={connectionCommunityProfile?.communityUser?.fullName}
            color={'textDark'}
            align="left"
            className="my-2"
          />
          <Typography
            type={'h3'}
            text={connectionCommunityProfile?.communityUser?.phoneNumber}
            color={'quatenary'}
            align="left"
            className="my-2"
          />
          <div className="flex items-center gap-3">
            <Button
              color={'secondary'}
              type={'outlined'}
              className={' rounded-xl'}
              size={'small'}
              onClick={whatsapp}
            >
              <div className="flex items-center">
                <img
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className="text-secondary mr-1 h-5 w-5"
                />
                <Typography
                  text={`Whatsapp`}
                  type="button"
                  weight="skinny"
                  color="secondary"
                />
              </div>
            </Button>
            <Button
              color={'secondary'}
              type={'outlined'}
              className={'rounded-xl'}
              size={'small'}
              onClick={call}
            >
              <div className="flex items-center justify-center">
                <PhoneIcon
                  className="text-secondary mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                <Typography
                  text={`Call`}
                  type="button"
                  weight="skinny"
                  color="secondary"
                />
              </div>
            </Button>
            {connectionCommunityProfile?.shareEmail && (
              <Button
                color={'secondary'}
                type={'outlined'}
                className={'mr-4 rounded-xl'}
                size={'small'}
                onClick={() =>
                  window.open(
                    `mailto:${connectionCommunityProfile?.communityUser?.email}`
                  )
                }
              >
                <div className="flex items-center">
                  <MailIcon className="text-secondary h-5 w-6" />
                  <Typography
                    text={`Email`}
                    type="button"
                    weight="skinny"
                    color="secondary"
                  />
                </div>
              </Button>
            )}
          </div>
          <Alert
            type={'info'}
            className="items-left justify-left mt-4 flex"
            title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
            titleType="h4"
          />
        </div>
      )}
    </div>
  );
};
