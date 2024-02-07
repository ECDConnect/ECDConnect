import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Status, ThunkActionStatuses } from './types';

export const setThunkActionStatus = (
  builder: ActionReducerMapBuilder<any>,
  action: any,
  removeRejectedStatus: boolean = false
) => {
  builder.addCase(action.pending, (state, currentAction) => {
    const actionType = getActionName(currentAction.type);

    const previousStatus = typeof state.status === 'object' ? state.status : [];

    const newStatus = previousStatus?.filter(
      (currentStatus: Status) => currentStatus?.actionName !== actionType
    );

    const status = [
      ...newStatus,
      {
        actionName: actionType,
        value: ThunkActionStatuses.Pending,
      },
    ];

    state.status = status;
    state.error = undefined;
  });
  if (!removeRejectedStatus) {
    builder.addCase(action.rejected, (state, currentAction) => {
      const actionType = getActionName(currentAction.type);

      const previousStatus = state.status || [];

      const newStatus = previousStatus.filter(
        (currentStatus: Status) => currentStatus?.actionName !== actionType
      );

      const status = [
        ...newStatus,
        {
          actionName: actionType,
          value: ThunkActionStatuses.Rejected,
        },
      ];

      state.status = status;
      state.error = currentAction?.payload?.message;
    });
  }
};

export const getActionName = (actionType: string) => {
  const [name] = actionType.split('/');

  return name;
};

export const setFulfilledThunkActionStatus = (state: any, action: any) => {
  const actionType = getActionName(action.type);

  const previousStatus = typeof state.status === 'object' ? state.status : [];

  const newStatus = previousStatus.filter(
    (currentStatus: Status) => currentStatus.actionName !== actionType
  );

  const status = !!newStatus
    ? [
        ...newStatus,
        {
          actionName: actionType,
          value: ThunkActionStatuses.Fulfilled,
        },
      ]
    : [
        {
          actionName: actionType,
          value: ThunkActionStatuses.Fulfilled,
        },
      ];

  state.status = status;
  state.error = undefined;
};

export const setRejectedThunkActionStatus = (state: any, action: any) => {
  const actionType = getActionName(action.type);

  const previousStatus = typeof state.status === 'object' ? state.status : [];

  const newStatus = previousStatus.filter(
    (currentStatus: Status) => currentStatus.actionName !== actionType
  );

  const status = !!newStatus
    ? [
        ...newStatus,
        {
          actionName: actionType,
          value: ThunkActionStatuses.Rejected,
        },
      ]
    : [
        {
          actionName: actionType,
          value: ThunkActionStatuses.Rejected,
        },
      ];

  state.status = status;
  state.error = action?.payload?.message;
};
