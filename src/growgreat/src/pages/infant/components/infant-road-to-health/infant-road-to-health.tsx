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
  FormInput,
} from '@ecdlink/ui';
import { PhotoPrompt } from '../../../../components/photo-prompt/photo-prompt';
import { useForm, useFormState } from 'react-hook-form';
import { useState } from 'react';
import {
  PregnantMaternalCaseRecordProps,
  yesNoOptions,
} from './infant-road-to-health.types';
import {
  InfantRoadToHealthModel,
  infantRoadToHealthModelSchema,
} from '@/schemas/infant/infant-road-to-health';
import { InformationCircleIcon } from '@heroicons/react/outline';
import roadToHealth from '../../../../assets/roadToHealth.png';

export const InfantRoadToHealth: React.FC<PregnantMaternalCaseRecordProps> = ({
  onSubmit,
  infantDetails,
}) => {
  const {
    // watch,
    trigger,
    getValues: getRoadToHealthFormValues,
    // formState: pregnantMaternalRecordState,
    setValue: setRoadToHealthFormValue,
    register: roadToHealthFormRegister,
    // reset: resetRoadToHealthFormValue,
    control: roadToHealthControl,
  } = useForm<InfantRoadToHealthModel>({
    resolver: yupResolver(infantRoadToHealthModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({
    control: roadToHealthControl,
  });

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

  const setPhotoUrl = (imageUrl: string) => {
    setRoadToHealthFormValue('roadToHealthBook', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
    trigger();
  };

  const handleConsentAccept = () => {
    setRoadToHealthFormValue('notRoadToHealthBook', !confirmhasNoRecord);
  };

  return (
    <div className="h-screen ">
      <div>
        <Typography
          type="h2"
          color={'textDark'}
          text={`Child name`}
          className="z-50 pt-6"
        />
        <Typography
          type="h4"
          color={'textMid'}
          text={'Road to Health Book'}
          className="z-50 w-11/12 pt-2"
        />
      </div>
      <div>
        <Typography
          type="h4"
          color={'textMid'}
          text={`Does the caregiver have ${infantDetails?.firstName}'s Road to Health Book?`}
          className="z-50 mt-8 w-9/12"
        />
        <div className="mt-4">
          <ButtonGroup<boolean>
            options={yesNoOptions}
            onOptionSelected={(value: boolean | boolean[]) =>
              setHasMaternalCaseRecord(value as boolean)
            }
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'mt-2 w-full'}
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
            <div className="mt-4 flex w-11/12 items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className={confirmhasNoRecord ? 'bg-secondary' : 'bg-uiBg'}
                  onChange={() => {
                    setConfirmHasNoRecord(!confirmhasNoRecord);
                    handleConsentAccept();
                  }}
                />
                <Typography
                  text={
                    "I do not have a copy of Themba's Road to Health Book. I declare that all information provided about Themba is correct."
                  }
                  type="body"
                  color={'textMid'}
                  className="mt-2"
                />
              </div>
            </div>
            <div className={'mt-4 px-4'}>
              <Alert
                type={'info'}
                message={`You will be required to upload Themba's document in a future visit.`}
              />
            </div>
          </div>
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
                className="bg-infoDark grid h-6 w-6 place-items-center rounded-full"
              >
                <InformationCircleIcon
                  className="h-4 w-4 bg-transparent text-white"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className={'pt-1'}>
              <ImageInput<InfantRoadToHealthModel>
                acceptedFormats={acceptedFormats}
                label={''}
                nameProp="roadToHealthBook"
                icon="CameraIcon"
                className={'pt-1'}
                currentImageString={registrationFormPhotoUrl}
                overrideOnClick={() => setPhotoActionBarVisible(true)}
                register={roadToHealthFormRegister}
                onValueChange={(imageString: string) =>
                  setRoadToHealthFormValue('roadToHealthBook', imageString)
                }
              ></ImageInput>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <FormInput<InfantRoadToHealthModel>
                  label={'Weight at birth'}
                  register={roadToHealthFormRegister}
                  nameProp={'weightAtBirth'}
                  placeholder={'Tap to add'}
                  type={'text'}
                  className="mt-4"
                ></FormInput>
                <Typography
                  type="h4"
                  color={'textMid'}
                  text={'kg'}
                  className="z-50 mt-12"
                />
              </div>
              <div className="flex items-center gap-1">
                <FormInput<InfantRoadToHealthModel>
                  label={'Length at birth'}
                  register={roadToHealthFormRegister}
                  nameProp={'lengthAtBirth'}
                  placeholder={'Tap to add'}
                  type={'text'}
                  className="mt-4"
                ></FormInput>
                <Typography
                  type="h4"
                  color={'textMid'}
                  text={'cm'}
                  className="z-50 mt-12"
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex h-full w-full align-bottom">
        <div className={'mt-10 ml-2 flex w-11/12 justify-center align-bottom'}>
          <Button
            type={'filled'}
            color={'primary'}
            className={'absolute bottom-10 mt-2 max-h-10 w-11/12'}
            textColor={'white'}
            text={`Save`}
            icon={'ArrowCircleRightIcon'}
            iconPosition={'start'}
            onClick={() => {
              onSubmit(getRoadToHealthFormValues());
            }}
            disabled={!isValid && !confirmhasNoRecord}
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
                  setRoadToHealthFormValue('roadToHealthBook', '');
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
        <div className="mt-12 flex justify-center overflow-auto ">
          <div>
            <div className="flex justify-center">
              <div className="bg-infoDark grid h-16 w-16 place-items-center rounded-full">
                <InformationCircleIcon className="bg-trasparent h-12 w-12 text-white" />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Typography
                type="h2"
                align="center"
                weight="bold"
                color={'textDark'}
                text={'Page ii of the Road to Health Book'}
                className="z-50 w-9/12 pt-2"
              />
            </div>
            <div className="h-11/12 mt-6 flex w-full justify-center">
              <img
                src={roadToHealth}
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
                  "Page ii is the first page you should see when opening the book. It should have the child's basic details." +
                  '\n' +
                  '\n' +
                  'OR page 4 of the old Road to Health Book.' +
                  '\n' +
                  '\n' +
                  'If your client has an old version of the book, you can see the personal details on page 4.'
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
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
