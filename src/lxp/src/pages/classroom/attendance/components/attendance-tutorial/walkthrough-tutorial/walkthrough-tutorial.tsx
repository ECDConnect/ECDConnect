import { getAvatarColor } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceListItem,
  AttendanceStatus,
  BannerWrapper,
  Button,
  Divider,
  Typography,
  TabList,
  TabItem,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './walktrough-tutorial.styles';
import { AttendanceTutorialProps, tabItems } from './walktrough-tutorial.types';
import { useAppContext } from '@/walkthrougContext';
import { useSetState } from 'react-use';
import AttendanceWrapper from '@/pages/classroom/attendance/components/attendance-wrapper/AttendanceWrapper';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';

export const WalkthroughTutorial = ({
  onComplete,
  onClose,
}: AttendanceTutorialProps) => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const tutorialCompleteClicks = 2;
  const tutorialResetClicks = 3;
  const [tutorialProgressClicks, setTutorialProgressClicks] =
    useState<number>(0);
  const [attendanceItem, setAttendanceItem] = useState<AttendanceListDataItem>({
    title: 'Amahle Khumalo',
    profileText: 'AM',
    attenendeeId: '1',
    status: AttendanceStatus.Present,
    avatarColor: getAvatarColor(),
  });

  const [attendanceItem2] = useState<AttendanceListDataItem>({
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
      default:
    }
  };

  useEffect(() => {
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
          status: AttendanceStatus.Present,
          avatarColor: getAvatarColor(),
        });
        setTutorialProgressClicks(0);
      }
    };

    validateTutorial();
  }, [tutorialProgressClicks]);

  const {
    setState,
    state: { tourActive, stepIndex },
  } = useAppContext();

  useSetState(() => {
    if (!tourActive) {
      setState({ run: true, stepIndex: 0 });
    }
  });

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
      <AttendanceWrapper />
      <TabList
        className="bg-uiBg"
        tabItems={tabItems}
        setSelectedIndex={0}
        tabSelected={(tab: TabItem, tabIndex: number) => 0}
      />
      <div id="test" className="h-0" />
      <div className={'bg-uiBg px-4 pt-2'}>
        <div id="attendance-list">
          <AttendanceListItem
            className={'bg-successBg mb-1'}
            item={attendanceItem}
            // walkthrough={true}
          />

          <div id="attendance-list-alone">
            <AttendanceListItem
              className={
                tutorialProgressClicks === 1
                  ? 'bg-errorBg mb-1'
                  : 'bg-successBg mb-1'
              }
              item={attendanceItem2}
              onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) => {
                updateItemAttendance(currentAttendanceItem);
                setState({ enableButton: true, stepIndex: stepIndex + 1 });
                if (stepIndex === 3) {
                  history.push(ROUTES.CLASSROOM.ROOT, {
                    activeTabIndex: TabsItems.ATTENDANCE,
                  });
                }
              }}
              walkthrough={true}
            />
          </div>
        </div>
        <Divider className={'pt-2.5'} />
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
