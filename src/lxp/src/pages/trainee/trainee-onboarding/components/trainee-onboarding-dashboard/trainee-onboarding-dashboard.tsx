import {
  BannerWrapper,
  DialogPosition,
  Divider,
  MenuListDataItem,
  StackedList,
  StepItem,
  Steps,
  Typography,
  Dialog,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useWindowSize } from '@reach/window-size';
import { format } from 'date-fns';
import { useState } from 'react';
import { useHistory } from 'react-router';
import OnboardingInfoPage from '../onboarding-info-page/onboarding-info-page';
import { timelineSteps } from './timeline-steps';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';

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
      title: 'Attended day 1 of start-up training',
      subTitle: '22 Feb 2020',
      type: 'completed',
    },
    {
      title: 'Starter licence',
      subTitle: '25 Feb 2020',
      type: 'completed',
    },
    {
      title: 'Consolidation meeting scheduled',
      subTitle: '10 Mar 2020',
      type: 'todo',
      todoStepIcon: 'CalendarIcon',
    },
    {
      title: 'Fill in the SmartSpace checklist',
      subTitle: '5 Mar 2020',
      type: 'todo',
    },
    {
      title: 'Get community support',
      subTitle: '25 Aug 2020',
      type: 'todo',
    },
    {
      title: 'Register 3 children',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
    },
    {
      title: 'SmartSpace visit from coach',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
    },
    {
      title: 'Sign franchisee agreement',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
    },
    {
      title: 'Sign start-up support agreement',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
    },
  ] as StepItem[],
};

interface OnboardingTraineeDashboardProps {
  setNotificationStep: any;
}

export const OnboardingTraineeDashboard: React.FC<
  OnboardingTraineeDashboardProps
> = ({ setNotificationStep }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');
  const stepperCount = MOCKED_DATA?.steps?.length;
  const completedSteps = MOCKED_DATA?.steps?.filter(
    (item) => item?.type === 'completed'
  );
  const { width } = useWindowSize();
  const [showInfo, setShowInfo] = useState(false);

  const displayTutorial = (type?: string) => {
    setShowInfo(true);
  };

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  console.log({ timeline });
  console.log(
    timelineSteps(
      timeline!,
      () => {},
      false,
      isOnline,
      // @ts-ignore
      undefined
    )
  );

  const notificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'PencilAltIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Get Community support',
      titleStyle: 'text-textDark semibold',
      subTitle: 'By 13 December 2021',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'primary',
      backgroundColor: 'uiBg',
      onActionClick: () => setNotificationStep('GetCommunitySupport'),
    },
  ];

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={date}
      color={'primary'}
      onBack={history.goBack}
      displayHelp={true}
      onHelp={displayTutorial}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="bg-uiBg flex w-full items-center justify-center">
        <Typography
          className={'my-3'}
          color={'primary'}
          type={'h3'}
          text={'Onboarding'}
        />
      </div>
      <div className="h-screen p-4">
        <Typography
          className={'my-3'}
          color={'textDark'}
          type={'h2'}
          text={'Trainee onboarding'}
        />
        <StackedList
          isFullHeight={false}
          className={'flex flex-col gap-2'}
          listItems={notificationItem}
          type={'MenuList'}
        />
        <Typography
          className={'my-3 w-11/12'}
          color={'textDark'}
          type={'h3'}
          text={'Complete all the steps to set up your programme'}
        />
        <Divider dividerType="dashed" className="my-2" />
        {timeline && (
          <Steps
            items={timelineSteps(
              timeline,
              () => {},
              false,
              isOnline,
              // @ts-ignore
              undefined
            )}
            typeColor={{ completed: 'successMain', todo: 'primaryAccent2' }}
          />
        )}
        <div className="my-4 flex h-20 gap-1">
          {Array.from({ length: stepperCount }, (_, i) => (
            <span
              key={i}
              className="rounded-10 h-2"
              style={{
                minWidth: 37,
                background:
                  !!MOCKED_DATA?.steps?.length &&
                  i + 1 <= completedSteps?.length
                    ? '#26ACAF'
                    : '#D4EEEF',
                width: width / stepperCount,
              }}
            />
          ))}
        </div>
      </div>
      <Dialog
        fullScreen={false}
        visible={showInfo}
        position={DialogPosition.Full}
        stretch={true}
      >
        <OnboardingInfoPage setShowInfo={setShowInfo} />
      </Dialog>
    </BannerWrapper>
  );
};
