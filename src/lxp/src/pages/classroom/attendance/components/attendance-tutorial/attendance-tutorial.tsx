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
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../../../../../hooks/useOnlineStatus';
import * as styles from './attendance-tutorial.styles';
import { AttendanceTutorialProps } from './attendance-tutorial.types';

export const AttendanceTutorial = ({ onComplete, onClose }: AttendanceTutorialProps) => {
  const { isOnline } = useOnlineStatus();
  const tutorialCompleteClicks = 3;
  const tutorialResetClicks = 4;
  const [attendanceBadgeTutorialMessage, setAttendanceBadgeTutorialMessage] = useState<string>(
    'Tap the tick mark once to mark Amahle present.'
  );
  const [tutorialProgressClicks, setTutorialProgressClicks] = useState<number>(0);
  const [displayTutorialComplete, setDisplayTutorialComplete] = useState<boolean>(false);
  const [attendanceItem, setAttendanceItem] = useState<AttendanceListDataItem>({
    title: 'Amahle Khumalo',
    profileText: 'AM',
    attenendeeId: '1',
    status: AttendanceStatus.Unknown,
    avatarColor: getAvatarColor(),
  });

  const updateItemAttendance = (currentAttendanceItem: AttendanceListDataItem) => {
    switch (currentAttendanceItem.status) {
      case AttendanceStatus.Present:
        setAttendanceBadgeTutorialMessage('Great! Now tap the tick again to mark Amahle absent.');
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      case AttendanceStatus.Absent:
        setAttendanceBadgeTutorialMessage('Tap one more time if you need to mark them present.');
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      case AttendanceStatus.Unknown:
        setTutorialProgressClicks(tutorialProgressClicks + 1);
        break;
      default:
        setAttendanceBadgeTutorialMessage('Tap the tick mark once to mark Amahle present.');
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

  return (
    <BannerWrapper
      size={'medium'}
      renderBorder
      showBackground={false}
      color={'primary'}
      onBack={onClose}
      title={'Taking child attendance'}
      className={styles.bannerContentWrapper}
      displayOffline={!isOnline}
    >
      <div className={'h-full p-4 bg-uiBg'}>
        <Typography
          color={'textDark'}
          type={'body'}
          weight={'bolder'}
          text={'Why take attendance daily?'}
        />
        <Typography
          className={'mt-1'}
          color={'textMid'}
          type={'body'}
          weight={'normal'}
          text={
            'To receive your monthly stipend, you need to take and submit attendance every day.'
          }
        />
        <p className={styles.paragraphStyle}>
          If you submit attendance every day in the month, you will get{' '}
          <span className={styles.boldText}>100 Top Me Up</span> points!
        </p>
        <Typography
          className={'mt-6'}
          color={'textMid'}
          type={'body'}
          weight={'normal'}
          text={
            'This record will also help when you talk to  caregivers about any attendance concerns you have.'
          }
        />
        <Typography
          className={'mt-4'}
          color={'textDark'}
          type={'body'}
          weight={'bolder'}
          text={'How can I take attendance on Funda App?'}
        />
      </div>
      <AttendanceListItem
        className={'bg-white'}
        item={attendanceItem}
        onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
          updateItemAttendance(currentAttendanceItem)
        }
      />
      <div className={'px-4 pt-2 bg-uiBg'}>
        {!displayTutorialComplete && <Alert title={attendanceBadgeTutorialMessage} type={'info'} />}
        {displayTutorialComplete && (
          <Alert title={'Good job, you’re ready to start tracking!'} type={'success'} />
        )}
        <Typography
          className={'mt-4'}
          color={'textDark'}
          type={'body'}
          weight={'bolder'}
          text={'How can I see and mark attendance for children from other playgroups?'}
        />
        <Typography
          color={'textMid'}
          type={'body'}
          weight={'normal'}
          text={
            'If a child comes on the wrong day, tap the filter button at the top of the screen to see more playgroups.'
          }
        />
        <div className={'mt-3'}>
          <SearchDropDown<any>
            displayMenuOverlay={false}
            menuItemClassName={styles.dropdownStyles}
            className={'mr-1'}
            options={[{ label: 'Playgroup', value: 'Playgroup', id: '1' }]}
            placeholder={'Playgroups'}
            pluralSelectionText={'Playgroups'}
            color={'uiMidDark'}
            selectedOptions={[{ label: 'Playgroup', value: 'Playgroup', id: '1' }]}
          />
        </div>
        <Typography
          className={'mt-3'}
          color={'textMid'}
          type={'body'}
          weight={'normal'}
          text={'Mark the child as present or absent, as shown above.'}
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

export default AttendanceTutorial;
