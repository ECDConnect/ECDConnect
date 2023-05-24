import { useDialog } from '@ecdlink/core';
import { ComponentBaseProps, DialogPosition } from '@ecdlink/ui';
import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { programmeSelectors } from '@store/programme';
import { DailyRoutine } from './components/daily-routine/daily-routine';
import ROUTES from '@routes/routes';
import { useState } from 'react';
import { useHolidays } from '@/hooks/useHolidays';

interface ProgrammeDashboardProps {
  programmeStartDate: Date | undefined;
}

export const ProgrammeDashboard: React.FC<ProgrammeDashboardProps> = ({
  programmeStartDate,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();

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

  const handleAddProgramme = () => {
    if (isOnline) {
      history.push(ROUTES.PROGRAMMES.THEME);
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <DailyRoutine
      programme={currentProgramme}
      currentDailyProgramme={currentDailyProgramme}
      setSelectedDate={setSelectedDate}
      selectedDate={selectedDate}
      isHoliday={isHoliday}
    />
  );
};

export default ProgrammeDashboard;
