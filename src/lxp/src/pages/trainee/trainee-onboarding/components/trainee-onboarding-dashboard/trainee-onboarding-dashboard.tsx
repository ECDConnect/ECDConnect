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
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import OnboardingInfoPage from '../onboarding-info-page/onboarding-info-page';
import { timelineSteps } from './timeline-steps';
import { useSelector } from 'react-redux';
import { traineeSelectors } from '@/store/trainee';
import ROUTES from '@/routes/routes';
import { CoachVisitInfo } from './components/coach-visit-info';
import PositiveBonusEmoticon from '../../../../../assets/positive-bonus-emoticon.png';
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

  const { width } = useWindowSize();
  const [showInfo, setShowInfo] = useState(false);

  const displayTutorial = (type?: string) => {
    setShowInfo(true);
  };

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const [showSteps, setShowSteps] = useState(true);
  const [showCoachVisit, setShowCoachVisit] = useState(false);

  const onView = async (notificationStep: string) => {
    if (notificationStep === 'Fill in the SmartSpace checklist') {
      setIsSmartChecklist(true);
    }

    if (notificationStep === 'SmartSpace visit from coach') {
      setShowCoachVisit(true);
    }

    setNotificationStep(notificationStep);
  };
  const isOnStipend = practitioner?.isOnStipend;

  const steps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    timeline?.consolidationMeetingStatus,
    isOnStipend
  );

  const uncompletedSteps = steps?.filter(
    (item) =>
      item?.type !== 'completed' &&
      item?.type !== 'inProgress' &&
      item?.title !== 'SmartSpace Licence'
  );

  const completedSteps = steps?.filter(
    (item) =>
      item?.type === 'completed' ||
      item?.title === 'Consolidation meeting attended'
  );

  const stepperCount = steps?.length;

  const extradataTimeValue =
    uncompletedSteps?.length > 0 &&
    Object.values(uncompletedSteps?.[0]?.extraData!);

  const checkOverdueDate = differenceInDays(
    new Date(),
    new Date(
      extradataTimeValue ? (extradataTimeValue?.[0] as Date) : new Date()
    )
  );

  useEffect(() => {
    if (
      (practitioner?.isOnStipend && completedSteps?.length === 8) ||
      (practitioner?.isOnStipend !== true && completedSteps.length === 7)
    ) {
      setShowSteps(false);
    }
  }, [completedSteps.length, practitioner?.isOnStipend]);

  const filteredUncompletedSteps = uncompletedSteps.filter(
    (item) =>
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
      onBack={() => history.push(ROUTES.DASHBOARD)}
      displayHelp={true}
      onHelp={displayTutorial}
      displayOffline={!isOnline}
      className="h-screen pb-16"
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
        {((practitioner?.isOnStipend && completedSteps.length === 8) ||
          (practitioner?.isOnStipend !== true &&
            completedSteps.length === 7)) && (
          <>
            <div className="bg-successBg grid grid-cols-1 justify-center gap-4 rounded-2xl p-4">
              <div className="flex">
                <div className="flex justify-center">
                  <img
                    src={PositiveBonusEmoticon}
                    alt="developing well"
                    className="mt-3 ml-2 mr-2 h-12 w-16"
                  />
                </div>
                <div className="ml-3">
                  <div className="flex justify-center">
                    <Typography
                      type="h3"
                      weight="bold"
                      color={'successDark'}
                      text={`Well done! You have your SmartSpace licence.`}
                      fontSize="18"
                      className="pt-2"
                    />
                  </div>
                  <div className="mt-1 flex justify-center">
                    <Typography
                      type="body"
                      color={'textDark'}
                      text={`Use Funda App to set up your profile and manage your classroom.`}
                      fontSize="14"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Button
                type="filled"
                color="primary"
                className="mt-4 mb-2 w-full"
                onClick={() => {
                  history.push(ROUTES.PRACTITIONER.PROFILE.EDIT);
                  //  window.location.reload();
                }}
              >
                {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
                <Typography
                  type={'help'}
                  text={'Complete your Funda App profile'}
                  color={'white'}
                />
              </Button>
            </div>
            <div className="mt-2 space-y-4">
              <div>
                <div>
                  <Button
                    type="outlined"
                    color="primary"
                    className={'mt-1 mb-4 w-full'}
                    onClick={() => setShowSteps((prevState) => !prevState)}
                    icon={!showSteps ? 'EyeOffIcon' : 'EyeIcon'}
                    text={
                      !showSteps
                        ? 'See completed sections'
                        : 'Hide completed sections'
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {showSteps && (
          <>
            {((practitioner?.isOnStipend && completedSteps?.length < 8) ||
              (practitioner?.isOnStipend !== true &&
                completedSteps.length < 7)) && (
              <StackedList
                isFullHeight={false}
                className={'flex flex-col gap-2'}
                listItems={notificationItem}
                type={'MenuList'}
              />
            )}
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
                  undefined,
                  nextStep?.title,
                  timeline?.consolidationMeetingStatus,
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
                        timeline?.consolidationMeetingStatus,
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
        fullScreen={false}
        visible={showInfo}
        position={DialogPosition.Full}
        stretch={true}
      >
        <OnboardingInfoPage setShowInfo={setShowInfo} />
      </Dialog>
      <Dialog
        fullScreen={false}
        visible={showCoachVisit}
        position={DialogPosition.Full}
        stretch={true}
      >
        <CoachVisitInfo setShowCoachVisit={setShowCoachVisit} />
      </Dialog>
    </BannerWrapper>
  );
};
