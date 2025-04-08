import { getAvatarColor, MoreInformationTypeEnum } from '@ecdlink/core';
import {
  AttendanceListDataItem,
  AttendanceStatus,
  Button,
  Typography,
  Card,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { AttendanceTutorialProps } from './attendance-tutorial.types';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '@/walkthrougContext';
import { InfoPage } from '@/pages/business/money/submit-income-statements/components/info-page';
import { useTenant } from '@/hooks/useTenant';

export const AttendanceTutorial = ({ onClose }: AttendanceTutorialProps) => {
  const tutorialCompleteClicks = 3;
  const tutorialResetClicks = 4;
  const [tutorialProgressClicks, setTutorialProgressClicks] =
    useState<number>(0);
  const [, setDisplayTutorialComplete] = useState<boolean>(false);
  const [, setAttendanceItem] = useState<AttendanceListDataItem>({
    title: 'Amahle Khumalo',
    profileText: 'AM',
    attenendeeId: '1',
    status: AttendanceStatus.Present,
    avatarColor: getAvatarColor(),
  });
  const history = useHistory();

  const { setState } = useAppContext();

  const { tenant } = useTenant();

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
        status: AttendanceStatus.Present,
        avatarColor: getAvatarColor(),
      });
      setTutorialProgressClicks(0);
      setDisplayTutorialComplete(false);
    }
  };

  return (
    <InfoPage
      title="Taking child attendance"
      section={MoreInformationTypeEnum.TakingChildAttendance}
      closeText="Start taking attendance"
      closeIcon=""
      onClose={onClose}
    >
      <Card className="bg-uiBg flex w-full flex-col justify-center rounded-2xl p-4">
        <Typography
          className="mt-4"
          color="textDark"
          type="h2"
          text={`How can I take attendance ${
            tenant?.applicationName ? `on ${tenant.applicationName}` : ''
          }?`}
        />
        <Typography
          className="mt-4"
          color="textMid"
          type="body"
          text={`Tap the button below to see how to use this part ${
            tenant?.applicationName ? `of ${tenant.applicationName}` : ''
          }.`}
        />
        <Button
          text="Start walkthrough"
          icon="ArrowCircleRightIcon"
          type="filled"
          color="quatenary"
          textColor="white"
          className="mt-4 max-h-10 shadow-lg"
          iconPosition="start"
          onClick={handleClickStart}
        />
      </Card>
    </InfoPage>
  );
};

export default AttendanceTutorial;
