import { Alert, Button, Typography } from '@ecdlink/ui';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';

export const WhatsappCall = () => {
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const practitionerNumber = practitioner?.user?.phoneNumber;

  const callForHelp = () => {
    window.open('tel:' + practitionerNumber);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${practitionerNumber}`);
  };

  return (
    <>
      <div className="mt-10">
        <Typography
          type="h4"
          weight="bold"
          lineHeight="snug"
          text={'Contact ' + practitionerFirstName}
        />
        <Typography
          type="h5"
          weight="bold"
          lineHeight="snug"
          color="secondary"
          text={`${
            practitionerNumber == null
              ? 'Number not available'
              : practitionerNumber
          }`}
        />
        <Button
          color={'primary'}
          type={'outlined'}
          className={'mr-4 mt-2'}
          size={'small'}
          onClick={whatsapp}
        >
          <img
            src={getLogo(LogoSvgs.whatsapp)}
            alt="whatsapp"
            className="text-primary mr-1 h-5 w-5"
          />
          <Typography
            color={'primary'}
            type={'small'}
            weight="bold"
            text={`WhatsApp client`}
          />
        </Button>
        <Button
          text="Call client"
          icon="PhoneIcon"
          type="outlined"
          size="small"
          color="primary"
          textColor="primary"
          iconPosition="start"
          onClick={callForHelp}
          className="mt-2"
        />
      </div>
      <div>
        <Alert
          type={'info'}
          className="items-left justify-left mt-4 flex"
          title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
        />
      </div>
    </>
  );
};
