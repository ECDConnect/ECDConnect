import {
  Button,
  Typography,
  ComponentBaseProps,
  classNames,
} from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import * as styles from './contact-person.styles';

interface ContactPersonProps extends ComponentBaseProps {
  name: string;
  surname: string;
  contactNumber: string;
  type?: string;
  displayHeader?: boolean;
}

export const ContactPerson: React.FC<ContactPersonProps> = ({
  name,
  surname,
  contactNumber,
  className,
  type = '',
  displayHeader = true,
}) => {
  const call = () => {
    window.open(`tel:${contactNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(contactNumber)}`
    );
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      {displayHeader && (
        <>
          <Typography
            color={'primary'}
            type={'h1'}
            text={`${name} ${surname}`}
          />
          <Typography
            color={'textMid'}
            type={'body'}
            weight={'bold'}
            text={type}
          />
        </>
      )}

      <Typography
        className={'mt-1'}
        color={'textDark'}
        type={'body'}
        text={`${name}'s phone number:`}
      />
      <Typography
        color={'quatenary'}
        type={'body'}
        weight={'bold'}
        text={contactNumber}
      />
      <div className={styles.actionsWrapper}>
        <Button
          color={'secondary'}
          type={'outlined'}
          className={'mr-4'}
          size={'small'}
          onClick={whatsapp}
        >
          <img
            src={getLogo(LogoSvgs.whatsapp)}
            alt="whatsapp"
            className={styles.buttonIconStyle}
          />
          <Typography
            color={'secondary'}
            type={'small'}
            text={`WhatsApp ${name}`}
          />
        </Button>
        <Button
          color={'secondary'}
          textColor="secondary"
          type={'outlined'}
          size={'small'}
          onClick={call}
          icon="PhoneIcon"
          text={`Call ${name}`}
        />
      </div>
    </div>
  );
};
