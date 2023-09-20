import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { coachSelectors } from '@/store/coach';
import {
  Alert,
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { PhoneIcon } from '@heroicons/react/solid';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { PractitionerDto } from '@ecdlink/core';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';

interface OnboardingNotCompletedProps {
  practitioner?: PractitionerDto;
  starterLicenseDate: Date;
  setShowOnboardingNotCompleted: (item: boolean) => void;
}

export const OnboardingNotCompleted: React.FC<OnboardingNotCompletedProps> = ({
  practitioner,
  starterLicenseDate,
  setShowOnboardingNotCompleted,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const coach = useSelector(coachSelectors.getCoach);

  const call = () => {
    window.open(`tel:${coach?.user?.phoneNumber}`);
  };

  const whatsapp = () => {
    window.open(
      `https://wa.me/${formatPhonenumberInternational(
        coach?.user?.phoneNumber ?? ''
      )}`
    );
  };

  const dateLongMonthOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Onboarding not completed'}
      color={'primary'}
      onBack={() => setShowOnboardingNotCompleted(false)}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="h-screen p-4">
        <Typography
          text={`${practitioner?.user?.firstName} did not complete trainee onboarding in 2 weeks.`}
          type="h2"
          color="textDark"
          className={'mt-4'}
        />
        <Typography
          text={`You can reach out to ${
            practitioner?.user?.firstName
          } to find out what's wrong, or deactivate this profile.

          ${
            practitioner?.user?.firstName
          } received a Starter License on ${new Date(
            starterLicenseDate
          ).toLocaleDateString('en-ZA', dateLongMonthOptions)}.

          The trainee onboarding process should be completed 2 weeks after receiving a Starter License.
          
            If the practitioner needs more support to get started, please visit the site.

            If the practitioner is not going to complete the steps, remove their profile below.
          `}
          type="body"
          color="textDark"
          className="mt-4"
        />

        <Typography
          text={`Contact ${practitioner?.user?.firstName}`}
          type="h3"
          color="textDark"
          className="mt-4"
        />
        <Typography
          text={`${practitioner?.user?.phoneNumber}`}
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
                text={`Whatsapp ${coach?.user?.firstName}`}
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
                text={`Call ${coach?.user?.firstName}`}
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
        <div className="flex w-full justify-center">
          <Button
            type="outlined"
            color="primary"
            className={'mt-6 mb-6 w-full'}
            onClick={() =>
              history.push(ROUTES.COACH.PRACTIONER_REMOVE, {
                practitionerId: practitioner?.userId,
              })
            }
          >
            {renderIcon('UsersIcon', 'w-5 h-5 color-primary text-primary mr-2')}
            <Typography
              type="body"
              className="mr-4"
              color="primary"
              text={'Remove practitioner'}
            ></Typography>
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
