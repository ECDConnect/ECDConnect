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
import * as styles from './walktrough-tutorial.styles';
import { AttendanceTutorialProps } from './walktrough-tutorial.types';
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  TooltipRenderProps,
} from 'react-joyride';
import WlaktroughImage from '../../../../../../assets/walktroughImage.png';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

const tabItems: TabItem[] = [
  {
    title: 'Attendance',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
  {
    title: 'Children',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
  {
    title: 'Programme',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
  {
    title: 'Resources',
    initActive: false,
    child: (
      <div className={'flex gap-12 p-4'}>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="successMain" text={'6'} />
          <Typography type={'h4'} color="textDark" text={'Present'} />
        </div>
        <div className="flex items-center gap-2">
          <Typography type={'h2'} color="textDark" text={'0'} />
          <Typography type={'body'} color="textDark" text={'Absent'} />
        </div>
      </div>
    ),
  },
];

export const WalktroughTutorial = ({
  onComplete,
  onClose,
}: AttendanceTutorialProps) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const tutorialCompleteClicks = 3;
  const tutorialResetClicks = 4;
  const [walktroughCount, setWalktroughCount] = useState(0);
  console.log({ walktroughCount });
  const [attendanceStatus, setAttendanceStatus] = useState(true);
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
    status: AttendanceStatus.Present,
    avatarColor: getAvatarColor(),
  });

  console.log({ attendanceStatus });

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
    console.log({ currentAttendanceItem });
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
      spotlightClicks: attendanceStatus ? true : false,
    },
    {
      target: '#attendance-list-alone',
      content: 'Now tap again to mark Jane present.',
      placement: 'bottom-end',
      offset: 10,
      spotlightClicks: attendanceStatus ? false : true,
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
        {console.log({
          step,
          index,
          backProps,
          continuous,
          skipProps,
          isLastStep,
        })}
        <Card
          className="rounded-2xl p-6"
          // border={false}
          // maxWidth={420}
          // minWidth={290}
          // overflow="hidden"
          // radius="md"
          // variant="white"
        >
          <div>
            {step.content && (
              <div className="flex items-center gap-2 align-middle">
                <img src={WlaktroughImage} alt="walktrough profile" />
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
          </div>
        </Card>
      </div>
    );
  }

  // const handleJoyrideCallback = () => {
  //   setWalktroughCount((prevState) => prevState + 1);
  // };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (index) {
      setWalktroughCount(index);
    }

    if (finishedStatuses.includes(status)) {
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
      // className={styles.bannerContentWrapper}
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
          // run={true}
          scrollToFirstStep
          showProgress
          showSkipButton
          // stepIndex={stepIndex}
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
        {/* {!displayTutorialComplete && (
          <Alert title={attendanceBadgeTutorialMessage} type={'info'} />
        )}
        {displayTutorialComplete && (
          <Alert
            title={'Good job, you’re ready to start tracking!'}
            type={'success'}
          />
        )} */}
        <div id="attendance-list">
          <AttendanceListItem
            className={'bg-successBg mb-1'}
            item={attendanceItem}
            onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
              updateItemAttendance(currentAttendanceItem)
            }
          />

          <div id="attendance-list-alone">
            {/* {(walktroughCount === 0 ||
              walktroughCount === 1 ||
              walktroughCount === 3) && ( */}
            <AttendanceListItem
              className={
                attendanceStatus ? 'bg-successBg mb-1' : 'bg-errorBg mb-1'
              }
              item={attendanceItem2}
              onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) => {
                console.log({ currentAttendanceItem });
                updateItemAttendance(currentAttendanceItem);
                setAttendanceStatus((prevState) => !prevState);
              }}
              walktrough={true}
            />
            {/* )} */}
          </div>

          {/* <div id="attendance-list-last">
            {walktroughCount === 3 && (
              <AttendanceListItem
                className={'bg-successBg mb-1'}
                item={attendanceItem2}
                onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
                  updateItemAttendance(currentAttendanceItem)
                }
              />
            )}
          </div> */}
        </div>
        {/* {(walktroughCount === 1 || walktroughCount === 3) && (
          <div className={'attendance-list-alone'}>
            <AttendanceListItem
              className={'bg-successBg mb-1'}
              item={attendanceItem}
              onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
                updateItemAttendance(currentAttendanceItem)
              }
            />
          </div>
        )} */}
        {/* {walktroughCount !== 3 && (
          <div className={'attendance-list-alone'}>
            <AttendanceListItem
              className={'bg-successBg mb-1'}
              item={attendanceItem2}
              onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
                updateItemAttendance(currentAttendanceItem)
              }
            />
          </div>
        )} */}
        {/* <div id="attendance-list-error">
          {walktroughCount === 2 && (
            <AttendanceListItem
              className={'bg-errorBg'}
              item={attendanceItem2}
              onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
                updateItemAttendance(currentAttendanceItem)
              }
            />
          )}
        </div> */}

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
