import { useHistory, useLocation } from 'react-router';
import {
  renderIcon,
  BannerWrapper,
  Button,
  Typography,
  Alert,
} from '@ecdlink/ui';
import { PhoneIcon } from '@heroicons/react/solid';
import { PractitionerProfileRouteState } from './coach-classes-reassigned.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './coach-classes-reassigned.styles';
import ROUTES from '@routes/routes';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';

export const CoachClassesReassigned: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<PractitionerProfileRouteState>();
  const practitionerId = location.state.practitionerId;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);
  const practitioner = practitioners?.find(
    (practitioner) => practitioner?.userId === practitionerId
  );

  const reassignedGroups = false;

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
    <div className={styles.contentWrapper}>
      <BannerWrapper
        title={`Playgroups reassigned`}
        color={'primary'}
        size="small"
        renderOverflow={false}
        onBack={() =>
          history.push(ROUTES.COACH.PROGRAMME_INFORMATION, {
            practitionerId,
          })
        }
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div className="mt-4 ml-4 flex w-full items-center">
        <div className="bg-alertMain mr-4 grid h-6 w-8 place-items-center rounded-full">
          <Typography
            type={'body'}
            weight={'bold'}
            text={'0'}
            color={'white'}
          />
        </div>
        <div>
          <Typography
            text={'Classes reassigned'}
            type="h4"
            color="textDark"
            className={'mt-1'}
          />
        </div>
      </div>
      {!reassignedGroups && (
        <div>
          <Typography
            text={`${practitioner?.user?.firstName} doesn't reassigned any classes`}
            type="h3"
            color="textDark"
            className={'m-4'}
          />
        </div>
      )}
      <div>
        <div>
          <div>
            <Typography
              text={`Contact ${practitioner?.user?.firstName}`}
              type="h3"
              color="textDark"
              className={'m-4'}
            />
          </div>
          <div>
            <Typography
              text={`${practitioner?.user?.phoneNumber}`}
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
                  src={getLogo(LogoSvgs.whatsapp)}
                  alt="whatsapp"
                  className={styles.buttonIconStyle}
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
          <div className="flex justify-center">
            <div className="w-11/12 rounded-2xl">
              <Alert
                type="info"
                className="mt-4"
                message="WhatsApps and phone calls will be charged at your standard carrier rates."
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-11/12">
            <Button
              className={styles.button.replace('mt-4', 'mt-3')}
              color={'primary'}
              type="filled"
              onClick={() => {}}
            >
              {renderIcon('ChatAlt2Icon', styles.buttonIcon)}
              <Typography
                type="button"
                text="Contact caregiver"
                color="white"
                className="ml-2"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
