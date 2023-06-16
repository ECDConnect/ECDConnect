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
import ROUTES from '@/routes/routes';

interface OnboardingTraineeDashboardProps {
  setNotificationStep: any;
  setIsSmartChecklist?: any;
}

export const OnboardingTraineeDashboard: React.FC<
  OnboardingTraineeDashboardProps
> = ({ setNotificationStep, setIsSmartChecklist }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');

  const { width } = useWindowSize();
  const [showInfo, setShowInfo] = useState(false);

  const displayTutorial = (type?: string) => {
    setShowInfo(true);
  };

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const onView = async (notificationStep: string) => {
    if (notificationStep === 'Fill in the SmartSpace checklist') {
      setIsSmartChecklist(true);
    }
    setNotificationStep(notificationStep);
  };

  const uncompletedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter((item) => item?.type !== 'completed' && item?.type !== 'inProgress');

  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter((item) => item?.type === 'completed');
  const stepperCount = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).length;

  const notificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'PencilAltIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: uncompletedSteps?.[0].title,
      titleStyle: 'text-textDark semibold',
      subTitle: uncompletedSteps?.[0].subTitle,
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'primary',
      backgroundColor: 'uiBg',
      onActionClick: () => setNotificationStep(uncompletedSteps?.[0].title),
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
      onBack={() => history.push(ROUTES.TRAINEE.SETUP_TRAINEE)}
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
              (a) => onView(a),
              false,
              isOnline,
              // @ts-ignore
              undefined
            )}
            typeColor={{ completed: 'successMain', todo: 'primaryAccent2' }}
          />
        )}
        <div className="my-4 flex h-20 justify-center gap-1">
          {Array.from({ length: stepperCount }, (_, i) => (
            <span
              key={i}
              className="rounded-10 h-2"
              style={{
                minWidth: 37,
                background:
                  timelineSteps(
                    timeline!,
                    () => {},
                    false,
                    isOnline,
                    // @ts-ignore
                    undefined
                  ).length && i + 1 <= completedSteps?.length
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
