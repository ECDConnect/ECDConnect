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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, useFormState } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getWeeksDiff } from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { MotherActions } from '@/store/mother/mother.actions';

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

  const [hasMaternalCaseRecord, setHasMaternalCaseRecord] = useState<boolean>();
  const acceptedFormats = ['jpg', 'pdf', 'jpeg'];
  const [registrationFormPhotoUrl, setRegistrationFormPhotoUrl] =
    useState<string>();
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [maternalRecordExampleVisible, setMaternalRecordExampleVisible] =
    useState(false);
  const [confirmHasNoRecord, setConfirmHasNoRecord] = useState(false);

  const currentDate = useMemo(() => new Date(), []);

  const [deliveryDate, setDeliveryDate] = useState(currentDate);

  const isMinDate = deliveryDate.getFullYear() === currentDate.getFullYear();

  const { isLoading } = useThunkFetchCall('mothers', MotherActions.ADD_MOTHER);

  const setPhotoUrl = (imageUrl: string) => {
    setPregnantMaternalCaseRecordFormValue('maternalCaseRecord', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
    trigger();
  };

  useEffect(() => {
    if (deliveryDate) {
      setPregnantMaternalCaseRecordFormValue('deliveryDate', deliveryDate);
    }
  }, [deliveryDate, setPregnantMaternalCaseRecordFormValue]);

  const handleConsentAccept = () => {
    setPregnantMaternalCaseRecordFormValue(
      'notHaveAMaternalRecord',
      !confirmHasNoRecord
    );
  };

  const diffDates = getWeeksDiff(currentDate, deliveryDate);
  const actualGestationWeek = 40 - diffDates;

  const getDate = (point: 'min' | 'max') => {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year =
      point === 'max'
        ? new Date().getFullYear() + 1
        : new Date().getFullYear() - 1;

    return new Date(`${month}/${day}/${year}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onYearChange = useCallback(
    (date: Date) => {
      if (deliveryDate.getFullYear() !== currentDate.getFullYear()) {
        return setDeliveryDate(currentDate);
      }

      return setDeliveryDate(date);
    },
    [currentDate, deliveryDate]
  );

  return (
    <>
      <Typography
        type="h2"
        color={'textDark'}
        text={`${details?.name}`}
        className="pt-6"
      />
      <Typography
        type="h4"
        color={'textMid'}
        text={'Maternal Case Record'}
        className="w-11/12 pt-2"
      />
      <div className="mt-4">
        <Typography
          type="h4"
          color={'textMid'}
          text={'Expected delivery date:'}
          className="w-11/12 pt-2"
        />
        <div className="flex items-center gap-1">
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-primary bg-uiBg focus:border-primary focus:ring-primary z-50 mt-1 w-full rounded-md border-none text-lg shadow-sm"
            popperClassName="z-50"
            selected={deliveryDate}
            onChange={(date: Date) => setDeliveryDate(date)}
            dateFormat="dd"
            {...(isMinDate && { minDate: currentDate })}
            renderCustomHeader={() => <div>Day</div>}
            onKeyDown={onKeyDown}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="text-primary bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
            popperClassName="z-50"
            selected={deliveryDate}
            onChange={(date: Date) => setDeliveryDate(date)}
            renderCustomHeader={() => <div>Month</div>}
            dateFormat="MMMM"
            {...(isMinDate && { minDate: currentDate })}
            showMonthYearPicker
            showPopperArrow={true}
            onKeyDown={onKeyDown}
          />
          <DatePicker
            placeholderText={'Please select a date'}
            className="bg-uiBg text-primary focus:border-primary focus:ring-primary z-50 mt-1 w-full rounded-md border-none text-lg shadow-sm"
            popperClassName="z-50"
            selected={deliveryDate}
            onChange={onYearChange}
            dateFormat="yyyy"
            minDate={getDate('min')}
            maxDate={getDate('max')}
            renderCustomHeader={() => <div>Year</div>}
            showYearPicker
            onKeyDown={onKeyDown}
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
          className="mb-2 w-11/12 pt-2"
        />
        <ButtonGroup<boolean>
          options={yesNoOptions}
          onOptionSelected={(value: boolean | boolean[]) =>
            setHasMaternalCaseRecord(value as boolean)
          }
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={'mt-2 w-full'}
          selectedOptions={hasMaternalCaseRecord}
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
              message={`You will need to upload ${details?.name}'s documents and expected delivery date in a future visit.`}
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
              className="w-9/12 pt-2"
            />
            <div
              onClick={() => setMaternalRecordExampleVisible(true)}
              className="bg-infoDark grid h-8 w-8 place-items-center rounded-full"
            >
              <InformationCircleIcon
                className="bg-trasparent h-auto w-auto text-white"
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
              iconContainerColor="tertiary"
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
          isLoading={isLoading}
          disabled={
            isLoading ||
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
        position={DialogPosition.Bottom}
        stretch
      >
        <PhotoPrompt
          hideEmojiOption
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
        className="m-5 overflow-auto rounded-2xl"
      >
        <div className="flex h-full flex-col items-center overflow-auto px-4 pt-7 pb-6">
          <div className="bg-infoDark grid h-11 w-11 place-items-center rounded-full">
            <InformationCircleIcon className="h-auto w-auto bg-transparent text-white" />
          </div>
          <div className="mt-4 flex justify-center">
            <Typography
              type="h2"
              align="center"
              weight="bold"
              color={'textDark'}
              text={'First page of Maternal Case Record'}
              className="pt-2"
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
              className="pt-2"
            />
          </div>
          <div className={'mt-4 flex h-full w-full items-end justify-center'}>
            <Button
              type={'filled'}
              color={'primary'}
              className={'max-h-10 w-full'}
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
