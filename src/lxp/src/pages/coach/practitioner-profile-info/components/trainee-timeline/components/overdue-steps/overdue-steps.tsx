import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { coachSelectors } from '@/store/coach';
import {
  Alert,
  BannerWrapper,
  Button,
  MenuListDataItem,
  StepItem,
  Typography,
  renderIcon,
  ListItem,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { PhoneIcon } from '@heroicons/react/solid';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import { formatPhonenumberInternational } from '@utils/common/contact-details.utils';
import { PractitionerDto } from '@ecdlink/core';

interface OverdueStepsoProps {
  overdueSteps?: StepItem[];
  practitioner?: PractitionerDto;
  setShowOverdueSteps: (item: boolean) => void;
}

export const OverdueSteps: React.FC<OverdueStepsoProps> = ({
  overdueSteps,
  practitioner,
  setShowOverdueSteps,
}) => {
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

  const overdueItems = overdueSteps?.map((overdueStep): MenuListDataItem => {
    const replacedString = overdueStep?.subTitle?.replace('By', 'Due');

    return {
      showIcon: true,
      menuIcon: 'ExclamationIcon',
      iconColor: 'white',
      titleStyle: 'text-textDark',
      title: overdueStep?.title,
      subTitle: replacedString,
      subTitleStyle: 'text-alertMain',
      iconBackgroundColor: 'alertMain',
      backgroundColor: 'white',
      onActionClick: () => {},
    };
  });

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Overdue onboarding steps'}
      color={'primary'}
      onBack={() => setShowOverdueSteps(false)}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="h-screen p-4">
        <div className="flex items-center gap-2">
          <div className="bg-alertMain grid h-8 w-8 place-items-center rounded-full">
            {' '}
            <Typography
              color={'white'}
              type={'h2'}
              text={`${overdueSteps?.length}`}
            />
          </div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={`Steps overdue`}
          />
        </div>
        <Typography
          text={`${practitioner?.user?.firstName} has not completed the following onboaring steps.`}
          type="h2"
          color="textDark"
          className={'mt-4'}
        />
        {overdueSteps && overdueSteps?.length > 0 && (
          <div className="pt-2 pb-6">
            {overdueItems?.map((step, idx) => {
              return (
                <div className={'mb-4'} key={idx.toString()}>
                  <ListItem
                    className="mt-4"
                    key={idx.toString()}
                    title={step.title}
                    titleTypographyType="h4"
                    titleColor="textDark"
                    subTitle={step.subTitle}
                    subTitleTypographyType="help"
                    subTitleColor="textMid"
                    showIcon
                    iconName="ExclamationIcon"
                    iconBackgroundColor="alertMain"
                    iconColor="white"
                  />
                </div>
              );
            })}
          </div>
        )}
        <Typography
          text={`Contact ${practitioner?.user?.firstName} for more information and to see if they need help.`}
          type="h3"
          color="textDark"
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
      </div>
    </BannerWrapper>
  );
};
