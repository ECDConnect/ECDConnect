import { getAvatarColor } from '@ecdlink/core';
import {
  Alert,
  AttendanceListDataItem,
  AttendanceListItem,
  AttendanceStatus,
  BannerWrapper,
  Button,
  Divider,
  SearchDropDown,
  Typography,
  Card,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './walktrough-tutorial.styles';
import { AttendanceTutorialProps } from './walktrough-tutorial.types';
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  TooltipRenderProps,
} from 'react-joyride';

export const WalktroughTutorial = ({
  onComplete,
  onClose,
}: AttendanceTutorialProps) => {
  const { isOnline } = useOnlineStatus();
  const tutorialCompleteClicks = 3;
  const tutorialResetClicks = 4;
  const [attendanceBadgeTutorialMessage, setAttendanceBadgeTutorialMessage] =
    useState<string>('Tap the tick mark once to mark Amahle present.');
  const [tutorialProgressClicks, setTutorialProgressClicks] =
    useState<number>(0);
  const [displayTutorialComplete, setDisplayTutorialComplete] =
    useState<boolean>(false);
  const [attendanceItem, setAttendanceItem] = useState<AttendanceListDataItem>({
    title: 'Amahle Khumalo',
    profileText: 'AM',
    attenendeeId: '1',
    status: AttendanceStatus.Unknown,
    avatarColor: getAvatarColor(),
  });

  const [attendanceItem2, setAttendanceItem2] =
    useState<AttendanceListDataItem>({
      title: 'Baby Sauro',
      profileText: 'AM',
      attenendeeId: '1',
      status: AttendanceStatus.Unknown,
      avatarColor: getAvatarColor(),
    });

  const updateItemAttendance = (
    currentAttendanceItem: AttendanceListDataItem
  ) => {
    switch (currentAttendanceItem.status) {
      case AttendanceStatus.Present:
        setAttendanceBadgeTutorialMessage(
          'Great! Now tap the tick again to mark Amahle absent.'
        );
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      case AttendanceStatus.Absent:
        setAttendanceBadgeTutorialMessage(
          'Tap one more time if you need to mark them present.'
        );
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      case AttendanceStatus.Unknown:
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      default:
        setAttendanceBadgeTutorialMessage(
          'Tap the tick mark once to mark Amahle present.'
        );
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
      setDisplayTutorialComplete(true);
    } else if (tutorialProgressClicks === tutorialResetClicks) {
      setAttendanceItem({
        title: 'Amahle Khumalo',
        profileText: 'AM',
        attenendeeId: '1',
        status: AttendanceStatus.Unknown,
        avatarColor: getAvatarColor(),
      });
      setTutorialProgressClicks(0);
      setDisplayTutorialComplete(false);
    }
  };

  const steps: Step[] = [
    {
      title: 'Hello woerld',
      target: '#test',
      content: 'This is my awesome feature!',
      placement: 'bottom-end',
      styles: {
        options: {
          beaconSize: 2,
        },
      },
    },
    {
      target: '#attendance-list',
      content: 'This another awesome feature!',
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
      <div {...tooltipProps} className="min-w-64 min-h-56 rounded-full">
        {console.log({ step, index, backProps, continuous, skipProps })}
        <Card
        // border={false}
        // maxWidth={420}
        // minWidth={290}
        // overflow="hidden"
        // radius="md"
        // variant="white"
        >
          <div className="p-xl">
            {step.title && (
              <Typography
                color={'primary'}
                type={'h2'}
                weight={'normal'}
                text={String(step?.title)}
              />
            )}
            {step.content && <Card>{step.content}</Card>}
          </div>
          <Card>
            {!isLastStep && (
              <Button
                type="filled"
                color="primary"
                className={'max-h-10 w-full'}
                icon={'SaveIcon'}
                onClick={() => {}}
              >
                <Typography
                  type="help"
                  className="mr-2"
                  color="white"
                  text={'Skip'}
                />
              </Button>
            )}
            <Divider />
            <>
              <Button
                type="filled"
                color="primary"
                className={'max-h-10 w-full'}
                icon={'SaveIcon'}
                onClick={() => {}}
              >
                <Typography
                  type="help"
                  className="mr-2"
                  color="white"
                  text={continuous ? 'next' : 'close'}
                />
              </Button>
              <Divider />
            </>
          </Card>
        </Card>
      </div>
    );
  }

  return (
    <BannerWrapper
      size={'medium'}
      renderBorder
      showBackground={false}
      color={'primary'}
      onBack={onClose}
      title={'Classroom'}
      className={styles.bannerContentWrapper}
      displayOffline={!isOnline}
      displayHelp={true}
      onHelp={() => {}}
    >
      <div id="test" className="h-0" />
      <div className={'bg-uiBg px-4 pt-2'}>
        <Joyride
          // callback={handleJoyrideCallback}
          continuous
          run={true}
          scrollToFirstStep
          showProgress
          showSkipButton
          // stepIndex={stepIndex}
          spotlightPadding={10}
          steps={steps}
          styles={{
            options: {
              arrowColor: '#e3ffeb',
              backgroundColor: '#e3ffeb',
              overlayColor: 'rgba(79, 26, 0, 0.4)',
              primaryColor: '#000',
              textColor: '#004a14',
              width: 900,
              zIndex: 1000,
            },
          }}
          tooltipComponent={Tooltip}
        />
        {!displayTutorialComplete && (
          <Alert title={attendanceBadgeTutorialMessage} type={'info'} />
        )}
        {displayTutorialComplete && (
          <Alert
            title={'Good job, you’re ready to start tracking!'}
            type={'success'}
          />
        )}
        <div id="attendance-list">
          <AttendanceListItem
            className={'bg-successBg mb-1'}
            item={attendanceItem}
            onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
              updateItemAttendance(currentAttendanceItem)
            }
          />
          <AttendanceListItem
            className={'bg-successBg mb-1'}
            item={attendanceItem2}
            onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
              updateItemAttendance(currentAttendanceItem)
            }
          />
        </div>
        <AttendanceListItem
          className={'bg-errorBg'}
          item={attendanceItem2}
          onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
            updateItemAttendance(currentAttendanceItem)
          }
        />

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

export default WalktroughTutorial;
