import {
  renderIcon,
  BannerWrapper,
  Button,
  Typography,
  Alert,
} from '@ecdlink/ui';
import { PhoneIcon } from '@heroicons/react/solid';
import * as styles from './contact-dialog.styles';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { ContactDialogProps } from './contact-dialog.types';

export const ContactDialog: React.FC<ContactDialogProps> = ({
  firstName,
  phoneNumber: contactNumber,
  whatsAppNumber,
  title,
  subTitle,
  children,
  onClose,
}) => {
  const call = () => {
    window.open(`tel:${contactNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(whatsAppNumber)}`
    );
  };

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={title}
        subTitle={subTitle}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={onClose}
      ></BannerWrapper>
      <div>
        <div className="m-4">{children}</div>
        <div>
          <div>
            <Typography
              text={`Contact ${firstName}`}
              type="h3"
              color="textDark"
              className={'m-4'}
            />
          </div>
          <div>
            <Typography
              text={`${contactNumber}`}
              type="h2"
              weight="skinny"
              color="textDark"
              className={'ml-4 mt-2'}
            />
          </div>
        </div>
        <div>
          <div className={styles.contactButtons}>
            <div className="ml-4 grid grid-cols-2 justify-items-center">
              <Button
                color={'quatenary'}
                type={'outlined'}
                className={'mr-4 rounded-xl'}
                size={'normal'}
                onClick={whatsapp}
              >
                <div className="flex items-center justify-center">
                  <img
                    src={getLogo(LogoSvgs.whatsapp)}
                    alt="whatsapp"
                    className={styles.buttonIconStyle}
                  />
                  <Typography
                    text={`Whatsapp ${firstName}`}
                    type="button"
                    weight="skinny"
                    color="quatenary"
                  />
                </div>
              </Button>
              <Button
                color={'quatenary'}
                type={'outlined'}
                className={'mr-4 rounded-xl'}
                size={'small'}
                onClick={call}
              >
                <div className="flex items-center justify-center">
                  <PhoneIcon
                    className="text-quatenary mr-2 h-6 w-5"
                    aria-hidden="true"
                  />
                  <Typography
                    text={`Call ${firstName}`}
                    type="button"
                    weight="skinny"
                    color="quatenary"
                  />
                </div>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="ml-4 mr-4 w-full rounded-2xl">
              <Alert
                type="info"
                className="mt-4"
                message="WhatsApps and phone calls will be charged at your standard carrier rates."
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 w-full">
          <div className="flex w-full justify-center">
            <div className="w-11/12">
              <Button
                className={styles.button.replace('mt-4', 'mt-3')}
                color={'quatenary'}
                type="filled"
                onClick={onClose}
              >
                {renderIcon('XIcon', styles.buttonIcon)}
                <Typography
                  type="button"
                  text="Close"
                  color="white"
                  className="w/11-12 ml-2"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
