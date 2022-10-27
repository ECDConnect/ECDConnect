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
} from '@ecdlink/ui';
import { PhotoPrompt } from '../../../../components/photo-prompt/photo-prompt';
import { differenceInWeeks } from 'date-fns';
import DatePicker from 'react-datepicker';
import { useForm, useFormState } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  PregnantMaternalCaseRecordProps,
  yesNoOptions,
} from './pregnant-maternal-record.types';
import {
  pregnantMaternalCaseRecordModelSchema,
  PregnantMaternalCaseRecordModel,
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
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({
    control: pregnantMaternalCaseRecordControl,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [useMap, setUseMap] = useState(false);
  const [hasMaternalCaseRecord, setHasMaternalCaseRecord] = useState<any>(null);
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
  const [confirmhasNoRecord, setConfirmHasNoRecord] = useState(false);
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
      !confirmhasNoRecord
    );
  };

  const diffDates = differenceInWeeks(myDay, currentDate);
  const actualGestationWeek = 40 - diffDates;

  return (
    <div className="h-screen ">
      <div>
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
          className="z-50 pt-2 w-11/12"
        />
      </div>
      <div>
        <div className="mt-4">
          <Typography
            type="h4"
            color={'textMid'}
            text={'Expected delivery date:'}
            className="z-50 pt-2 w-11/12"
          />
          <div className="flex items-center gap-1">
            <DatePicker
              placeholderText={'Please select a date'}
              className="mt-1 w-full text-primary bg-uiBg border-none rounded-md text-lg focus:border-primary focus:ring-primary shadow-sm"
              selected={myDay}
              onChange={(date: Date) => setMyDay(date)}
              dateFormat="dd"
              renderDayContents={renderDayContents}
              renderCustomHeader={({ date }) => <div></div>}
            />
            <DatePicker
              placeholderText={'Please select a date'}
              className="mt-1 w-full text-primary bg-uiBg border-none rounded-md text-lg focus:border-primary focus:ring-primary shadow-sm"
              selected={myMonth}
              onChange={(date: Date) => setMyMonth(date)}
              renderCustomHeader={({ date }) => <div></div>}
              dateFormat="MMMM"
              showMonthYearPicker
              showPopperArrow={true}
            />
            <DatePicker
              placeholderText={'Please select a date'}
              className="mt-1 w-full bg-uiBg text-primary border-none rounded-md text-lg focus:border-primary focus:ring-primary shadow-sm"
              selected={myYear}
              onChange={(date: Date) => setMyYear(date)}
              dateFormat="yyyy"
              showYearPicker
            />
          </div>
        </div>
        <div className={'mt-4 px-4'}>
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
            className="z-50 pt-2 w-11/12"
          />
          <ButtonGroup<boolean>
            options={yesNoOptions}
            onOptionSelected={(value: boolean | boolean[]) =>
              setHasMaternalCaseRecord(value as boolean)
            }
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full mt-2'}
            selectedOptions={useMap}
          />
        </div>
        {hasMaternalCaseRecord === false && (
          <div>
            <div>
              <Typography
                type="h2"
                color={'textDark'}
                text={'Please confirm'}
                className="z-50 pt-6"
              />
            </div>
            <div className="flex w-11/12 justify-between items-center mt-4">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  className={confirmhasNoRecord ? 'bg-secondary' : 'bg-uiBg'}
                  onChange={() => {
                    setConfirmHasNoRecord(!confirmhasNoRecord);
                    handleConsentAccept();
                  }}
                />
                <Typography
                  text={`I do not have a copy of ${details?.name}'s Maternal Case Record. I declare that all information provided about ${details?.name} is accurate.`}
                  type="body"
                  color={'textMid'}
                  className="mt-8"
                />
              </div>
            </div>
            <div className={'mt-4 px-4'}>
              <Alert
                type={'info'}
                message={`You will need to upload Lethabo's documents and expected delivery date in a future visit.`}
              />
            </div>
          </div>
        )}
        {hasMaternalCaseRecord === true && (
          <>
            <div className="flex items-center justify-between mt-4">
              <Typography
                type="h4"
                weight="bold"
                color={'textMid'}
                text={"Take a photo of the client's Maternal Case Record"}
                className="z-50 pt-2 w-9/12"
              />
              <div
                onClick={() => setMaternalRecordExampleVisible(true)}
                className="bg-infoDark h-10 w-10 rounded-full grid place-items-center"
              >
                <InformationCircleIcon
                  className="h-5 w-5 bg-trasparent text-white"
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
              ></ImageInput>
            </div>
          </>
        )}
      </div>
      <div className="flex w-full h-full align-bottom">
        <div className={'mt-10 w-11/12 flex justify-center align-bottom ml-2'}>
          <Button
            type={'filled'}
            color={'primary'}
            className={'mt-2 w-11/12 max-h-10 absolute bottom-10'}
            textColor={'white'}
            text={`Save`}
            icon={'ArrowCircleRightIcon'}
            iconPosition={'start'}
            onClick={() => {
              onSubmit(getPregnantMaternalCaseRecordFormValues());
            }}
            disabled={!isValid}
          />
        </div>
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
        ></PhotoPrompt>
      </Dialog>
      <Dialog
        visible={maternalRecordExampleVisible}
        position={DialogPosition.Middle}
        fullScreen
        className="overflow-auto"
      >
        <div className="flex justify-center mt-12 overflow-auto ">
          <div>
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-infoDark rounded-full grid place-items-center">
                <InformationCircleIcon className="h-12 w-12 bg-trasparent text-white" />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Typography
                type="h2"
                align="center"
                weight="bold"
                color={'textDark'}
                text={'First page of Maternal Case Record'}
                className="z-50 pt-2 w-9/12"
              />
            </div>
            <div className="h-11/12 w-full flex justify-center mt-6">
              <img
                src={maternalRecord}
                alt="maternal record"
                className="w-7/12 h-9/12"
              />
            </div>
            <div className="flex justify-center mt-4">
              <Typography
                type="body"
                align="center"
                color={'textMid'}
                text={
                  'The first page of the document should have the client’s basic details, including their name, ID number, etc.'
                }
                className="z-50 pt-2 w-9/12"
              />
            </div>
            <div className={'mt-4 w-11/12 flex justify-center ml-4'}>
              <Button
                type={'filled'}
                color={'primary'}
                className={'w-11/12 max-h-10'}
                textColor={'white'}
                text={`Close`}
                icon={'XIcon'}
                iconPosition={'start'}
                onClick={() => setMaternalRecordExampleVisible(false)}
                disabled={!isValid && !confirmhasNoRecord}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
