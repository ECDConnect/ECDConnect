import {
  BannerWrapper,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  Steps,
  Dialog,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useWindowSize } from '@reach/window-size';
import { differenceInDays } from 'date-fns';
import { useState } from 'react';
import { timelineSteps } from './timeline-steps';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';
import { OverdueSteps } from './components/overdue-steps/overdue-steps';
import { OnboardingNotCompleted } from './components/onboarding-not-completed/onboarding-not-completed';
import { addDays } from 'date-fns';

interface OnboardingTraineeDashboardProps {
  setNotificationStep: (notificationStep: string, options?: any) => void;
  setIsSmartChecklist?: any;
  practitioner?: PractitionerDto;
  setShowTraineeDashboard: any;
}

export const OnboardingTraineeDashboard: React.FC<
  OnboardingTraineeDashboardProps
> = ({
  setNotificationStep,
  setIsSmartChecklist,
  practitioner,
  setShowTraineeDashboard,
}) => {
  const { isOnline } = useOnlineStatus();
  const isOnStipend = practitioner?.isOnStipend;

  const { width } = useWindowSize();

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const [showSteps, setShowSteps] = useState(true);
  const [showOverdueSteps, setShowOverdueSteps] = useState(false);
  const [showOnboardingNotCompleted, setShowOnboardingNotCompleted] =
    useState(false);

  const onView = async (notificationStep: string, options: any) => {
    if (notificationStep === 'Fill in the SmartSpace checklist') {
      setIsSmartChecklist(true);
    }

    setNotificationStep(notificationStep, options);
  };

  const steps = timelineSteps(
    timeline!,
    (a, b) => onView(a, b),
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    isOnStipend
  );

  const uncompletedSteps = steps?.filter(
    (item) =>
      item?.type !== 'completed' &&
      item?.type !== 'inProgress' &&
      !(
        item?.title === 'SmartSpace visit from coach' && !item?.extraData?.date
      ) &&
      item?.title !== 'SmartSpace Licence'
  );

  const checkOverdueDate = (date?: Date | null) => {
    if (!date) return 0;
    return differenceInDays(new Date(), date);
  };

  const overdueSteps = steps?.filter(
    (item) => item?.subTitleColor === 'alertMain'
  );

  const completedSteps = steps?.filter((item) => item?.type === 'completed');

  const onboardingNotCompleted = completedSteps?.length < 8;
  const twoWeeksAgo = addDays(new Date(), -14);
  const fourWeeksAgo = addDays(new Date(), -28);
  const starterLicenseDate = timeline?.starterLicenseDate
    ? new Date(timeline?.starterLicenseDate)
    : new Date();
  const onboardingIncompleted =
    onboardingNotCompleted && starterLicenseDate <= twoWeeksAgo;

  const stepperCount = timelineSteps(
    timeline!,
    (a, b) => onView(a, b),
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    isOnStipend
  ).length;

  const filteredUncompletedSteps = uncompletedSteps.filter(
    (item) =>
      item?.title !== 'SmartSpace Licence' &&
      item?.title !== 'Consolidation meeting scheduled'
  );

  const [nextStep] = filteredUncompletedSteps;

  const notificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon:
        checkOverdueDate(nextStep?.extraData?.date) > 0
          ? 'ExclamationIcon'
          : 'PencilAltIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: nextStep?.title,
      titleStyle: 'text-textDark semibold',
      subTitle:
        checkOverdueDate(nextStep?.extraData?.date) > 0
          ? `${String(
              checkOverdueDate(nextStep?.extraData?.date)
            )} days overdue`
          : nextStep?.subTitle,
      subTitleStyle: 'text-textMid',
      iconBackgroundColor:
        checkOverdueDate(nextStep?.extraData?.date) > 0
          ? 'alertMain'
          : 'primary',
      backgroundColor:
        checkOverdueDate(nextStep?.extraData?.date) > 0 ? 'alertBg' : 'uiBg',
      onActionClick: nextStep?.actionButtonOnClick,
    },
  ];

  const overdueStepsNotificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: onboardingIncompleted
        ? 'Has not completed onboarding'
        : `${overdueSteps?.length} onboarding steps overdue`,
      titleStyle: 'text-textDark semibold',
      subTitle:
        checkOverdueDate(filteredUncompletedSteps?.[0]?.extraData?.date) > 0
          ? `${String(
              checkOverdueDate(filteredUncompletedSteps?.[0]?.extraData?.date)
            )} days overdue`
          : filteredUncompletedSteps?.[0]?.subTitle,
      subTitleStyle: 'text-textMid',
      iconBackgroundColor:
        checkOverdueDate(filteredUncompletedSteps?.[0]?.extraData?.date) > 0
          ? 'alertMain'
          : 'primary',
      backgroundColor: 'uiBg',
      onActionClick: () =>
        onboardingIncompleted
          ? setShowOnboardingNotCompleted(true)
          : setShowOverdueSteps(true),
    },
  ];

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Trainee Onboarding'}
      subTitle={
        practitioner?.user?.fullName ||
        `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`
      }
      color={'primary'}
      onBack={() => setShowTraineeDashboard(false)}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="h-screen p-4">
        {(overdueSteps?.length > 0 || onboardingIncompleted) && (
          <div className="pt-2 pb-6">
            <StackedList
              isFullHeight={false}
              className={'flex flex-col gap-2'}
              listItems={overdueStepsNotificationItem}
              type={'MenuList'}
            />
          </div>
        )}
        {showSteps && (
          <>
            {nextStep && overdueSteps?.length <= 0 && (
              <StackedList
                isFullHeight={false}
                className={'flex flex-col gap-2'}
                listItems={notificationItem}
                type={'MenuList'}
                onClickItem={
                  notificationItem.length > 0
                    ? notificationItem[0].onActionClick
                    : undefined
                }
              />
            )}

            {timeline && (
              <Steps
                items={timelineSteps(
                  timeline,
                  (a, b) => onView(a, b),
                  false,
                  isOnline,
                  // @ts-ignore
                  undefined,
                  nextStep?.title,
                  isOnStipend
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
                        undefined,
                        '',
                        isOnStipend
                      ).length && i + 1 <= completedSteps?.length
                        ? '#26ACAF'
                        : '#D4EEEF',
                    width: width / stepperCount,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Dialog
        fullScreen
        visible={showOverdueSteps}
        position={DialogPosition.Full}
      >
        <OverdueSteps
          overdueSteps={overdueSteps}
          practitioner={practitioner}
          setShowOverdueSteps={setShowOverdueSteps}
        />
      </Dialog>
      <Dialog
        fullScreen
        visible={showOnboardingNotCompleted}
        position={DialogPosition.Full}
      >
        <OnboardingNotCompleted
          practitioner={practitioner}
          starterLicenseDate={starterLicenseDate}
          setShowOnboardingNotCompleted={setShowOnboardingNotCompleted}
          isRemoveTrainee={starterLicenseDate < fourWeeksAgo}
        />
      </Dialog>
    </BannerWrapper>
  );
};
