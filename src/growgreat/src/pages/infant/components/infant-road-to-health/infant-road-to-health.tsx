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
  renderIcon,
} from '@ecdlink/ui';
import { PhotoPrompt } from '../../../../components/photo-prompt/photo-prompt';
import { useForm, useFormState } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  PregnantMaternalCaseRecordProps,
  yesNoOptions,
} from './infant-road-to-health.types';
import {
  InfantRoadToHealthModel,
  infantRoadToHealthModelSchema,
} from '@/schemas/infant/infant-road-to-health';
import { MaternalRecordExample } from './maternalRecordExampleDialog';

export const InfantRoadToHealth: React.FC<PregnantMaternalCaseRecordProps> = ({
  onSubmit,
  infantDetails,
  weightAtBirth,
  lengthAtBirth,
  roadToHealthBook,
  isFromClientProfile,
}) => {
  const {
    watch,
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

  const { errors } = useFormState({
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

  const [confirmHasNoRecord, setConfirmHasNoRecord] = useState(false);

  const setPhotoUrl = (imageUrl: string) => {
    setRoadToHealthFormValue('roadToHealthBook', imageUrl);
    setRegistrationFormPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
    trigger(['roadToHealthBook', 'notRoadToHealthBook']);
  };

  const handleConsentAccept = () => {
    setRoadToHealthFormValue('notRoadToHealthBook', !confirmHasNoRecord);
  };

  useEffect(() => {
    if (isFromClientProfile) {
      setHasMaternalCaseRecord(true);
    }
  }, [isFromClientProfile]);

  useEffect(() => {
    if (roadToHealthBook) {
      setRoadToHealthFormValue('roadToHealthBook', roadToHealthBook);
      setRegistrationFormPhotoUrl(roadToHealthBook);
      setHasMaternalCaseRecord(true);
      setRegistrationFormPhotoUrl('');
    }
  }, [roadToHealthBook, setRoadToHealthFormValue]);

  useEffect(() => {
    watch();
  }, [watch]);

  return (
    <>
      <div>
        <Typography
          type="h2"
          color={'textDark'}
          text={`${infantDetails?.firstName}`}
          className="pt-6"
        />
        <Typography
          type="h4"
          color={'textMid'}
          text={'Road to Health Book'}
          className="w-11/12 pt-2"
        />
      </div>
      <div>
        {!isFromClientProfile && (
          <>
            <Typography
              type="h4"
              color={'textMid'}
              text={`Does the caregiver have ${infantDetails?.firstName}'s Road to Health Book?`}
              className="mt-8 w-9/12"
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
                selectedOptions={roadToHealthBook ? true : undefined}
              />
            </div>
          </>
        )}
        {hasMaternalCaseRecord === false && (
          <div>
            <div>
              <Typography
                type="h2"
                color={'textDark'}
                text={'Please confirm'}
                className="pt-6"
              />
            </div>
            <div className="mt-4 flex w-11/12 items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className={confirmHasNoRecord ? 'bg-secondary' : 'bg-uiBg'}
                  onChange={() => {
                    setConfirmHasNoRecord(!confirmHasNoRecord);
                    handleConsentAccept();
                  }}
                />
                <Typography
                  text={`I do not have a copy of ${infantDetails?.firstName}'s Road to Health Book. I declare that all information provided about ${infantDetails?.firstName} is correct.`}
                  type="body"
                  color={'textMid'}
                  className="mt-2"
                />
              </div>
            </div>
            <div className={'mt-4 px-4'}>
              <Alert
                type={'info'}
                message={`You will be required to upload ${infantDetails?.firstName}'s document in a future visit.`}
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
                text={'Take a photo of page ii of the Road to Health Book.'}
                className="w-9/12 pt-2"
              />
              <button onClick={() => setMaternalRecordExampleVisible(true)}>
                {renderIcon('InformationCircleIcon', 'h-6 w-6 text-infoMain')}
              </button>
            </div>
            <div className={'pt-1'}>
              <ImageInput<InfantRoadToHealthModel>
                acceptedFormats={acceptedFormats}
                label={''}
                nameProp="roadToHealthBook"
                icon="CameraIcon"
                iconContainerColor={'tertiary'}
                className={'pt-1'}
                currentImageString={registrationFormPhotoUrl}
                overrideOnClick={() => setPhotoActionBarVisible(true)}
                register={roadToHealthFormRegister}
                onValueChange={(imageString: string) => {
                  setRoadToHealthFormValue('roadToHealthBook', imageString);
                  trigger();
                }}
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
                  error={
                    !!errors.weightAtBirth ? errors.weightAtBirth : undefined
                  }
                ></FormInput>
                <Typography
                  type="h4"
                  color={'textMid'}
                  text={'kg'}
                  className="mt-12"
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
                  error={
                    !!errors.lengthAtBirth ? errors.lengthAtBirth : undefined
                  }
                ></FormInput>
                <Typography
                  type="h4"
                  color={'textMid'}
                  text={'cm'}
                  className="mt-12"
                />
              </div>
              {String(getRoadToHealthFormValues('weightAtBirth'))?.length > 0 &&
                Number(getRoadToHealthFormValues('weightAtBirth')) < 2.5 && (
                  <Alert
                    type={'warning'}
                    message={'Low birth weight'}
                    className="mt-6"
                  />
                )}
            </div>
          </>
        )}
      </div>
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className="mt-6 w-full"
          textColor={'white'}
          text={isFromClientProfile ? `Save` : `Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getRoadToHealthFormValues());
          }}
          disabled={
            (hasMaternalCaseRecord && !!Object.keys(errors).length) ||
            (hasMaternalCaseRecord &&
              !getRoadToHealthFormValues('roadToHealthBook')) ||
            (!hasMaternalCaseRecord && !confirmHasNoRecord)
          }
        />
      </div>
      <Dialog
        visible={photoActionBarVisible}
        position={DialogPosition.Bottom}
        stretch
      >
        <PhotoPrompt
          title="Road to Health Book, page ii"
          hideEmojiOption
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
      <MaternalRecordExample
        isVisible={maternalRecordExampleVisible}
        onClose={() => setMaternalRecordExampleVisible(false)}
      />
    </>
  );
};
