import { Button, Typography } from '@ecdlink/ui';
import { ComponentBaseProps } from '@ecdlink/ui';
import { classNames, renderIcon } from '@ecdlink/ui';
import { getLogo, LogoSvgs } from '../../utils/common/svg.utils';
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
    window.open(`https://wa.me/${contactNumber}`);
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      {displayHeader && (
        <>
          <Typography color={'primary'} type={'h1'} text={`${name} ${surname}`} />
          <Typography color={'black'} type={'body'} weight={'bolder'} text={type} />
        </>
      )}

      <Typography
        className={'mt-1'}
        color={'textMid'}
        type={'body'}
        text={`${name}'s phone number:`}
      />
      <Typography color={'black'} type={'body'} weight={'bolder'} text={contactNumber} />
      <div className={styles.actionsWrapper}>
        <Button
          color={'primary'}
          type={'outlined'}
          className={'mr-4'}
          size={'small'}
          onClick={whatsapp}
        >
          <img src={getLogo(LogoSvgs.whatsapp)} alt="whatsapp" className={styles.buttonIconStyle} />
          <Typography color={'primary'} type={'small'} text={`WhatsApp ${name}`} />
        </Button>
        <Button color={'primary'} type={'outlined'} size={'small'} onClick={call}>
          {renderIcon('PhoneIcon', styles.buttonIconStyle)}
          <Typography color={'primary'} type={'small'} text={`Call ${name}`} />
        </Button>
      </div>
    </div>
  );
};
