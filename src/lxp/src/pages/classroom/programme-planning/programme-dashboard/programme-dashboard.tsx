import { useDialog } from '@ecdlink/core';
import { ComponentBaseProps, DialogPosition } from '@ecdlink/ui';
import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { programmeSelectors } from '@store/programme';
import { IconInformationIndicator } from '../components/icon-information-indicator/icon-information-indicator';
import { DailyRoutine } from './components/daily-routine/daily-routine';
import ROUTES from '@routes/routes';
import { useState } from 'react';

export const ProgrammeDashboard: React.FC<ComponentBaseProps> = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();

  const programmes = useSelector(programmeSelectors.getProgrammes);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentProgramme = useSelector(
    programmeSelectors.getProgrammeByDate(new Date(selectedDate))
  );
  const currentDailyProgramme = currentProgramme?.dailyProgrammes.find(
    (dailyRoutine) => isSameDay(new Date(dailyRoutine.dayDate), selectedDate)
  );

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
    />
  );
};

export default ProgrammeDashboard;
