import { getAvatarColor } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStatus,
  BannerWrapper,
  Button,
  Typography,
  Card,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './attendance-tutorial.styles';
import { AttendanceTutorialProps } from './attendance-tutorial.types';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '@/walkthrougContext';

export const AttendanceTutorial = ({
  onComplete,
  onClose,
}: AttendanceTutorialProps) => {
  const { isOnline } = useOnlineStatus();
  const tutorialCompleteClicks = 3;
  const tutorialResetClicks = 4;
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
  const history = useHistory();

  const { setState } = useAppContext();

  const handleClickStart = () => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
    history.push(ROUTES.ATTENDANCE_TUTORIAL_WALKTHROUGH);
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
      <div className={'h-full bg-white p-4'}>
        <Card className="bg-uiBg flex w-full flex-col justify-center rounded-2xl p-4">
          <Typography
            className={'mt-4'}
            color={'textDark'}
            type={'h2'}
            text={'How can I take attendance on Funda App?'}
          />
          <Typography
            className={'mt-4'}
            color={'textMid'}
            type={'body'}
            text={'How can I take attendance on Funda App?'}
          />
          <Button
            text={`Start walkthrough`}
            icon={'ArrowCircleRightIcon'}
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            className={'mt-4 max-h-10'}
            iconPosition={'start'}
            onClick={handleClickStart}
          />
        </Card>

        <Typography
          color={'textDark'}
          type={'body'}
          weight={'bold'}
          text={'Why take attendance daily?'}
          className="mt-2"
        />
        <Typography
          className={'mt-4'}
          color={'textMid'}
          type={'body'}
          weight={'normal'}
          text={
            'To receive your monthly stipend, you need to take and submit attendance every day.'
          }
        />
        <Typography
          className={'mt-6'}
          color={'textMid'}
          type={'body'}
          weight={'normal'}
          text={
            'This record will also help when you talk to  caregivers about any attendance concerns you have.'
          }
        />
      </div>
      <div className={'bg-uiBg px-4 pt-2'}>
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
