import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import format from 'date-fns/format';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getInfants } from '@/store/infant/infant.selectors';
import { getMothers } from '@/store/mother/mother.selectors';
import { Typography, Dropdown, BannerWrapper, Button } from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import ROUTES from '@/routes/routes';

import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';
import { useAppDispatch } from '@/store';
import { infantThunkActions } from '@/store/infant';
import { motherThunkActions } from '@/store/mother';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { InfantActions } from '@/store/infant/infant.actions';
import { MotherActions } from '@/store/mother/mother.actions';
import { VisitDto, getDateWithoutTimeZone, useSnackbar } from '@ecdlink/core';
import { VisitModelInput } from '@ecdlink/graphql';
import { ViewEditState as MomViewEditState } from '@/pages/mom/pregnant-profile/progress-tab/activity-list/forms/dynamic-form';
import { ViewEditState as InfantViewEditState } from '@/pages/infant/infant-profile/progress-tab/activity-list/forms/dynamic-form';
import { ThunkActionStatuses } from '@/store/types';

interface DropdownOnChange {
  id: string | undefined;
  type: 'mother' | 'infant';
}

const HEADER_HEIGHT = 64;

export const StartVisitFromVisitDashboard: React.FC = () => {
  const [client, setClient] = useState<DropdownOnChange | undefined>();

  const appDispatch = useAppDispatch();

  const infants = useSelector(getInfants);
  const mothers = useSelector(getMothers);

  const {
    isLoading: isLoadingAdditionalVisitForMother,
    wasLoading: wasLoadingAdditionalVisitForMother,
    isRejected: isRejectedAdditionalVisitForMother,
  } = useThunkFetchCall(
    'mothers',
    MotherActions.ADD_ADDITIONAL_VISIT_FOR_MOTHER
  );
  const {
    isLoading: isLoadingAdditionalVisitForInfant,
    wasLoading: wasLoadingAdditionalVisitForInfant,
    isRejected: isRejectedAdditionalVisitForInfant,
  } = useThunkFetchCall(
    'infants',
    InfantActions.ADD_ADDITIONAL_VISIT_FOR_INFANT
  );
  const {
    isLoading: isLoadingInfant,
    wasLoading: wasLoadingInfant,
    isRejected: isRejectedInfant,
  } = useThunkFetchCall('infants', InfantActions.GET_INFANT_VISITS);
  const {
    isLoading: isLoadingMother,
    wasLoading: wasLoadingMother,
    isRejected: isRejectedMother,
  } = useThunkFetchCall('mothers', MotherActions.GET_MOTHER_VISITS);

  const { showMessage } = useSnackbar();

  const date = format(new Date(), 'EEEE, d LLLL');

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const { height } = useWindowSize();

  const infantOptions = useMemo(
    () =>
      infants.map((infant) => ({
        value: { id: infant.user?.id, type: 'infant' } as DropdownOnChange,
        label: `${infant.user?.firstName || ''} ${infant.user?.surname || ''}`,
      })),
    [infants]
  );

  const filteredMothers = useMemo(
    () => mothers.filter((item) => !!item.expectedDateOfDelivery),
    [mothers]
  );

  const motherOptions = useMemo(
    () =>
      filteredMothers.map((mom) => ({
        value: { id: mom.user?.id, type: 'mother' } as DropdownOnChange,
        label: `${mom.user?.firstName || ''} ${mom.user?.surname || ''}`,
      })),
    [filteredMothers]
  );

  const clients = [...motherOptions, ...infantOptions];

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  const getCurrentVisit = (visits: VisitDto[]) => {
    const today = getDateWithoutTimeZone(new Date().toISOString())!;

    return visits
      ?.filter((visit) => {
        const dueDate = getDateWithoutTimeZone(visit.dueDate!);

        if (dueDate && today) {
          return dueDate >= today;
        }

        return false;
      })
      ?.reduce((previousVisit, currentVisit) => {
        // Calculate the absolute difference in milliseconds between the due dates and today
        const previousDifference = Math.abs(
          new Date(previousVisit.dueDate)?.getTime()! - today?.getTime()
        );
        const currentDifference = Math.abs(
          new Date(currentVisit.dueDate)?.getTime()! - today?.getTime()
        );
        // Return the visit with the smaller difference as the closest visit
        return currentDifference < previousDifference
          ? currentVisit
          : previousVisit;
      });
  };

  // When the user starts a visit from this screen, it should start the next scheduled/planned visit if available. If there’s no planned visit, then start an “Other visit”.
  const onStartVisit = async () => {
    switch (client?.type) {
      case 'infant': {
        const visitsResponse = await appDispatch(
          infantThunkActions.getInfantVisits({ infantId: client?.id ?? '' })
        );
        const isFulfilled =
          visitsResponse?.meta?.requestStatus === ThunkActionStatuses.Fulfilled;

        if (!isFulfilled) return;

        const visits = visitsResponse?.payload as VisitDto[];

        const currentVisit = getCurrentVisit(visits);

        if (!currentVisit?.id) {
          const input: VisitModelInput = {
            infantId: client.id,
            plannedVisitDate: new Date().toISOString(),
            actualVisitDate: new Date().toISOString(),
            attended: false,
          };

          const response = await appDispatch(
            infantThunkActions.addAdditionalVisitForInfant(input)
          );

          const otherVisit = (response.payload as VisitDto) || undefined;
          if (otherVisit?.id) {
            return history.push(
              ROUTES.CLIENTS.INFANT_PROFILE.PROGRESS.ACTIVITIES_FORM.replace(
                ':id',
                client?.id ?? ''
              ).replace(':visitId', otherVisit?.id),
              { editView: true } as InfantViewEditState
            );
          }
        }

        return history.push(
          ROUTES.CLIENTS.INFANT_PROFILE.PROGRESS.ACTIVITIES_FORM.replace(
            ':id',
            client?.id ?? ''
          ).replace(':visitId', currentVisit?.id),
          { editView: true } as InfantViewEditState
        );
      }
      case 'mother': {
        const visitsResponse = await appDispatch(
          motherThunkActions.getMotherVisits({ motherId: client?.id ?? '' })
        );
        const isFulfilled =
          visitsResponse?.meta?.requestStatus === ThunkActionStatuses.Fulfilled;

        if (!isFulfilled) return;

        const visits = visitsResponse?.payload as VisitDto[];

        const currentVisit = getCurrentVisit(visits);

        if (!currentVisit?.id) {
          const input: VisitModelInput = {
            motherId: client.id,
            plannedVisitDate: new Date().toISOString(),
            actualVisitDate: new Date().toISOString(),
            attended: false,
          };

          const response = await appDispatch(
            motherThunkActions.addAdditionalVisitForMother(input)
          );

          const otherVisit = (response.payload as VisitDto) || undefined;
          if (otherVisit?.id) {
            return history.push(
              ROUTES.CLIENTS.MOM_PROFILE.PROGRESS.ACTIVITIES_FORM.replace(
                ':id',
                client?.id ?? ''
              ).replace(':visitId', otherVisit?.id),
              { editView: true } as MomViewEditState
            );
          }
        }

        return history.push(
          ROUTES.CLIENTS.MOM_PROFILE.PROGRESS.ACTIVITIES_FORM.replace(
            ':id',
            client?.id ?? ''
          ).replace(':visitId', currentVisit?.id),
          { editView: true } as MomViewEditState
        );
      }
      default:
        history.push(ROUTES.CLIENTS.ROOT, {
          activeTabIndex: CLIENT_TABS.VISIT,
        });
    }
  };

  useEffect(() => {
    if (
      (wasLoadingInfant && !isLoadingInfant && isRejectedInfant) ||
      (wasLoadingMother && !isLoadingMother && isRejectedMother) ||
      (wasLoadingAdditionalVisitForInfant &&
        !isLoadingAdditionalVisitForInfant &&
        isRejectedAdditionalVisitForInfant) ||
      (wasLoadingAdditionalVisitForMother &&
        !isLoadingAdditionalVisitForMother &&
        isRejectedAdditionalVisitForMother)
    ) {
      showMessage({
        message: 'Something went wrong. Please try again later.',
        type: 'error',
      });
    }
  }, [
    isLoadingAdditionalVisitForInfant,
    isLoadingAdditionalVisitForMother,
    isLoadingInfant,
    isLoadingMother,
    isRejectedAdditionalVisitForInfant,
    isRejectedAdditionalVisitForMother,
    isRejectedInfant,
    isRejectedMother,
    showMessage,
    wasLoadingAdditionalVisitForInfant,
    wasLoadingAdditionalVisitForMother,
    wasLoadingInfant,
    wasLoadingMother,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Client folders'}
      subTitle={date}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
    >
      <div
        className="flex flex-col p-4"
        style={{ height: height - HEADER_HEIGHT }}
      >
        <Typography
          type="h2"
          weight="bold"
          lineHeight="snug"
          color="textDark"
          text="Find the client"
        />
        <Dropdown<DropdownOnChange>
          showSearch
          className="pt-4"
          label="Who are you visiting?"
          placeholder="Tap to search for client"
          list={clients}
          selectedValue={client}
          onChange={setClient}
        />
        <div className="mt-4 flex h-full items-end">
          <Button
            text="Start a visit"
            icon="HomeIcon"
            type="filled"
            color="primary"
            textColor="white"
            className="w-full"
            iconPosition="start"
            disabled={
              !client ||
              isLoadingInfant ||
              isLoadingMother ||
              isLoadingAdditionalVisitForInfant ||
              isLoadingAdditionalVisitForMother
            }
            isLoading={
              isLoadingInfant ||
              isLoadingMother ||
              isLoadingAdditionalVisitForInfant ||
              isLoadingAdditionalVisitForMother
            }
            onClick={onStartVisit}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
export default StartVisitFromVisitDashboard;
