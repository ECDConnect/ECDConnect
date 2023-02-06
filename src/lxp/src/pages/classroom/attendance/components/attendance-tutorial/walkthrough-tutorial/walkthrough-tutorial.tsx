import { getAvatarColor } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceListItem,
  AttendanceStatus,
  BannerWrapper,
  Button,
  Divider,
  Typography,
  Card,
  SliderPagination,
  TabList,
  TabItem,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './walkthrough-tutorial.styles';
import {
  AttendanceTutorialProps,
  tabItems,
} from './walkthrough-tutorial.types';
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  TooltipRenderProps,
} from 'react-joyride';
import WlaktroughImage from '../../../../../../assets/walktroughImage.png';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { practitionerSelectors } from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@services/PractitionerService';

export const WalkthroughTutorial = ({
  onComplete,
  onClose,
}: AttendanceTutorialProps) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const tutorialCompleteClicks = 3;
  const tutorialResetClicks = 4;
  const [attendanceStatus, setAttendanceStatus] = useState(true);
  const [tutorialProgressClicks, setTutorialProgressClicks] =
    useState<number>(0);
  const [attendanceItem, setAttendanceItem] = useState<AttendanceListDataItem>({
    title: 'Amahle Khumalo',
    profileText: 'AM',
    attenendeeId: '1',
    status: AttendanceStatus.Present,
    avatarColor: getAvatarColor(),
  });
  const [enabledPresentButton, setEnabledPresentButton] = useState(false);

  const [attendanceItem2, setAttendanceItem2] =
    useState<AttendanceListDataItem>({
      title: 'Jane Mokoena',
      profileText: 'AM',
      attenendeeId: '1',
      status: AttendanceStatus.Present,
      avatarColor: getAvatarColor(),
    });

  const updateItemAttendance = (
    currentAttendanceItem: AttendanceListDataItem
  ) => {
    switch (currentAttendanceItem.status) {
      case AttendanceStatus.Present:
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      case AttendanceStatus.Absent:
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      case AttendanceStatus.Unknown:
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      default:
    }
  };

  useEffect(() => {
    validateTutorial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialProgressClicks]);

  const validateTutorial = () => {
    if (tutorialProgressClicks === tutorialCompleteClicks) {
      setAttendanceItem({
        title: 'Amahle Khumalo',
        profileText: 'AM',
        attenendeeId: '1',
        status: AttendanceStatus.Present,
        avatarColor: getAvatarColor(),
      });
    } else if (tutorialProgressClicks === tutorialResetClicks) {
      setAttendanceItem({
        title: 'Amahle Khumalo',
        profileText: 'AM',
        attenendeeId: '1',
        status: AttendanceStatus.Unknown,
        avatarColor: getAvatarColor(),
      });
      setTutorialProgressClicks(0);
    }
  };

  const steps: Step[] = [
    {
      target: '#attendance-list',
      content: 'All children are automatically marked present',
      placement: 'bottom-end',
      offset: 10,
      disableBeacon: true,
    },
    {
      target: '#attendance-list-alone',
      content: 'Tap anywhere on this block to mark Jane absent today',
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: !!attendanceStatus,
    },
    {
      target: '#attendance-list-alone',
      content: 'Now tap again to mark Jane present.',
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: !attendanceStatus,
    },
    {
      target: '#attendance-list-alone',
      content: "Great, you're ready to start!",
      placement: 'bottom-end',
      offset: 10,
    },
  ];

  function Tooltip({
    backProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    skipProps,
    step,
    tooltipProps,
  }: TooltipRenderProps) {
    return (
      <div {...tooltipProps} className="ml-2">
        <Card className="rounded-2xl p-6">
          <div>
            {step.content && (
              <div className="flex items-center gap-2 align-middle">
                <img src={WlaktroughImage} alt="walkthrough profile" />
                <Typography
                  color={'textDark'}
                  type={'h2'}
                  weight={'normal'}
                  text={String(step?.content)}
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-end gap-4">
            <SliderPagination
              totalItems={4}
              activeIndex={index}
              className={'p-4'}
            />
            {((!enabledPresentButton && index !== 1) ||
              (enabledPresentButton && index === 1)) && (
              <div {...primaryProps} className={'w-full'}>
                <Button
                  type="filled"
                  color="primary"
                  className={'w-6/12'}
                  icon={'SaveIcon'}
                  onClick={() => {}}
                >
                  {renderIcon('XIcon', `w-5 h-5 text-white mr-2`)}
                  <Typography
                    type="help"
                    className="mr-2"
                    color="white"
                    text={isLastStep ? 'Close' : 'Next'}
                  />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      await new PractitionerService(
        userAuth?.auth_token!
      ).UpdatePractitionerProgress(practitioner?.userId!, 4.0);
      history.push(ROUTES.CLASSROOM);
    }
  };

  return (
    <BannerWrapper
      size={'medium'}
      renderBorder
      showBackground={false}
      color={'primary'}
      onBack={onClose}
      title={'Classroom'}
      displayOffline={!isOnline}
      displayHelp={true}
      onHelp={() => {}}
    >
      <TabList
        className="bg-uiBg"
        tabItems={tabItems}
        setSelectedIndex={0}
        tabSelected={(tab: TabItem, tabIndex: number) => 0}
      />
      <div id="test" className="h-0" />
      <div className={'bg-uiBg px-4 pt-2'}>
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          scrollToFirstStep
          showProgress
          showSkipButton
          disableOverlayClose
          spotlightPadding={10}
          steps={steps}
          styles={{
            options: {
              arrowColor: '#e3ffeb',
              backgroundColor: '#e3ffeb',
              overlayColor: 'rgba(64, 61, 60, 1)',
              primaryColor: '#000',
              textColor: '#004a14',
              width: 900,
              zIndex: 1000,
            },
          }}
          tooltipComponent={Tooltip}
        />
        <div id="attendance-list">
          <AttendanceListItem
            className={'bg-successBg mb-1'}
            item={attendanceItem}
            onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
              updateItemAttendance(currentAttendanceItem)
            }
          />

          <div id="attendance-list-alone">
            <AttendanceListItem
              className={
                attendanceStatus ? 'bg-successBg mb-1' : 'bg-errorBg mb-1'
              }
              item={attendanceItem2}
              onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) => {
                updateItemAttendance(currentAttendanceItem);
                setAttendanceStatus((prevState) => !prevState);
                setEnabledPresentButton((prevState) => !prevState);
              }}
              walkthrough={true}
            />
            {/* )} */}
          </div>
        </div>
        <div className={'pt-2.5'}>
          <Divider />
        </div>
        <Button
          color={'primary'}
          type={'filled'}
          onClick={onComplete}
          className={styles.closeButton}
        >
          <Typography
            color={'white'}
            type={'help'}
            weight={'normal'}
            text={'Start taking attendance'}
          />
        </Button>
      </div>
    </BannerWrapper>
  );
};

export default WalkthroughTutorial;
