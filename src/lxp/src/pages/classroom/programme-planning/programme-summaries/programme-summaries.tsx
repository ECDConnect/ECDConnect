import { ProgrammeDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { programmeSelectors } from '@store/programme';
import { FutureProgrammes } from '../programme-summary/components/future-programmes/future-programmes';
import ProgrammeSummary from '../programme-summary/programme-summary';
import { ProgrammeSummaryRouteState } from '../programme-summary/programme-summary.types';
import ROUTES from '@routes/routes';
import { TabsItemForPrincipal } from '../../class-dashboard/class-dashboard.types';

export const ProgrammeSummaries: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state } = useLocation<ProgrammeSummaryRouteState>();
  const todaysProgramme = useSelector(programmeSelectors.getTodaysProgramme());
  const variation = state.variation;
  const idProgramme = useSelector(
    programmeSelectors.getProgrammeById(state?.programmeId)
  );
  const noPlan = state?.programmeId === undefined;
  const programme = idProgramme || todaysProgramme;

  const handleBack = () => {
    history.replace(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItemForPrincipal.CLASSES,
    });
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={
        variation === 'create' ? 'Plan your programme' : 'Programme summary'
      }
      color="primary"
      onBack={handleBack}
      displayOffline={!isOnline}
    >
      {variation === 'view' && (
        <FutureProgrammes
          programme={programme}
          noPlan={noPlan}
          onSummarySelected={(selectedProgramme?: ProgrammeDto) => {
            history.replace(ROUTES.PROGRAMMES.SUMMARY, {
              programmeId: selectedProgramme?.id,
              variation: 'view',
            });
          }}
        />
      )}
      <ProgrammeSummary
        programme={programme}
        noPlan={noPlan && !programme}
        variation={variation}
      />
    </BannerWrapper>
  );
};
