import { LanguageDto } from '@ecdlink/core';
import {
  Alert,
  AlertProps,
  BannerWrapper,
  Divider,
  Dropdown,
  FADButton,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { DateFormats } from '../../../../constants/Dates';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useProgrammePlanning } from '@hooks/useProgrammePlanning';
import {
  ProgrammeTimingModel,
  programmeTimingSchema,
} from '@schemas/classroom/programme-planning/programme-timing';
import { staticDataSelectors } from '../../../../store/static-data';
import { getDateRangeText } from '../../../../utils/classroom/programme-planning/programmes.utils';
import { ProgrammeTimingRouteState } from './programme-timing.types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProgrammeTiming: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const {
    createProgramme,
    getConflictingProgramme,
    validateStartDate,
    getThemedProgrammeEndDate,
    getNoThemedProgrammeEndDate,
  } = useProgrammePlanning();
  const languages = useSelector(staticDataSelectors.getLanguages);
  const { state } = useLocation<ProgrammeTimingRouteState>();
  const [alertState, setAlertState] = useState<AlertProps>();
  const selectedTheme = state?.theme;
  const [isFormValid, setIsFormValid] = useState(false);
  const { getValues, setValue, control } = useForm<ProgrammeTimingModel>({
    resolver: yupResolver(programmeTimingSchema),
    mode: 'onChange',
  });

  const { date: selectedDate, language: selectedLanguage } = useWatch({
    control: control,
  });

  const handleBack = () => {
    history.goBack();
  };

  const handleSave = async () => {
    const formValue = getValues();

    const validatedDate = validateStartDate(new Date(formValue.date));

    const newProgramme = await createProgramme(validatedDate, formValue.language, selectedTheme);

    history.replace('/programmes/summary', {
      programmeId: newProgramme.id,
      variation: 'create',
    });
  };

  useEffect(() => {
    setIsFormValid(programmeTimingSchema.isValidSync(getValues()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedLanguage]);

  useEffect(() => {
    if (!selectedDate) return;

    const validatedDate = validateStartDate(new Date(selectedDate));

    let endDate = validatedDate;

    let daysLength = 20;

    if (!selectedTheme) {
      const endOfWeekDay = getNoThemedProgrammeEndDate(validatedDate);
      endDate = endOfWeekDay.endDate;
      daysLength = endOfWeekDay.totalDays;
    } else {
      endDate = getThemedProgrammeEndDate(validatedDate);
    }

    const overlappingProgramme = getConflictingProgramme(new Date(validatedDate), endDate);
    if (overlappingProgramme) {
      setAlertState({
        title: 'This start date causes conflicts',
        list: [
          `This programme (${
            selectedTheme?.name || 'No theme'
          }) will run from <b>${getDateRangeText(
            validatedDate.toString(),
            endDate.toString()
          )}</b>`,
          `If you continue with this start date you will lose your plans for <b>${getDateRangeText(
            overlappingProgramme.startDate,
            overlappingProgramme.endDate
          )}</b> (${overlappingProgramme.name})`,
        ],
        type: 'warning',
      });
      return;
    }

    setAlertState({
      title: 'No conflicts for these dates',
      message: selectedTheme
        ? `Your ${selectedTheme.name} programme will start on <b>${validatedDate.toLocaleString(
            'en-ZA',
            DateFormats.dayFullMonthYear
          )}</b> and end on <b>${endDate.toLocaleString('en-ZA', DateFormats.dayFullMonthYear)}.</>`
        : `Your programme will be <b>${
            selectedTheme ? 20 : daysLength
          } day(s)</b> long, starting on <b>${validatedDate.toLocaleString(
            'en-ZA',
            DateFormats.dayFullMonthYear
          )}</b> and ending on <b>${endDate.toLocaleString(
            'en-ZA',
            DateFormats.dayFullMonthYear
          )}</b>.`,
      type: 'success',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Choose dates and language'}
      color={'primary'}
      onBack={handleBack}
      displayOffline={!isOnline}
    >
      <div className="px-4 py-2">
        <div className="mt-3 flex">
          <StatusChip
            backgroundColour="infoDark"
            borderColour="transparent"
            textColour="white"
            text={selectedTheme?.name || 'No theme'}
          />
        </div>
        <Typography type="h1" text="Set up your programme" color={'primary'} />
        {!selectedTheme ? (
          <Alert
            className="mt-4"
            title={'Programmes without a theme run until the end of the week.'}
            message="Choose your start date, you will have to select activities for each day until the end of the week."
            type={'info'}
          />
        ) : (
          <Alert
            className="mt-4"
            title="Themed programmes run for 20 days."
            message="Activities for Monday to Thursday are planned. Fridays are mahala days, so get creative and choose your own activities!"
            type={'info'}
          />
        )}

        <Typography
          className="mt-4"
          type="body"
          text="When would you like to start this programme?"
        />

        <DatePicker
          placeholderText={`Please select a date`}
          className="w-full border-uiLight rounded-md"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => setValue('date', date ? date.toString() : '')}
          dateFormat="EEE, dd MMM yyyy"
          minDate={new Date()}
        />

        {alertState && <Alert className="mt-4" {...alertState} />}

        <Typography
          className="mt-4"
          type="body"
          text="What is your preferred classroom language?"
        />
        <Typography
          type="body"
          text="You can change languages while you plan. When your chosen language isn’t available, activities or stories will be shown in English."
          color={'textLight'}
        />
        <Dropdown
          fullWidth
          fillType="clear"
          placeholder="Tap to choose language"
          selectedValue={selectedLanguage}
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
        <Divider className="mt-4" />
        <FADButton
          title={'Save'}
          icon={'SaveIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'filled'}
          color={'primary'}
          shape={'normal'}
          className="my-4 w-full"
          size="small"
          click={handleSave}
          disabled={!isFormValid}
        />
      </div>
    </BannerWrapper>
  );
};

export default ProgrammeTiming;
