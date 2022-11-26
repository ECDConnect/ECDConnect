import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dialog,
  Typography,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  ImageInput,
  DialogPosition,
  Checkbox,
} from '@ecdlink/ui';
import { PhotoPrompt } from '../../../../components/photo-prompt/photo-prompt';
import { differenceInWeeks } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, useFormState } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  PregnantMaternalCaseRecordProps,
  yesNoOptions,
} from './pregnant-maternal-record.types';
import {
  pregnantMaternalCaseRecordModelSchema,
  PregnantMaternalCaseRecordModel,
  initialPregnantMaternalCaseRecordValues,
} from '@/schemas/pregnant/pregnant-maternal-case-record';
import { InformationCircleIcon } from '@heroicons/react/outline';
import maternalRecord from '../../../../assets/maternalRecord.png';

export const PregnantMaternalCaseRecord: React.FC<
  PregnantMaternalCaseRecordProps
> = ({ onSubmit, details }) => {
  const {
    trigger,
    getValues: getPregnantMaternalCaseRecordFormValues,
    // formState: pregnantMaternalRecordState,
    setValue: setPregnantMaternalCaseRecordFormValue,
    register: pregnantMaternalCaseRecordFormRegister,
    // reset: resetPregnantMaternalCaseRecordFormValue,
    control: pregnantMaternalCaseRecordControl,
  } = useForm<PregnantMaternalCaseRecordModel>({
    resolver: yupResolver(pregnantMaternalCaseRecordModelSchema),
    mode: 'onBlur',
    defaultValues: initialPregnantMaternalCaseRecordValues,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({
    control: pregnantMaternalCaseRecordControl,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useMap, setUseMap] = useState(false);
  const [hasMaternalCaseRecord, setHasMaternalCaseRecord] =
    useState<any>(false);
  const acceptedFormats = ['jpg', 'pdf', 'jpeg'];
  const [registrationFormPhotoUrl, setRegistrationFormPhotoUrl] =
    useState<string>();
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [maternalRecordExampleVisible, setMaternalRecordExampleVisible] =
    useState(false);
  //   const handleConsentAccept = () => {
  //     setConsentFormValue('hasConsent', !accept);
  //   };
  const [confirmHasNoRecord, setConfirmHasNoRecord] = useState(false);
  const currentDate = new Date();

  const [myMonth, setMyMonth] = useState(currentDate);
  const [myYear, setMyYear] = useState(currentDate);
  const [myDay, setMyDay] = useState(currentDate);

  const minDate = new Date(myYear.getFullYear(), myMonth.getMonth(), 1);
  const maxDate = new Date(myYear.getFullYear(), myMonth.getMonth() + 1, 0);

  const renderDayContents = (day: any, date: any) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  const setPhotoUrl = (imageUrl: string) => {
    setPregnantMaternalCaseRecordFormValue('maternalCaseRecord', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
    trigger();
  };

  useEffect(() => {
    setMyDay(new Date(myYear.getFullYear(), myMonth.getMonth(), 1));
  }, [myMonth, myYear, setMyDay]);

  useEffect(() => {
    if (myDay) {
      setPregnantMaternalCaseRecordFormValue('deliveryDate', myDay);
    }
  }, [myDay, setPregnantMaternalCaseRecordFormValue]);

  const handleConsentAccept = () => {
    setPregnantMaternalCaseRecordFormValue(
      'notHaveAMaternalRecord',
      !confirmHasNoRecord
    );
  };

  const diffDates = differenceInWeeks(myDay, currentDate);
  const actualGestationWeek = 40 - diffDates;

  return (
    <>
      <Typography
        type="h2"
        color={'textDark'}
        text={`${details?.name}`}
        className="z-50 pt-6"
      />
      <Typography
        type="h4"
        color={'textMid'}
        text={'Maternal Case Record'}
        className="z-50 w-11/12 pt-2"
      />
      <div className="mt-4">
        <Typography
          type="h4"
          color={'textMid'}
          text={'Expected delivery date:'}
          className="z-50 w-11/12 pt-2"
        />
        <div className="flex items-center gap-1">
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-primary bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myDay}
            onChange={(date: Date) => setMyDay(date)}
            dateFormat="dd"
            renderDayContents={renderDayContents}
            renderCustomHeader={({ date }) => <div></div>}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-primary bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myMonth}
            onChange={(date: Date) => setMyMonth(date)}
            renderCustomHeader={({ date }) => <div></div>}
            dateFormat="MMMM"
            showMonthYearPicker
            showPopperArrow={true}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="bg-uiBg text-primary focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            selected={myYear}
            onChange={(date: Date) => setMyYear(date)}
            dateFormat="yyyy"
            showYearPicker
          />
        </div>
      </div>
      <div className={'mt-4'}>
        <Alert
          type={'info'}
          message={`About ${actualGestationWeek} weeks pregnant`}
        />
      </div>
      <div className="mt-4">
        <Typography
          type="h4"
          color={'textMid'}
          text={`Does ${details?.name} have her Maternal Case Record?`}
          className="z-50 mb-2 w-11/12 pt-2"
        />
        <ButtonGroup<boolean>
          options={yesNoOptions}
          onOptionSelected={(value: boolean | boolean[]) =>
            setHasMaternalCaseRecord(value as boolean)
          }
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={'mt-2 w-full'}
          selectedOptions={useMap}
        />
      </div>
      {hasMaternalCaseRecord === false && (
        <>
          <Typography
            type="h2"
            color={'textDark'}
            text={'Please confirm:'}
            className="pt-6"
          />
          <div className="flex w-11/12 items-center justify-between">
            <div className="flex items-center gap-1">
              <Checkbox
                checked={confirmHasNoRecord}
                onCheckboxChange={() => {
                  setConfirmHasNoRecord(!confirmHasNoRecord);
                  handleConsentAccept();
                }}
                checkboxColor="primaryAccent2"
              />
              <Typography
                text={`I do not have a copy of ${details?.name}'s Maternal Case Record. I declare that all information provided about ${details?.name} is accurate.`}
                type="body"
                color={'textMid'}
                className="mt-4"
              />
            </div>
          </div>
          <div className={'mt-4'}>
            <Alert
              type={'info'}
              message={`You will need to upload Lethabo's documents and expected delivery date in a future visit.`}
            />
          </div>
        </>
      )}
      {hasMaternalCaseRecord === true && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <Typography
              type="h4"
              weight="bold"
              color={'textMid'}
              text={"Take a photo of the client's Maternal Case Record"}
              className="z-50 w-9/12 pt-2"
            />
            <div
              onClick={() => setMaternalRecordExampleVisible(true)}
              className="bg-infoDark grid h-10 w-10 place-items-center rounded-full"
            >
              <InformationCircleIcon
                className="bg-trasparent h-5 w-5 text-white"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className={'pt-1'}>
            <ImageInput<PregnantMaternalCaseRecordModel>
              acceptedFormats={acceptedFormats}
              label={''}
              nameProp="maternalCaseRecord"
              icon="CameraIcon"
              className={'pt-1'}
              currentImageString={registrationFormPhotoUrl}
              overrideOnClick={() => setPhotoActionBarVisible(true)}
              register={pregnantMaternalCaseRecordFormRegister}
              onValueChange={(imageString: string) =>
                setPregnantMaternalCaseRecordFormValue(
                  'maternalCaseRecord',
                  imageString
                )
              }
            />
          </div>
        </>
      )}
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          textColor={'white'}
          text={`Save`}
          icon={'SaveIcon'}
          iconPosition={'start'}
          className={'mt-4 w-full'}
          onClick={() => {
            onSubmit(getPregnantMaternalCaseRecordFormValues());
          }}
          disabled={
            !isValid ||
            (!hasMaternalCaseRecord &&
              !getPregnantMaternalCaseRecordFormValues()
                .notHaveAMaternalRecord) ||
            (hasMaternalCaseRecord &&
              !getPregnantMaternalCaseRecordFormValues().maternalCaseRecord)
          }
        />
      </div>
      <Dialog
        visible={photoActionBarVisible}
        position={DialogPosition.Middle}
        stretch
      >
        <PhotoPrompt
          title="Maternal case record form"
          onClose={() => setPhotoActionBarVisible(false)}
          onAction={(imageUrl: string) => setPhotoUrl(imageUrl)}
          onDelete={
            registrationFormPhotoUrl
              ? () => {
                  setPregnantMaternalCaseRecordFormValue(
                    'maternalCaseRecord',
                    ''
                  );
                  setRegistrationFormPhotoUrl(undefined);
                  setPhotoActionBarVisible(false);
                }
              : undefined
          }
        />
      </Dialog>
      <Dialog
        fullScreen
        visible={maternalRecordExampleVisible}
        position={DialogPosition.Middle}
        className="overflow-auto"
      >
        <div className="mt-12 flex justify-center overflow-auto ">
          <div className="bg-infoDark grid h-16 w-16 place-items-center rounded-full">
            <InformationCircleIcon className="h-12 w-12 bg-transparent text-white" />
          </div>
          <div className="mt-4 flex justify-center">
            <Typography
              type="h2"
              align="center"
              weight="bold"
              color={'textDark'}
              text={'First page of Maternal Case Record'}
              className="z-50 w-9/12 pt-2"
            />
          </div>
          <div className="h-11/12 mt-6 flex w-full justify-center">
            <img
              src={maternalRecord}
              alt="maternal record"
              className="h-9/12 w-7/12"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Typography
              type="body"
              align="center"
              color={'textMid'}
              text={
                "The first page of the document should have the client's basic details, including their name, ID number, etc."
              }
              className="z-50 w-9/12 pt-2"
            />
          </div>
          <div className={'mt-4 ml-4 flex w-11/12 justify-center'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'max-h-10 w-11/12'}
              textColor={'white'}
              text={`Close`}
              icon={'XIcon'}
              iconPosition={'start'}
              onClick={() => setMaternalRecordExampleVisible(false)}
              disabled={!isValid && !confirmHasNoRecord}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
