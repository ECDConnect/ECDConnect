import { formatPhonenumberInternational } from '@/utils/common/contact-details.utils';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { PractitionerDto } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { PhoneIcon } from '@heroicons/react/solid';

interface RegisterChildrenInfoProps {
  setShowRegisterChildrenInfo: (item: boolean) => void;
  registerChildrenDeadlineDateFormatted: string;
  practitioner: PractitionerDto | undefined;
}
export const RegisterChildrenInfo: React.FC<RegisterChildrenInfoProps> = ({
  setShowRegisterChildrenInfo,
  registerChildrenDeadlineDateFormatted,
  practitioner,
}) => {
  const call = () => {
    window.open(`tel:${practitioner?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        practitioner?.user?.phoneNumber ?? ''
      )}`
    );
  };
  return (
    <BannerWrapper
      size={'small'}
      renderBorder={true}
      title={'Not enough children registered'}
      color={'primary'}
      onBack={() => setShowRegisterChildrenInfo(false)}
    >
      <div className="flex flex-col gap-4 p-4">
        <Typography
          type="h3"
          weight="bold"
          color="textDark"
          text={`Remind ${practitioner?.user?.firstName} she needs to register 3 children ${registerChildrenDeadlineDateFormatted}`}
          className="mt-4"
        ></Typography>
        <Typography
          type="body"
          color="textMid"
          text={`Give ${practitioner?.user?.firstName} some tips for engaging with caregivers in the community:
                    • Tell them why early childhood development is so important
                    • Explain that the programme is for 3- and 4-year old children
                    • Talk about fees for the service, or contributions toward the service
                    • Tell them where it will be held and what time it starts and finishes
                    • List the documents needed for registration (ID , birth certificate,
                    contact details, clinic card).`}
          className="mt-4"
        ></Typography>
        <Typography
          text={`Contact ${practitioner?.user?.firstName}`}
          type="h3"
          color="textDark"
          className={'mt-4'}
        />
        <Typography
          text={`${practitioner?.user?.phoneNumber}` || ''}
          type="h2"
          weight="skinny"
          color="primary"
        />
        <div className="mt-4 flex justify-center">
          <Button
            color={'primary'}
            type={'outlined'}
            className={'mr-4 rounded-xl'}
            size={'normal'}
            onClick={whatsapp}
          >
            <div className="flex items-center justify-center">
              <img
                src={getLogo(LogoSvgs.whatsapp)}
                alt="whatsapp"
                className="text-primary mr-1 h-5 w-5"
              />
              <Typography
                text={`Whatsapp ${practitioner?.user?.firstName}`}
                type="button"
                weight="skinny"
                color="primary"
              />
            </div>
          </Button>
          <Button
            color={'primary'}
            type={'outlined'}
            className={'mr-4 rounded-xl'}
            size={'small'}
            onClick={call}
          >
            <div className="flex items-center justify-center">
              <PhoneIcon
                className="text-primary mr-2 h-6 w-5"
                aria-hidden="true"
              />
              <Typography
                text={`Call ${practitioner?.user?.firstName}`}
                type="button"
                weight="skinny"
                color="primary"
              />
            </div>
          </Button>
        </div>
        <Alert
          type="info"
          className="mt-4"
          message="WhatsApps and phone calls will be charged at your standard carrier rates."
        />
        <Button
          type="filled"
          color="primary"
          className="mt-4 mb-2 w-full"
          onClick={() => setShowRegisterChildrenInfo(false)}
        >
          {renderIcon('CheckCircleIcon', 'mr-2 text-white w-5')}
          <Typography
            type={'body'}
            text={`I have contacted ${practitioner?.user?.firstName}`}
            color={'white'}
          />
        </Button>
      </div>
    </BannerWrapper>
  );
};
