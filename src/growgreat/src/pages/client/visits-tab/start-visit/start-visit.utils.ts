import { VisitDto, getDateWithoutTimeZone } from '@ecdlink/core';
import { StartVisitClient } from './start-visit.types';
import ROUTES from '@/routes/routes';
import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';
import { History } from 'history';
import { infantThunkActions } from '@/store/infant';
import { motherThunkActions } from '@/store/mother';
import { AppDispatch, ThunkActionStatuses } from '@/store/types';
import { VisitModelInput } from '@ecdlink/graphql';
import { ViewEditState as MomViewEditState } from '@/pages/mom/pregnant-profile/progress-tab/activity-list/forms/dynamic-form';
import { ViewEditState as InfantViewEditState } from '@/pages/infant/infant-profile/progress-tab/activity-list/forms/dynamic-form';

// When the user starts a visit from this screen, it should start the next scheduled/planned visit if available. If there’s no planned visit, then start an “Other visit”.
export const startVisit = async (
  client: StartVisitClient,
  appDispatch: AppDispatch,
  history: History
) => {
  switch (client.type) {
    case 'infant': {
      await startVisitInfant(client, appDispatch, history);
      return;
    }
    case 'mother': {
      await startVisitMother(client, appDispatch, history);
      return;
    }
    default:
      history.push(ROUTES.CLIENTS.ROOT, {
        activeTabIndex: CLIENT_TABS.VISIT,
      });
  }
};

export const getInfantVisits = async (
  clientId: string,
  appDispatch: AppDispatch,
  typeStartsWith?: string
) => {
  const visitsResponse = await appDispatch(
    infantThunkActions.getInfantVisits({ infantId: clientId ?? '' })
  );

  const isFulfilled =
    visitsResponse?.meta?.requestStatus === ThunkActionStatuses.Fulfilled;

  if (!isFulfilled) return undefined;

  const visits = visitsResponse?.payload as VisitDto[];
  if (typeStartsWith === undefined) return visits;

  return visits.filter((v) => v.visitType?.name?.startsWith(typeStartsWith));
};

export const getMotherVisits = async (
  clientId: string,
  appDispatch: AppDispatch,
  typeStartsWith?: string
) => {
  const visitsResponse = await appDispatch(
    motherThunkActions.getMotherVisits({ motherId: clientId ?? '' })
  );

  const isFulfilled =
    visitsResponse?.meta?.requestStatus === ThunkActionStatuses.Fulfilled;

  if (!isFulfilled) return undefined;

  const visits = visitsResponse?.payload as VisitDto[];
  if (typeStartsWith === undefined) return visits;

  return visits.filter((v) => v.visitType?.name?.startsWith(typeStartsWith));
};

export const getCurrentVisit = (visits: VisitDto[]): VisitDto | undefined => {
  if (!visits || visits.length === 0) return;

  const today = getDateWithoutTimeZone(new Date().toISOString())!;

  const filteredVisits = visits.filter((visit) => {
    const dueDate = getDateWithoutTimeZone(visit.dueDate!);

    if (dueDate && today) {
      return dueDate >= today && !visit.attended;
    }

    return false;
  });
  if (filteredVisits.length === 0) return;

  return filteredVisits.reduce((previousVisit, currentVisit) => {
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

export const getClientPlannedCurrentVisit = async (
  client: StartVisitClient,
  appDispatch: AppDispatch
) => {
  var visits: VisitDto[] | undefined = undefined;
  if (client.type === 'mother') {
    visits = await getMotherVisits(client.id || '', appDispatch, 'visit');
  } else if (client.type === 'infant') {
    visits = await getInfantVisits(client.id || '', appDispatch);
  }
  if (!visits) return undefined;
  return getCurrentVisit(visits);
};

export const startVisitInfant = async (
  client: StartVisitClient,
  appDispatch: AppDispatch,
  history: History
) => {
  const visits = await getInfantVisits(client.id || '', appDispatch);
  if (!visits) return;

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
  } else {
    return history.push(
      ROUTES.CLIENTS.INFANT_PROFILE.PROGRESS.ACTIVITIES_FORM.replace(
        ':id',
        client?.id ?? ''
      ).replace(':visitId', currentVisit?.id),
      { editView: true } as InfantViewEditState
    );
  }
};

export const startVisitMother = async (
  client: StartVisitClient,
  appDispatch: AppDispatch,
  history: History
) => {
  const visits = await getMotherVisits(client.id || '', appDispatch);
  if (!visits) return;

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
  } else {
    return history.push(
      ROUTES.CLIENTS.MOM_PROFILE.PROGRESS.ACTIVITIES_FORM.replace(
        ':id',
        client?.id ?? ''
      ).replace(':visitId', currentVisit?.id),
      { editView: true } as MomViewEditState
    );
  }
};
