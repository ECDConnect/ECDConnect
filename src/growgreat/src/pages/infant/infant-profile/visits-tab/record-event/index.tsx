import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Dropdown,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { RootState } from '@/store/types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import {
  getAllInfantEventRecordTypesSelector,
  getInfantById,
} from '@/store/infant/infant.selectors';
import { Controller, useForm } from 'react-hook-form';
import { eventRecordThunkActions } from '@/store/eventRecord';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { useAppDispatch } from '@/store';
import { useDialog, usePrevious } from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';
import { EventRecordType } from '@ecdlink/graphql';
import { infantThunkActions } from '@/store/infant';
import { InfantProfileParams } from '../../infant-profile.types';
import {
  initialRecordEventValues,
  recordEventModelSchema,
} from '@/schemas/record-event/record-event';
import { PregnantProfileRouteState } from '@/pages/mom/pregnant-profile/index.types';
import { InfantRouteState } from '@/pages/infant/infant.types';
import { ChangeCaregiver } from './change-caregiver';
import { InfantActions } from '@/store/infant/infant.actions';
import { ActionModalButton } from '@/../../../packages/ui/lib/components/action-modal/models/ActionModalButton';

const eventNames = {
  close: 'close_folder',
  caregiverIsPregnant: 'caregiver_is_pregnant',
  newChildInFamily: 'new_child_in_family',
  caregiverHasChanged: 'caregiver_has_changed',
};

