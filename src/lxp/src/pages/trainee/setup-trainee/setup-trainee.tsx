import { BannerWrapper, Card, StepItem, Steps, Typography } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useHistory } from 'react-router';
import { useTheme } from '@ecdlink/core';
import WelcomeImage from '../../../assets/walktroughImage.png';
import { WelcomePage } from '@/components/welcome-page';

const MOCKED_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2020',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: '10 March 2020',
  },
  steps: [
    {
      title: 'Starter Licence received',
      subTitle: '22 Feb 2020',
      type: 'completed',
    },
    {
      title: 'Consolidation meeting attended',
      subTitle: '25 Feb 2020',
      type: 'completed',
      completedStepIcon: 'CalendarIcon',
      showAccordion: true,
    },
    {
      title: 'SmartSpace Licence received',
      subTitle: '10 Mar 2020',
      type: 'completed',
    },
    {
      title: 'Did not attend first aid course',
      subTitle: '5 Mar 2020',
      type: 'inProgress',
      inProgressStepIcon: 'ExclamationCircleIcon',
    },
    {
      title: '3/3 club meetings attended',
      subTitle: '25 Aug 2020',
      type: 'completed',
    },
    {
      title: 'Pre-PQA site visits',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
      showAccordion: true,
      accordionContent: <>Content</>,
    },
  ] as StepItem[],
};

export const SetupTrainee = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { theme } = useTheme();
  return (
    <>
      <BannerWrapper
        onBack={history.goBack}
        color="primary"
        className={'h-full'}
        title={`Welcome`}
        subTitle="Your onboarding journey"
        displayOffline={!isOnline}
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
      >
        {/* <div className={'px-4'}>
          <WelcomePage onNext={() => {}} />
        </div> */}
        <div className="p-4">
          <div className="my-4 flex items-center justify-center">
            <Card className="bg-uiBg flex w-full flex-col justify-center rounded-xl p-4">
              <div className="flex w-full justify-center">
                <img
                  src={WelcomeImage}
                  alt="welcome"
                  className="my-4 h-36 w-36"
                />
              </div>
              <div className="flex flex-wrap justify-center">
                <Typography
                  type="h3"
                  text={'Start your onboarding journey!'}
                  color={'textDark'}
                  className={'semibold'}
                />
              </div>
              <div className="flex flex-wrap justify-center">
                <Typography
                  type="h4"
                  text={
                    'Complete each step by the deadline. Some steps can only be completed once previous steps are done.'
                  }
                  color={'textMid'}
                />
              </div>
            </Card>
          </div>
          <div className="p-4">
            <Steps
              items={MOCKED_DATA.steps}
              typeColor={{ completed: 'successMain' }}
            />
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
