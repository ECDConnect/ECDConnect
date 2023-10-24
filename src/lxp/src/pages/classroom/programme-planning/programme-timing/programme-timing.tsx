import { LanguageDto, useDialog } from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  AlertProps,
  BannerWrapper,
  DialogPosition,
  Divider,
  Dropdown,
  FADButton,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useState } from 'react';
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ROUTES from '@routes/routes';
import { useAppDispatch } from '@/store';
import { programmeThunkActions } from '@/store/programme';
import { addDays, format } from 'date-fns';
import { practitionerSelectors } from '@/store/practitioner';
import walktroughImage from '../../../../assets/walktroughImage.png';

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
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const practitioners = useSelector(
    practitionerSelectors.getPractitioners
  )?.filter((x) => {
    return x.user?.id !== practitioner?.user?.id;
  });

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

  const handleSave = async () => {
    const formValue = getValues();
    const validatedDate = validateStartDate(new Date(formValue.date));
    const newProgramme = await createProgramme(
      validatedDate,
      formValue.language,
      selectedTheme,
      new Date(endDate!)
    );

    if (isOnline) {
      try {
        appDispatch(programmeThunkActions.updateProgrammes({}));
      } catch (err) {
        console.log(err);
      }
    }

    handleDialog();

    if (isPrincipal && practitioners?.length! >= 1) {
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: 3,
        programmeStartDate: validatedDate,
      });
    } else {
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: 2,
        programmeStartDate: validatedDate,
      });
    }
  };

  const handleDialog = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            customIcon={
              <div className="flex">
                <img src={walktroughImage} alt="profile" className="mb-2" />
              </div>
            }
            importantText={
              `Great, I have set up your ` +
              selectedTheme?.name +
              ` programme! Start planning your Mahala Fridays`
            }
            detailText={`Activities for Monday to Thursday are planned! Choose your own activities for Fridays.`}
            textAlignment="center"
            actionButtons={[
              {
                text: 'Plan Fridays',
                textColour: 'white',
                colour: 'primary',
                type: 'filled',
                onClick: () => {
                  onCancel();
                },
                leadingIcon: 'ClipboardListIcon',
              },
              {
                text: 'Close',
                textColour: 'primary',
                colour: 'primary',
                type: 'outlined',
                onClick: () => {
                  onCancel();
                },
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  useEffect(() => {
    setIsFormValid(programmeTimingSchema.isValidSync(getValues()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedLanguage]);

  useEffect(() => {
    if (!selectedDate) return;

    const validatedDate = validateStartDate(new Date(selectedDate));

    let internalEndDate;

    if (!selectedTheme) {
      const endOfWeekDay = getNoThemedProgrammeEndDate(validatedDate);
      internalEndDate = endOfWeekDay.endDate;
    } else {
      setValue('endDate', getThemedProgrammeEndDate(validatedDate).toString());
      internalEndDate = getThemedProgrammeEndDate(validatedDate);
    }

    setAlert(internalEndDate);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const setAlert = useCallback(
    (date) => {
      const overlappingProgramme = getConflictingProgramme(
        new Date(selectedDate!),
        new Date(date)
      );

      if (overlappingProgramme) {
        setAlertState({
          title: 'This start date causes conflicts',
          list: [
            `This programme (${
              selectedTheme?.name || 'No theme'
            }) will run from <b>${getDateRangeText(
              new Date(selectedDate!).toString(),
              new Date(date).toString()
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
          ? `Your ${selectedTheme.name} programme will start on <b>${
              selectedDate
                ? format(new Date(selectedDate!), 'EEEE, d LLLL')
                : ''
            }</b> and end on <b>${
              date ? format(new Date(date!), 'EEEE, d LLLL') : ''
            }.</>`
          : `Your programme will be <b>${
              selectedTheme ? 20 : 20
            } day(s)</b> long, starting on <b>${
              selectedDate
                ? format(new Date(selectedDate!), 'EEEE, d LLLL')
                : ''
            }</b> and ending on <b>${
              date ? format(new Date(date!), 'EEEE, d LLLL') : ''
            }</b>.`,
        type: 'success',
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedDate, selectedTheme]
  );

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
          className="border-uiLight text-textMid w-full rounded-md"
          selected={selectedDate ? new Date(selectedDate) : undefined}
          onChange={(date: Date) => {
            setValue('date', date ? date.toString() : '');
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={new Date()}
        />

        <Typography
          className="mt-4"
          type="body"
          text="When would you like to end this programme?"
        />
        <DatePicker
          disabled={selectedDate == null}
          placeholderText={`Please select a date`}
          className="border-uiLight text-textMid w-full rounded-md"
          selected={endDate ? new Date(endDate) : undefined}
          onChange={(date: Date) => {
            setValue('endDate', date ? date.toString() : '');
            setAlert(date);
          }}
          dateFormat="EEE, dd MMM yyyy"
          minDate={addDays(new Date(), 1)}
          maxDate={getThemedProgrammeEndDate(validStartdDate!)}
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
