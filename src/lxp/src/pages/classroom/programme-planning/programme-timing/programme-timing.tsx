import { LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  AlertProps,
  BannerWrapper,
  Button,
  DatePicker,
  DialogPosition,
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useProgrammePlanning } from '@hooks/useProgrammePlanning';
import {
  ProgrammeTimingModel,
  programmeTimingSchema,
} from '@schemas/classroom/programme-planning/programme-timing';
import { staticDataSelectors } from '@store/static-data';
import { getDateRangeText } from '@utils/classroom/programme-planning/programmes.utils';
import { ProgrammeTimingRouteState } from './programme-timing.types';
import 'react-datepicker/dist/react-datepicker.css';
import ROUTES from '@routes/routes';
import { useAppDispatch } from '@/store';
import { programmeThunkActions } from '@/store/programme';
import ProgrammeWrapper from '../programme-dashboard/walkthrough/programme-wrapper';
import { classroomsSelectors } from '@/store/classroom';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '../../class-dashboard/class-dashboard.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ProgrammeActions } from '@/store/programme/programme.actions';
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';
import { useAppContext } from '@/walkthrougContext';
import { ProgrammeDashboardRouteState } from '../programme-dashboard/programme-dashboard.types';

const ProgrammeTiming: React.FC = () => {
  const {
    state: { run: isWalkthrough },
  } = useAppContext();
  const history = useHistory();
  const { state } = useLocation<ProgrammeTimingRouteState>();

  const programmeToEdit = state?.programmeToEdit;

  useEffect(() => {
    if (!state?.classroomGroupId) {
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: TabsItems.ACTIVITES,
      } as ClassDashboardRouteState);
    }
  }, [history, state?.classroomGroupId, state?.theme]);

  const { isOnline } = useOnlineStatus();

  const {
    createOrEditProgramme,
    getConflictingProgramme,
    validateStartDate,
    getThemedProgrammeEndDate,
    getNoThemedProgrammeEndDate,
  } = useProgrammePlanning();

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(state.classroomGroupId)
  );
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [alertState, setAlertState] = useState<AlertProps>();
  const selectedTheme = state?.theme;
  const [isFormValid, setIsFormValid] = useState(false);

  const { isLoading } = useThunkFetchCall(
    'programmeData',
    ProgrammeActions.UPDATE_PROGRAMMES
  );

  const dialog = useDialog();

  const { getValues, setValue, control } = useForm<ProgrammeTimingModel>({
    resolver: yupResolver(programmeTimingSchema),
    mode: 'onChange',
  });

  const appDispatch = useAppDispatch();

  const {
    date: selectedDate,
    language: selectedLanguage,
    endDate,
  } = useWatch({
    control: control,
  });

  const validStartdDate = selectedDate
    ? validateStartDate(new Date(selectedDate))
    : new Date();

  const handleBack = () => {
    history.goBack();
  };

  const onSuccess = useCallback(() => {
    dialog({
      blocking: true,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <ActionModal
          customIcon={<Robot className="mb-3 h-24 w-24" />}
          title={`Great, I have set up your ${selectedTheme?.name} programme!`}
          detailText={`All your activities have been planned for ${getDateRangeText(
            selectedDate?.toString(),
            endDate?.toString()
          )}!`}
          actionButtons={[
            {
              colour: 'quatenary',
              textColour: 'white',
              onClick: () => {
                onClose();
                history.push(
                  ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
                    ':classroomGroupId',
                    state.classroomGroupId
                  ),
                  {
                    selectedDate: new Date(selectedDate!),
                  } as ProgrammeDashboardRouteState
                );
              },
              leadingIcon: 'ClipboardListIcon',
              type: 'filled',
              text: 'See programme',
            },
          ]}
        />
      ),
    });
  }, [
    dialog,
    endDate,
    history,
    selectedDate,
    selectedTheme,
    state.classroomGroupId,
  ]);

  const handleSave = async () => {
    const formValue = getValues();
    const validatedDate = validateStartDate(new Date(formValue.date));

    await createOrEditProgramme(
      state.classroomGroupId,
      validatedDate,
      formValue.language,
      selectedTheme,
      new Date(endDate!),
      programmeToEdit
    );

    if (isOnline) {
      appDispatch(programmeThunkActions.updateProgrammes({}));
    }

    onSuccess();
  };

  useEffect(() => {
    setIsFormValid(
      !!programmeToEdit || programmeTimingSchema.isValidSync(getValues())
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedLanguage]);

  const lastCheckedDateRef = useRef<Date | null>(null);

  const isDateRangeOverlapping = (
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ) => end1 <= end2 && start1 >= start2;

  useEffect(() => {
    if (!selectedDate) return;

    const validatedDate = validateStartDate(new Date(selectedDate));
    let internalEndDate;

    if (!selectedTheme) {
      internalEndDate = getNoThemedProgrammeEndDate(validatedDate).endDate;
    } else {
      if (!programmeToEdit) {
        setValue(
          'endDate',
          getThemedProgrammeEndDate(validatedDate).toString()
        );
      }
      internalEndDate = getThemedProgrammeEndDate(validatedDate);
    }

    if (lastCheckedDateRef.current?.getTime() === internalEndDate?.getTime()) {
      return;
    }

    lastCheckedDateRef.current = internalEndDate;

    setAlert(internalEndDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const setAlert = useCallback(
    (date: string | Date) => {
      if (!selectedDate || !classroomGroup?.id) return;

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return;

      const overlappingProgramme = getConflictingProgramme(
        new Date(selectedDate),
        parsedDate,
        classroomGroup.id
      );

      if (overlappingProgramme) {
        const programmeStart = new Date(overlappingProgramme.startDate);
        const programmeEnd = new Date(overlappingProgramme.endDate);
        const selectedStart = new Date(selectedDate);
        const selectedEnd = new Date(parsedDate);
        // Check overlap
        if (
          isDateRangeOverlapping(
            selectedStart,
            selectedEnd,
            programmeStart,
            programmeEnd
          )
        ) {
          setAlertState({
            title: `You already have activities planned for the ${classroomGroup.name} class on these dates`,
            list: [
              `If you continue with these dates, you will lose your plans for ${getDateRangeText(
                overlappingProgramme.startDate,
                overlappingProgramme.endDate
              )} (${overlappingProgramme.name}).`,
            ],
            type: 'warning',
          });
          return;
        }
      }

      setAlertState({
        title: 'These dates are available',
        type: 'success',
      });
    },
    [
      classroomGroup?.id,
      classroomGroup?.name,
      getConflictingProgramme,
      selectedDate,
    ]
  );

  useEffect(() => {
    if (programmeToEdit) {
      setValue('date', programmeToEdit.startDate);
      setValue('endDate', programmeToEdit.endDate);
      setValue('language', programmeToEdit.preferredLanguage);
    }
  }, [programmeToEdit, setValue]);

  useEffect(() => {
    if (state.initialDate) {
      setValue('date', state.initialDate.toString().replace('Z', ''));
    }
  }, [setValue, state.initialDate]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Choose dates and language'}
      subTitle={`Theme: ${selectedTheme?.name}`}
      color={'primary'}
      onBack={handleBack}
      displayOffline={!isOnline}
      className="flex flex-col p-4 pt-6"
    >
      <ProgrammeWrapper />
      <Typography
        type="h1"
        text={
          !!programmeToEdit
            ? 'Edit programme'
            : `Set up your theme for ${classroomGroup?.name}`
        }
        color="textDark"
      />
      <>
        <div className="mt-3 flex items-center gap-2">
          <img
            src={selectedTheme?.imageUrl}
            alt="Theme icon"
            className="w-9 rounded-full"
          />
          <Typography
            type="h4"
            text={selectedTheme?.name || 'No theme'}
            color="textDark"
            className="w-full"
          />
          <img
            src={selectedTheme?.themeLogo}
            alt="Theme icon"
            className="w-9 rounded-full"
          />
        </div>
        {!selectedTheme && (
          <Alert
            className="mt-4"
            title={'Programmes without a theme run until the end of the week.'}
            message="Choose your start date, you will have to select activities for each day until the end of the week."
            type={'info'}
          />
        )}
        <div id="walkthrough-theme-timing">
          <Typography
            className="mt-4"
            type="h4"
            text="When would you like to start this programme?"
          />

          <DatePicker
            disabledKeyboardNavigation
            placeholderText={`Please select a date`}
            className="border-uiLight text-textMid w-full rounded-md"
            selected={selectedDate ? new Date(selectedDate) : undefined}
            onChange={(date) => {
              setValue('date', date ? date.toString() : '');
            }}
            dateFormat="EEE, dd MMM yyyy"
            minDate={new Date()}
            disabled={isWalkthrough}
          />
          <Typography
            className="mt-4"
            type="h4"
            text="When would you like to end this programme?"
          />
          <DatePicker
            disabledKeyboardNavigation
            disabled={selectedDate == null || isWalkthrough}
            placeholderText={`Please select a date`}
            className="border-uiLight text-textMid w-full rounded-md"
            selected={endDate ? new Date(endDate) : undefined}
            onChange={(date) => {
              setValue('endDate', date ? date.toString() : '');
              setAlert(date!);
            }}
            dateFormat="EEE, dd MMM yyyy"
            minDate={selectedDate ? new Date(selectedDate) : undefined}
            maxDate={getThemedProgrammeEndDate(validStartdDate!)}
          />
        </div>

        {alertState && <Alert className="mt-4" {...alertState} />}
        <div id="walkthrough-classroom-language" className="mb-4">
          <Typography
            className="mt-4"
            type="h4"
            text="What is your preferred classroom language?"
          />
          <Typography
            type="help"
            text="You can change languages while you plan. When your chosen language isn’t available, activities or stories will be shown in English."
            color={'textMid'}
          />
          <Dropdown
            fullWidth
            fillType="clear"
            placeholder="Tap to choose language"
            selectedValue={selectedLanguage}
            disabled={!!programmeToEdit || isWalkthrough}
            list={
              (languages &&
                languages
                  .filter((x) => x.locale?.length > 0)
                  .map((language: LanguageDto) => {
                    return {
                      label: language.description,
                      value: language.locale,
                    };
                  })) ||
              []
            }
            onChange={(item) => {
              setValue('language', item, { shouldValidate: true });
            }}
          />
        </div>
        <Button
          type="filled"
          color="quatenary"
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
          onClick={handleSave}
          icon="SaveIcon"
          text={!!programmeToEdit ? 'Update' : 'Save'}
          textColor="white"
          className="mt-auto w-full"
        />
      </>
    </BannerWrapper>
  );
};

export default ProgrammeTiming;
