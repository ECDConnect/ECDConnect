import { useDialog } from '@ecdlink/core';
import { Button, ComponentBaseProps, DialogPosition, renderIcon, Typography } from '@ecdlink/ui';
import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { programmeSelectors } from '@store/programme';
import { IconInformationIndicator } from '../components/icon-information-indicator/icon-information-indicator';
import { DailyRoutine } from './components/daily-routine/daily-routine';

export const ProgrammeDashboard: React.FC<ComponentBaseProps> = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();

  const currentProgramme = useSelector(programmeSelectors.getTodaysProgramme());
  const programmes = useSelector(programmeSelectors.getProgrammes);
  const currentDailyProgramme = currentProgramme?.dailyProgrammes.find((dailyRoutine) =>
    isSameDay(new Date(dailyRoutine.dayDate), new Date())
  );

  const handleAddProgramme = () => {
    if (isOnline) {
      history.push('/programmes/theme');
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

  const handleViewProgrammeSummary = () => {
    history.push('/programmes/summary', { variation: 'view' });
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

  if (!currentDailyProgramme)
    return (
      <div className={'flex flex-col items-center justify-center'}>
        <IconInformationIndicator
          title={'You don’t have any activities planned for this period.'}
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

        <Typography
          type="body"
          className="mt-4"
          weight="skinny"
          color={'textMid'}
          fontSize="14"
          text={'Or see programmes you have already planned:'}
        />

        <Button
          className={'w-1/2 mt-4'}
          type={'outlined'}
          color={'primary'}
          onClick={handleViewProgrammeSummary}
          size={'small'}
        >
          {renderIcon('CalendarIcon', 'h-5 w-5 text-primary')}
          <Typography type={'small'} color={'primary'} text={'Programme summary'} />
        </Button>
      </div>
    );

  return (
    <DailyRoutine programme={currentProgramme} currentDailyProgramme={currentDailyProgramme} />
  );
};

export default ProgrammeDashboard;
