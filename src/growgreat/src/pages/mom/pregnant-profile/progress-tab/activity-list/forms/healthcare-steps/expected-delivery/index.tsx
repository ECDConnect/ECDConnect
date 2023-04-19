import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Dialog,
  DialogPosition,
  ImageInput,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Translations } from './translations';
import ReactDatePicker from 'react-datepicker';
import { getNextDateByDay, getWeeksDiff, replaceBraces } from '@ecdlink/core';
import { yesNoOptions } from '@/pages/mom/components/pregnant-address/pregnant-address.types';
import { InformationCircleIcon } from '@heroicons/react/solid';
import {
  initialPregnantMaternalCaseRecordValues,
  PregnantMaternalCaseRecordModel,
  pregnantMaternalCaseRecordModelSchema,
} from '@/schemas/pregnant/pregnant-maternal-case-record';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import maternalRecord from '../../../../../../../../assets/maternalRecord.png';

export const ClinicExpectedDeliverySection = 'Expected Delivery';

export const ExpectedDeliveryStep = ({
  mother,
  isTipPage,
  setSectionQuestions: setQuestions,
  setEnableButton,
  setIsTip,
  sectionQuestions,
}: DynamicFormProps) => {
  const {
    trigger,
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

  const [currentOption, setCurrentOption] = useState<string>();

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
  const expectedDeliveryDate = new Date(mother?.expectedDateOfDelivery!);
  const [deliveryDate, setDeliveryDate] = useState(expectedDeliveryDate);

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

  const diffDates = getWeeksDiff(currentDate, deliveryDate);

  const actualGestationWeek = 40 - diffDates;

  const handleConsentAccept = () => {
    setPregnantMaternalCaseRecordFormValue(
      'notHaveAMaternalRecord',
      !confirmHasNoRecord
    );
  };

  const setPhotoUrl = (imageUrl: string) => {
    setPregnantMaternalCaseRecordFormValue('maternalCaseRecord', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
    trigger();
  };

  const { maternalCaseRecord, notHaveAMaternalRecord } = useWatch({
    control: pregnantMaternalCaseRecordControl,
  });

  useEffect(() => {
    if (setEnableButton) {
      if (
        (hasMaternalCaseRecord && isValid && deliveryDate) ||
        (!hasMaternalCaseRecord && deliveryDate)
      ) {
        setQuestions?.([
          {
            visitSection: ClinicExpectedDeliverySection,
            questions: [
              {
                question: 'Expected delivery Date',
                answer: String(deliveryDate),
              },
              {
                question: 'Does {client} have her Maternal Case Record?',
                answer: hasMaternalCaseRecord,
              },
              {
                question: 'Take a photo of page ii of the Road to Health Book.',
                answer: maternalCaseRecord,
              },
            ],
          },
        ]);
        return setEnableButton(true);
      }

      return setEnableButton(false);
    }
  }, [
    hasMaternalCaseRecord,
    isValid,
    setEnableButton,
    setQuestions,
    deliveryDate,
    notHaveAMaternalRecord,
    maternalCaseRecord,
    confirmHasNoRecord,
  ]);

  if (isTipPage && currentOption) {
    return (
      <Translations
        toTranslate={currentOption}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title={ClinicExpectedDeliverySection}
      />
      <div className="flex flex-col p-4">
        <div className="mt-4">
          <Typography
            type="h4"
            color={'textMid'}
            text={'Expected delivery date:'}
            className="w-11/12 pt-2"
          />
          <div className="flex items-center gap-1">
            <ReactDatePicker
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
            />
            <ReactDatePicker
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
            />
            <ReactDatePicker
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
            text={
              sectionQuestions?.[1]?.questions?.[1]?.question
                ? replaceBraces(
                    sectionQuestions?.[1]?.questions?.[1]?.question!,
                    mother?.user?.firstName!
                  )
                : ''
            }
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
                  text={`I do not have a copy of ${mother?.user?.firstName}'s Maternal Case Record. I declare that all information provided about ${mother?.user?.firstName} is accurate.`}
                  type="body"
                  color={'textMid'}
                  className="mt-4"
                />
              </div>
            </div>
            <div className={'mt-4'}>
              <Alert
                type={'info'}
                message={`You will need to upload ${mother?.user?.firstName}'s documents and expected delivery date in a future visit.`}
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
                  className="bg-trasparent text-infoMain h-auto w-auto"
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
        {/* <div className="flex h-full items-end">
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
      </div> */}
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
                // disabled={!isValid && !confirmHasNoRecord}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};
