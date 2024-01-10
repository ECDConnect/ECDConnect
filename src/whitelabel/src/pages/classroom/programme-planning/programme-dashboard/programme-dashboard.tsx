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

  const currentProgramme = useSelector(programmeSelectors.getTodaysProgramme());
  const programmes = useSelector(programmeSelectors.getProgrammes);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const handleViewProgrammeSummary = () => {
    history.push(ROUTES.PROGRAMMES.SUMMARY, {
      variation: 'view',
    });
  };

  if (programmes.length === 0)
    return (
      <IconInformationIndicator
        title={'You don’t have any programmes yet!'}
        subTitle={'Choose a theme to get started'}
        actions={[
          {
            id: 'gtm-add-programme',
            text: 'New programme',
            textColor: 'white',
            icon: 'PlusIcon',
            iconPosition: 'start',
            type: 'filled',
            color: 'primary',
            onClick: handleAddProgramme,
          },
        ]}
      />
    );

  // Check no theme message
  // if (!currentDailyProgramme)
  //   return (
  //     <div className={'flex flex-col items-center justify-center'}>
  //       <IconInformationIndicator
  //         title={'You don’t have any activities planned for this period.'}
  //         subTitle={'Choose a theme to get started'}
  //         actions={[
  //           {
  //             id: 'gtm-add-programme',
  //             text: 'New programme',
  //             textColor: 'white',
  //             icon: 'PlusIcon',
  //             iconPosition: 'start',
  //             type: 'filled',
  //             color: 'primary',
  //             onClick: handleAddProgramme,
  //           },
  //         ]}
  //       />

  //       <Typography
  //         type="body"
  //         className="mt-4"
  //         weight="skinny"
  //         color={'textMid'}
  //         fontSize="14"
  //         text={'Or see programmes you have already planned:'}
  //       />

  //       <Button
  //         className={'mt-4 w-1/2'}
  //         type={'outlined'}
  //         color={'primary'}
  //         onClick={handleViewProgrammeSummary}
  //         size={'small'}
  //       >
  //         {renderIcon('CalendarIcon', 'h-5 w-5 text-primary')}
  //         <Typography
  //           type={'small'}
  //           color={'primary'}
  //           text={'Programme summary'}
  //         />
  //       </Button>
  //     </div>
  //   );

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
