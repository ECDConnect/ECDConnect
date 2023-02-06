import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

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
import {
  getAllMotherEventRecordTypes,
  getMotherById,
} from '@/store/mother/mother.selectors';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { Controller, useForm } from 'react-hook-form';
import {
  initialPregnantRecordEventValues,
  pregnantRecordEventModelSchema,
} from '@/schemas/pregnant/visits/pregnant-record-event';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { useAppDispatch } from '@/store';
import { motherThunkActions } from '@/store/mother';
import { EventRecordType } from '@ecdlink/graphql';
import { eventRecordThunkActions } from '@/store/eventRecord';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';
import { useDialog, usePrevious } from '@ecdlink/core';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { getPregnancyWeeks } from '@/utils/mom/pregnant.utils';
import { RecordEventState } from './index.types';

const weekNumberToShowCelebratoryMessage = 33;

const eventNames = {
  close: 'close_folder',
  born: 'baby_was_born',
};

export const RecordEvent: React.FC = () => {
  const { register, control, formState, setValue, watch } = useForm({
    resolver: yupResolver(pregnantRecordEventModelSchema),
    defaultValues: initialPregnantRecordEventValues,
    mode: 'onChange',
  });
  const { isValid } = formState;

  const { eventRecordTypeId, childrenEventRecordTypeId, notes } = watch();

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const location = useLocation<RecordEventState>();

  const dialog = useDialog();

  const { errorDialog, successDialog } = useRequestResponseDialog();

  const appDispatch = useAppDispatch();

  const { isLoading, isRejected, isFulfilled } = useThunkFetchCall(
    'eventRecord',
    EventRecordActions.ADD_EVENT_RECORD
  );

  const wasLoading = usePrevious(isLoading);

  const [, , , motherId] = location.pathname.split('/');

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const weeksPregnant = mother?.expectedDateOfDelivery
    ? getPregnancyWeeks(mother?.expectedDateOfDelivery)
    : 0;

  const eventTypes = useSelector(getAllMotherEventRecordTypes);

  const bornEvent = useMemo(
    () => eventTypes.find((item) => item.name === eventNames.born),
    [eventTypes]
  );

  const isFromInfantForm = useMemo(
    () => location?.state?.isFromInfantForm,
    [location]
  );

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

  const childrenOptions = useMemo(() => {
    if (!selectedOption?.children?.length) {
      return [];
    }

    return selectedOption.children.map((item) => ({
      label: item?.normalizedName || '',
      value: item?.id,
    }));
  }, [selectedOption?.children]);

  const goBack = useCallback(() => {
    history.push(`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${motherId}`);
  }, [history, motherId]);

  const onSubmit = useCallback(() => {
    const input = {
      eventRecordTypeId: childrenEventRecordTypeId || eventRecordTypeId,
      notes,
      motherId,
    };

    appDispatch(
      eventRecordThunkActions.addEventRecord({
        input,
        isCloseFolder: selectedOption?.name !== eventNames.born,
      })
    );
  }, [
    appDispatch,
    childrenEventRecordTypeId,
    eventRecordTypeId,
    motherId,
    notes,
    selectedOption?.name,
  ]);

  const displayNewFolderDialog = useCallback(() => {
    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            title="Great! Would you like to open a new child folder now?"
            actionButtons={[
              {
                colour: 'primary',
                text: 'Yes, open folder',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'CheckIcon',
                onClick: () => {
                  history.push(ROUTES.INFANT_REGISTER, { motherId });
                  onClose();
                },
              },
              {
                colour: 'primary',
                text: 'No, exit',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: () => {
                  history.push(ROUTES.CLIENTS.ROOT);
                  onClose();
                },
              },
            ]}
          />
        );
      },
    });
  }, [dialog, history, motherId]);

  const displayCloseFolderDialog = useCallback(() => {
    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="ExclamationCircleIcon"
            iconColor="alertMain"
            iconClassName="h-10 w-10"
            title={`Are you sure you want to remove ${
              mother?.user?.firstName || ''
            }?`}
            detailText={`If you remove ${
              mother?.user?.firstName || ''
            } now, you will no longer be able to edit or view this profile. Tap “Remove client” below to continue.`}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Yes, remove client',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'TrashIcon',
                isLoading,
                disabled: isLoading,
                onClick: () => {
                  onSubmit();
                  onClose();
                },
              },
              {
                colour: 'primary',
                text: 'No, cancel',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                disabled: isLoading,
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  }, [dialog, isLoading, mother?.user?.firstName, onSubmit]);

  useEffect(() => {
    if (wasLoading && isRejected) {
      errorDialog();
    }
  }, [errorDialog, isRejected, wasLoading]);

  useEffect(() => {
    if (wasLoading && isFulfilled) {
      if (selectedOption?.name === eventNames.born && !isFromInfantForm) {
        return displayNewFolderDialog();
      }

      successDialog();

      return history.push(ROUTES.CLIENTS.ROOT);
    }
  }, [
    displayNewFolderDialog,
    goBack,
    history,
    isFromInfantForm,
    isFulfilled,
    selectedOption?.name,
    successDialog,
    wasLoading,
  ]);

  useEffect(() => {
    if (isFromInfantForm && bornEvent) {
      setValue('eventRecordTypeId', bornEvent.id);
    }
  }, [bornEvent, isFromInfantForm, setValue]);

  useLayoutEffect(() => {
    appDispatch(motherThunkActions.getAllMotherEventRecordTypes()).unwrap();
  }, [appDispatch]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${mother?.user?.firstName || ''} ${mother?.user?.surname || ''}`}
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
            disabled={isFromInfantForm}
            list={eventOptions}
            onChange={onChange}
          />
        )}
      />
      {selectedOption?.name === eventNames.born &&
        weeksPregnant >= weekNumberToShowCelebratoryMessage && (
          <SuccessCard
            className="mt-4"
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={`Congratulations to ${mother?.user?.firstName || ''}!`}
            color="successMain"
          />
        )}
      {!!childrenOptions.length && (
        <Controller
          name="childrenEventRecordTypeId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={`Why is ${
                mother?.user?.firstName || ''
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
            (isFromInfantForm
              ? !eventRecordTypeId
              : !isValid ||
                (!!childrenOptions.length && !childrenEventRecordTypeId)) ||
            isLoading
          }
          isLoading={isLoading}
          onClick={() =>
            selectedOption?.name === eventNames.close
              ? displayCloseFolderDialog()
              : onSubmit()
          }
        />
      </div>
    </BannerWrapper>
  );
};
