import {
  BannerWrapper,
  DialogPosition,
  Divider,
  MenuListDataItem,
  StackedList,
  Steps,
  Typography,
  Dialog,
  Button,
  renderIcon,
} from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useWindowSize } from '@reach/window-size';
import { differenceInDays, format } from 'date-fns';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { timelineSteps } from './timeline-steps';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';

interface OnboardingTraineeDashboardProps {
  setNotificationStep: any;
  setIsSmartChecklist?: any;
  practitioner?: PractitionerDto;
}

export const OnboardingTraineeDashboard: React.FC<
  OnboardingTraineeDashboardProps
> = ({ setNotificationStep, setIsSmartChecklist, practitioner }) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const today = format(new Date(), 'EEEE, d LLLL');
  const isOnStipend = practitioner?.isOnStipend;

  const { width } = useWindowSize();

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const [showSteps, setShowSteps] = useState(true);
  console.log({ timeline });
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
    undefined,
    '',
    isOnStipend
  ).filter(
    (item) =>
      item?.type !== 'completed' &&
      item?.type !== 'inProgress' &&
      item?.title !== 'SmartSpace visit from coach' &&
      item?.title !== 'SmartSpace Licence'
  );

  const extradataTimeValue = Object.values(uncompletedSteps?.[0].extraData!);

  const checkOverdueDate = differenceInDays(
    new Date(),
    new Date(extradataTimeValue[0] as Date)
  );

  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    isOnStipend
  ).filter((item) => item?.type === 'completed');

  const stepperCount = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    isOnStipend
  ).length;

  const filteredUncompletedSteps = uncompletedSteps.filter(
    (item) =>
      item?.title !== 'SmartSpace visit from coach' &&
      item?.title !== 'SmartSpace Licence' &&
      item?.title !== 'Consolidation meeting scheduled'
  );

  const [nextStep] = filteredUncompletedSteps;

  const notificationItem: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: checkOverdueDate > 0 ? 'ExclamationIcon' : 'PencilAltIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: filteredUncompletedSteps?.[0]?.title,
      titleStyle: 'text-textDark semibold',
      subTitle:
        checkOverdueDate > 0
          ? `${String(checkOverdueDate)} days overdue`
          : filteredUncompletedSteps?.[0]?.subTitle,
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: checkOverdueDate > 0 ? 'alertMain' : 'primary',
      backgroundColor: checkOverdueDate > 0 ? 'alertBg' : 'uiBg',
      onActionClick: () => setNotificationStep(nextStep?.title),
    },
  ];

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={today}
      color={'primary'}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="h-screen p-4">
        {showSteps && (
          <>
            {nextStep && (
              <StackedList
                isFullHeight={false}
                className={'flex flex-col gap-2'}
                listItems={notificationItem}
                type={'MenuList'}
              />
            )}

            {timeline && (
              <Steps
                items={timelineSteps(
                  timeline,
                  (a) => onView(a),
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
    </BannerWrapper>
  );
};
