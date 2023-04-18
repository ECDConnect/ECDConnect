import {
  getInfantById,
  getInfantCurrentVisitSelector,
} from '@/store/infant/infant.selectors';
import { Button, LoadingSpinner } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { IntroScreen } from './activity-list/intro-screen';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { InfantProfileParams } from '../infant-profile.types';
import { RootState } from '@/store/types';
import { getPreviousVisitInformationForInfantSelector } from '@/store/visit/visit.selectors';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import {
  VisitDto,
  captureAndDownloadComponent,
  usePrevious,
} from '@ecdlink/core';
import { useWindowSize } from '@reach/window-size';
import { INFANT_PROFILE_TABS } from '..';

const HEADER_HEIGHT = 540;

export const ProgressTab = () => {
  const { height } = useWindowSize();

  const { id: infantId } = useParams<InfantProfileParams>();

  const appDispatch = useAppDispatch();

  const history = useHistory();
  const location = useLocation();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT
  );

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );
  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );
  const currentVisit = useSelector(getInfantCurrentVisitSelector);
  const previousCurrentVisit = usePrevious(currentVisit) as
    | VisitDto
    | undefined;

  const infantName = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const introScreenRef = useRef<HTMLDivElement>(null);

  const handleCaptureClick = () => {
    if (introScreenRef.current) {
      captureAndDownloadComponent(introScreenRef.current, 'summary');
    }
  };

  useLayoutEffect(() => {
    if (
      (!previousCurrentVisit ||
        (!!previousCurrentVisit &&
          previousCurrentVisit?.id !== currentVisit?.id)) &&
      !!currentVisit
    )
      appDispatch(
        visitThunkActions.getPreviousVisitInformationForInfant({
          visitId: currentVisit?.id,
        })
      );
  }, [appDispatch, currentVisit, currentVisit?.id, previousCurrentVisit]);

  useLayoutEffect(() => {
    history.push(location.pathname, {
      activeTabIndex: INFANT_PROFILE_TABS.PROGRESS,
    });
  }, [history, location.pathname]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="pt-20"
        size="medium"
        spinnerColor={'primary'}
        backgroundColor={'uiLight'}
      />
    );
  }

  return (
    <div className="pt-14" style={{ height: height - HEADER_HEIGHT }}>
      <div ref={introScreenRef}>
        <IntroScreen
          infant={infant}
          headerText={`${
            !!caregiverName ? caregiverName + ' &' : ''
          } ${infantName}`}
        />
      </div>
      <div className="flex h-full flex-col gap-4 px-4">
        {!!previousVisit?.visitDataStatus?.length ? (
          <>
            <Button
              className="mt-auto"
              type="filled"
              color="primary"
              textColor="white"
              text="Download client copy"
              icon="SaveIcon"
              onClick={handleCaptureClick}
            />
            <Button
              type="outlined"
              color="primary"
              textColor="primary"
              text="Manage referrals"
              icon="ClipboardListIcon"
              onClick={() => window.alert('add redirect to referral tab')} // TODO
            />
          </>
        ) : (
          <Button
            className="mt-auto"
            type="filled"
            color="primary"
            textColor="white"
            text="See upcoming visits"
            icon="HomeIcon"
            onClick={() =>
              history.push(location.pathname, {
                activeTabIndex: INFANT_PROFILE_TABS.VISITS,
              })
            }
          />
        )}
      </div>
    </div>
  );
};
