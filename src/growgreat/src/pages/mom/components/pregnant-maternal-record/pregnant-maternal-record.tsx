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
  renderIcon,
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
import maternalRecord from '../../../../assets/maternalRecord.png';
import { getNextDateByDay, getWeeksDiff } from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { MotherActions } from '@/store/mother/mother.actions';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';
import { DocumentActions } from '@/store/document/document.actions';

export const PregnantMaternalCaseRecord: React.FC<
  PregnantMaternalCaseRecordProps
> = ({ onSubmit, details, isFromClientProfile }) => {
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

  const tomorrow = getNextDateByDay(1);

  const dateAfter280days = getNextDateByDay(280);

  const [deliveryDate, setDeliveryDate] = useState(tomorrow);

  const { isLoading } = useThunkFetchCall('mothers', MotherActions.ADD_MOTHER);
  const { isLoading: isLoadingEventRecord } = useThunkFetchCall(
    'eventRecord',
    EventRecordActions.ADD_EVENT_RECORD
  );
  const { isLoading: isLoadingCreateDocument } = useThunkFetchCall(
    'documents',
    DocumentActions.CREATE_DOCUMENT
  );

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

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const onYearChange = useCallback(
    (date: Date) => {
      if (deliveryDate.getFullYear() !== tomorrow.getFullYear()) {
        return setDeliveryDate(tomorrow);
      }

      return setDeliveryDate(date);
    },
    [tomorrow, deliveryDate]
  );

  const onMonthChange = useCallback(
    (date: Date) => {
      if (date.getMonth() === tomorrow.getMonth()) {
        return setDeliveryDate(tomorrow);
      }
      setDeliveryDate(date);
    },
    [tomorrow]
  );

  useEffect(() => {
    if (isFromClientProfile) {
      setHasMaternalCaseRecord(true);
    }
  }, [isFromClientProfile]);

  const handleDateChangeRaw = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

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
        className="mb-4 w-11/12 pt-2"
      />
      {!isFromClientProfile && (
        <>
          <Typography
            type="h4"
            color={'textDark'}
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
        </>
      )}
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
          <Typography
            type="h4"
            color={'textDark'}
            text={'Expected delivery date:'}
            className="w-11/12 pt-4"
          />
          <div className="flex items-center gap-1">
            <DatePicker
              placeholderText={'Please select a date'}
              className="text-primary bg-uiBg focus:border-primary focus:ring-primary z-50 mt-1 w-full rounded-md border-none text-lg shadow-sm"
              popperClassName="z-50"
              selected={deliveryDate}
              onChange={(date: Date) => setDeliveryDate(date)}
              dateFormat="dd"
              minDate={tomorrow}
              maxDate={dateAfter280days}
              renderCustomHeader={() => <div>Day</div>}
              onKeyDown={onKeyDown}
              disabledKeyboardNavigation
              onFocus={(e) => e.target.blur()}
              onChangeRaw={(e) => handleDateChangeRaw(e)}
            />
            <DatePicker
              placeholderText={'Please select a date'}
              className="text-primary bg-uiBg focus:border-primary focus:ring-primary mt-1 w-full rounded-md border-none text-lg shadow-sm"
              popperClassName="z-50"
              selected={deliveryDate}
              onChange={onMonthChange}
              renderCustomHeader={() => <div>Month</div>}
              dateFormat="MMMM"
              minDate={tomorrow}
              maxDate={dateAfter280days}
              showMonthYearPicker
              showPopperArrow={true}
              onKeyDown={onKeyDown}
              disabledKeyboardNavigation
              onFocus={(e) => e.target.blur()}
              onChangeRaw={(e) => handleDateChangeRaw(e)}
            />
            <DatePicker
              placeholderText={'Please select a date'}
              className="bg-uiBg text-primary focus:border-primary focus:ring-primary z-50 mt-1 w-full rounded-md border-none text-lg shadow-sm"
              popperClassName="z-50"
              selected={deliveryDate}
              onChange={onYearChange}
              dateFormat="yyyy"
              minDate={tomorrow}
              maxDate={dateAfter280days}
              renderCustomHeader={() => <div>Year</div>}
              showYearPicker
              onKeyDown={onKeyDown}
              disabledKeyboardNavigation
              onFocus={(e) => e.target.blur()}
              onChangeRaw={(e) => handleDateChangeRaw(e)}
            />
          </div>
          <Alert
            type={'info'}
            message={`About ${actualGestationWeek} weeks pregnant`}
            className="mt-4"
          />
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
              className="h-8 w-8 place-items-center rounded-full"
            >
              {renderIcon('InformationCircleIcon', 'text-infoMain')}
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
          isLoading={
            isLoading || isLoadingEventRecord || isLoadingCreateDocument
          }
          disabled={
            isLoading ||
            isLoadingEventRecord ||
            isLoadingCreateDocument ||
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
          <div className="h-11 w-11 place-items-center rounded-full">
            {renderIcon('InformationCircleIcon', 'text-infoMain')}
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