export const RecordEvent: React.FC = () => {
  const [isChangeCaregiver, setIsChangeCaregiver] = useState(false);

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const { id: infantId } = useParams<InfantProfileParams>();

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );
  const infantName = useMemo(
    () => infant?.user?.firstName,
    [infant?.user?.firstName]
  );

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infantId}`);
  }, [history, infantId]);

  const { register, control, formState, watch } = useForm({
    resolver: yupResolver(recordEventModelSchema),
    defaultValues: initialRecordEventValues,
    mode: 'onChange',
  });
  const { isValid } = formState;

  const { eventRecordTypeId, childrenEventRecordTypeId, notes } = watch();

  const dialog = useDialog();

  const { errorDialog, successDialog } = useRequestResponseDialog();

  const appDispatch = useAppDispatch();

  const {
    isLoading: isLoadingUpdateInfantCaregiver,
    isRejected: isRejectedUpdateInfantCaregiver,
  } = useThunkFetchCall('infants', InfantActions.UPDATE_INFANT_CAREGIVER);
  const wasLoadingUpdateInfantCaregiver = usePrevious(
    isLoadingUpdateInfantCaregiver
  );

  const { isLoading, isRejected, isFulfilled } = useThunkFetchCall(
    'eventRecord',
    EventRecordActions.ADD_EVENT_RECORD
  );

  const wasLoading = usePrevious(isLoading);

  const eventTypes = useSelector(getAllInfantEventRecordTypesSelector);

  const eventOptions = useMemo(
    () =>
      eventTypes.map((type) => ({
        label: type.normalizedName || '',
        value: type.id,
      })),
    [eventTypes]
  );

  const selectedOption = useMemo(
    (): EventRecordType | undefined =>
      eventTypes.find((type) => type.id === eventRecordTypeId),
    [eventRecordTypeId, eventTypes]
  );

  const recordEventInput = useMemo(
    () => ({
      eventRecordTypeId: childrenEventRecordTypeId || eventRecordTypeId,
      infantId,
      notes,
    }),
    [childrenEventRecordTypeId, eventRecordTypeId, infantId, notes]
  );

  const childrenOptions = useMemo(() => {
    if (!selectedOption?.children?.length) {
      return [];
    }

    return selectedOption.children.map((item) => ({
      label: item?.normalizedName || '',
      value: item?.id,
    }));
  }, [selectedOption?.children]);

  const onSubmit = useCallback(() => {
    appDispatch(
      eventRecordThunkActions.addEventRecord({
        input: recordEventInput,
      })
    );
  }, [appDispatch, recordEventInput]);

  const displayConfirmDialog = useCallback(
    ({
      title,
      detailText = '',
      onOk,
      onOkText,
      onOkIcon,
      hideDismissButton,
      disableSubmit,
    }: {
      title: string;
      detailText?: string;
      onOk: () => void;
      onOkText: string;
      onOkIcon: string;
      hideDismissButton?: boolean;
      disableSubmit?: boolean;
    }) => {
      return dialog({
        blocking: false,
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => {
          const actionButtons: ActionModalButton[] = [
            {
              colour: 'primary',
              text: onOkText,
              textColour: 'white',
              type: 'filled',
              leadingIcon: onOkIcon,
              onClick: () => {
                onOk();
                onClose();
              },
            },
          ];

          if (!hideDismissButton) {
            actionButtons.push({
              colour: 'primary',
              text: 'No, exit',
              textColour: 'primary',
              type: 'outlined',
              leadingIcon: 'XIcon',
              onClick: () => {
                !disableSubmit && onSubmit();
                onClose();
              },
            });
          }

          return (
            <ActionModal
              icon="InformationCircleIcon"
              iconColor="infoMain"
              className="z-50"
              title={title}
              detailText={detailText}
              actionButtons={actionButtons}
            />
          );
        },
      });
    },
    [dialog, onSubmit]
  );

  const handleOnSubmit = useCallback(() => {
    const historyState: PregnantProfileRouteState & InfantRouteState = {
      isInfantEvent: true,
      motherId: infant?.caregiver?.id,
      linkedInfantId: infantId,
      recordEventInput,
    };

    switch (selectedOption?.name) {
      case eventNames.caregiverIsPregnant:
        return displayConfirmDialog({
          title: 'Great! Would you like to open a new pregnant mom folder now?',
          onOk: () => history.push(ROUTES.MOM_REGISTER, historyState),
          onOkIcon: 'FolderAddIcon',
          onOkText: 'Yes, open folder',
        });

      case eventNames.newChildInFamily:
        return displayConfirmDialog({
          title: 'Great! Would you like to open a new child folder now?',
          onOk: () => history.push(ROUTES.INFANT_REGISTER, historyState),
          onOkIcon: 'FolderAddIcon',
          onOkText: 'Yes, open folder',
        });
      case eventNames.caregiverHasChanged:
        return displayConfirmDialog({
          title: `Please add a different caregiver for ${infantName}.`,
          onOk: () => setIsChangeCaregiver(true),
          onOkIcon: 'UserAddIcon',
          onOkText: 'Add a different caregiver',
          hideDismissButton: true,
        });
      default:
        displayConfirmDialog({
          title: `Are you sure you want to remove ${
            infant?.user?.firstName || ''
          }?`,
          onOk: () => onSubmit(),
          onOkIcon: 'FolderAddIcon',
          onOkText: 'Yes, remove client',
          disableSubmit: true,
        });
        break;
    }
  }, [
    onSubmit,
    displayConfirmDialog,
    history,
    infant,
    infantId,
    infantName,
    recordEventInput,
    selectedOption?.name,
  ]);

  const handleWithUpdateCaregiver = useCallback(() => {
    if (wasLoadingUpdateInfantCaregiver && !isLoadingUpdateInfantCaregiver) {
      if (isRejectedUpdateInfantCaregiver) {
        return errorDialog();
      }

      onSubmit();
    }
  }, [
    errorDialog,
    isLoadingUpdateInfantCaregiver,
    isRejectedUpdateInfantCaregiver,
    onSubmit,
    wasLoadingUpdateInfantCaregiver,
  ]);

  useEffect(() => {
    handleWithUpdateCaregiver();
  }, [handleWithUpdateCaregiver]);

  useEffect(() => {
    if (wasLoading && isRejected) {
      errorDialog();
    }
  }, [errorDialog, isRejected, wasLoading]);

  useEffect(() => {
    if (wasLoading && isFulfilled) {
      successDialog();

      return history.push(ROUTES.CLIENTS.ROOT);
    }
  }, [
    goBack,
    history,
    isFulfilled,
    selectedOption?.name,
    successDialog,
    wasLoading,
  ]);

  useLayoutEffect(() => {
    appDispatch(infantThunkActions.getAllInfantEventRecordTypes()).unwrap();
  }, [appDispatch]);

  if (isChangeCaregiver) {
    return (
      <ChangeCaregiver
        infant={infant}
        goBack={() => setIsChangeCaregiver(false)}
      />
    );
  }

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${
        infant?.caregiver?.firstName ? infant?.caregiver?.firstName + ' & ' : ''
      }${infant?.user?.firstName || ''} `}
      backgroundColour="white"
      displayOffline={!isOnline}
      className={'flex flex-col p-4'}
    >
      <Typography
        type="h2"
        align="left"
        weight="bold"
        text="Record an event"
        color="textDark"
      />
      <Controller
        name="eventRecordTypeId"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Dropdown
            label="What happened?"
            className="mt-4"
            fillType="clear"
            placeholder="Tap to choose event"
            selectedValue={value}
            list={eventOptions}
            onChange={onChange}
          />
        )}
      />
      {!!childrenOptions.length && (
        <Controller
          name="childrenEventRecordTypeId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={`Why is ${
                infant?.user?.firstName || ''
              }’s folder being closed?`}
              className="mt-4"
              fillType="clear"
              placeholder="Tap to choose event"
              selectedValue={value}
              list={childrenOptions}
              onChange={onChange}
            />
          )}
        />
      )}
      <FormInput
        label="Add notes"
        subLabel="Optional"
        register={register}
        nameProp="notes"
        placeholder={'E.g. client would like to receive services in new area.'}
        type="text"
        className="mt-4"
        textInputType="textarea"
      />
      <div className="mt-7 flex h-full items-end">
        <Button
          type="filled"
          color="primary"
          icon={
            selectedOption?.name === eventNames.close ? 'TrashIcon' : 'SaveIcon'
          }
          className="w-full "
          text={
            selectedOption?.name === eventNames.close
              ? 'Close folder & remove client'
              : 'Save'
          }
          textColor="white"
          disabled={
            !isValid ||
            (!!childrenOptions.length && !childrenEventRecordTypeId) ||
            isLoading
          }
          isLoading={isLoading}
          onClick={handleOnSubmit}
        />
      </div>
    </BannerWrapper>
  );
};
