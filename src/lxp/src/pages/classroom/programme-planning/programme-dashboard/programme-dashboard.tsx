import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { programmeSelectors } from '@store/programme';
import { DailyRoutine } from './components/daily-routine/daily-routine';
import { useEffect, useState } from 'react';
import { useHolidays } from '@/hooks/useHolidays';
import ProgrammeWrapper from './walkthrough/programme-wrapper';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import walktroughImage from '@/assets/walktroughImage.png';
import { LocalStorageKeys, useDialog } from '@ecdlink/core';
import { ActionModal, DialogPosition, Typography } from '@ecdlink/ui';
import { useAppContext } from '@/walkthrougContext';

interface ProgrammeDashboardProps {
  programmeStartDate: Date | undefined;
}

export const ProgrammeDashboard: React.FC<ProgrammeDashboardProps> = ({
  programmeStartDate,
}) => {
  // const history = useHistory();
  // const { isOnline } = useOnlineStatus();

  const completeProgrammeTutorial = () => {
    setStorageItem(true, LocalStorageKeys.programmeTutorialComplete);
  };

  const [selectedDate, setSelectedDate] = useState(
    programmeStartDate || new Date()
  );

  const currentProgramme = useSelector(
    programmeSelectors.getProgrammeByDate(new Date(selectedDate))
  );
  const currentDailyProgramme = currentProgramme?.dailyProgrammes.find(
    (dailyRoutine) => isSameDay(new Date(dailyRoutine?.dayDate), selectedDate)
  );
  const holiday = useHolidays();
  const isHoliday = holiday?.isHoliday(selectedDate);
  const dialog = useDialog();

  const {
    setState,
    state: { run, stepIndex },
  } = useAppContext();

  const programmeTutorialTaken = getStorageItem(
    LocalStorageKeys.programmeTutorialComplete
  );

  const handleClickStart = () => {
    setState({ run: true, tourActive: true, stepIndex: 0 });
  };

  useEffect(() => {
    //if (programmeTutorialTaken === undefined && !programmeTutorialTaken) {
    // if (!run) {
    //   showProgrammeWalkthrough();
    // }
    //}
  }, [programmeTutorialTaken]);

  // const handleAddProgramme = () => {
  //   if (isOnline) {
  //     history.push(ROUTES.PROGRAMMES.THEME);
  //   } else {
  //     showOnlineOnly();
  //   }
  // };

  // const showOnlineOnly = () => {
  //   dialog({
  //     position: DialogPosition.Bottom,
  //     render: (onSubmit) => {
  //       return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
  //     },
  //   });
  // };

  const handleDeclineWalkthrough = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (submit, cancel) => (
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={walktroughImage} alt="profile" className="mb-2" />
              <Typography
                text="Ok, you can always get  help by tapping the question mark at the top of the screen!"
                type={'body'}
                color={'textDark'}
                align="center"
                className="mt-2"
              />
            </div>
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          actionButtons={[
            {
              text: 'Close',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                submit();
                setStorageItem(
                  true,
                  LocalStorageKeys.programmeTutorialComplete
                );
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      ),
    });
  };

  const showProgrammeWalkthrough = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <ActionModal
          customIcon={
            <img src={walktroughImage} alt="profile" className="mb-2" />
          }
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Hello!  Would you like me to show you how to use this section?`}
          detailText={`I'll show you how to pick a theme and plan a programme.`}
          actionButtons={[
            {
              text: 'Yes, help me!',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                cancel();
                handleClickStart();
              },
              leadingIcon: 'ChevronRightIcon',
            },
            {
              text: 'No, skip',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                handleDeclineWalkthrough();
              },
              leadingIcon: 'ClockIcon',
            },
          ]}
        />
      ),
    });
  };

  return (
    <>
      <ProgrammeWrapper />
      <DailyRoutine
        programme={currentProgramme}
        currentDailyProgramme={currentDailyProgramme}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        isHoliday={isHoliday}
      />
    </>
  );
};

export default ProgrammeDashboard;
