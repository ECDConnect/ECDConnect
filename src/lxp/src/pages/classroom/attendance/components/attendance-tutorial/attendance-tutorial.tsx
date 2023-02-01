import { getAvatarColor, useDialog } from '@ecdlink/core';
import {
  Alert,
  AttendanceListDataItem,
  AttendanceStatus,
  BannerWrapper,
  Button,
  Divider,
  SearchDropDown,
  Typography,
  Card,
  DialogPosition,
  ActionModal,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './attendance-tutorial.styles';
import { AttendanceTutorialProps } from './attendance-tutorial.types';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import walktroughImage from '../../../../../assets/walktroughImage.png';

export const AttendanceTutorial = ({
  onComplete,
  onClose,
}: AttendanceTutorialProps) => {
  const dialog = useDialog();
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
  const history = useHistory();
  const [attendanceWalktrough, setAttendanceWalktrough] = useState(false);

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

  const handleAttendanceTutorial = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          // icon={'InformationCircleIcon'}
          customIcon={
            <img src={walktroughImage} alt="profile" className="mb-2" />
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Want to learn how to track attendance on Funda App?`}
          actionButtons={[
            {
              text: 'Yes, help me!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              // isLoading,
              // disabled: isLoading,
              onClick: () => {
                history.push(ROUTES.ATTENDANCE_TUTORIAL_WALKTROUGH);
                submit();
              },
              leadingIcon: 'ChevronRightIcon',
            },
            {
              text: 'No, skip',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              // isLoading,
              // disabled: isLoading,
              onClick: cancel,
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
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
        <Card className="bg-uiBg w-full rounded-2xl p-4">
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
            className={'mt-2 max-h-10 w-11/12'}
            iconPosition={'start'}
            onClick={handleAttendanceTutorial}
            // onClick={() => history.push(ROUTES.ATTENDANCE_TUTORIAL_WALKTROUGH)}
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
      {/* <AttendanceListItem
        className={'bg-white'}
        item={attendanceItem}
        onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
          updateItemAttendance(currentAttendanceItem)
        }
      />
      <AttendanceListItem
        className={'bg-white'}
        item={attendanceItem2}
        onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
          updateItemAttendance(currentAttendanceItem)
        }
      /> */}
      <div className={'bg-uiBg px-4 pt-2'}>
        {!displayTutorialComplete && (
          <Alert title={attendanceBadgeTutorialMessage} type={'info'} />
        )}
        {displayTutorialComplete && (
          <Alert
            title={'Good job, you’re ready to start tracking!'}
            type={'success'}
          />
        )}
        <Typography
          className={'mt-4'}
          color={'textDark'}
          type={'body'}
          weight={'bold'}
          text={
            'How can I see and mark attendance for children from other playgroups?'
          }
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
            selectedOptions={[
              { label: 'Playgroup', value: 'Playgroup', id: '1' },
            ]}
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
