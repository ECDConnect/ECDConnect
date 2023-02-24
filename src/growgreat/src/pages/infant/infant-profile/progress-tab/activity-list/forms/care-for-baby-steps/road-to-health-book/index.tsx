import { Header, Label } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';
import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Dialog,
  DialogPosition,
  FormInput,
  ImageInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import {
  InfantRoadToHealthModel,
  infantRoadToHealthModelSchema,
} from '@/schemas/infant/infant-road-to-health';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { MaternalRecordExample } from '@/pages/infant/components/infant-road-to-health/maternalRecordExampleDialog';

const acceptedFormats = ['jpg', 'pdf', 'jpeg'];

export const RoadToHeathBookStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const { watch, formState, setValue, register } =
    useForm<InfantRoadToHealthModel>({
      resolver: yupResolver(infantRoadToHealthModelSchema),
      mode: 'onBlur',
      reValidateMode: 'onChange',
    });

  const { weightAtBirth, roadToHealthBook, notRoadToHealthBook } = watch();
  const { isValid } = formState;

  const [hasMaternalCaseRecord, setHasMaternalCaseRecord] = useState<
    boolean | null
  >(null);
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [maternalRecordExampleVisible, setMaternalRecordExampleVisible] =
    useState(false);

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  useEffect(() => {
    if (setEnableButton) {
      if (
        (hasMaternalCaseRecord && isValid && roadToHealthBook) ||
        (!hasMaternalCaseRecord && notRoadToHealthBook)
      ) {
        return setEnableButton(true);
      }

      return setEnableButton(false);
    }
  }, [
    hasMaternalCaseRecord,
    isValid,
    notRoadToHealthBook,
    roadToHealthBook,
    setEnableButton,
  ]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title="Road to Health Book"
        subTitle={name}
      />
      <div className="flex flex-col gap-4 p-4">
        <Label
          text={replaceBraces(
            "Does the caregiver have {client}'s Road to Health Book?",
            infant?.caregiver?.firstName || ''
          )}
        />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          onOptionSelected={(value) =>
            setHasMaternalCaseRecord(value as boolean)
          }
        />

        {!!hasMaternalCaseRecord && (
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
            <ImageInput<InfantRoadToHealthModel>
              acceptedFormats={acceptedFormats}
              label={''}
              nameProp="roadToHealthBook"
              icon="CameraIcon"
              iconContainerColor={'tertiary'}
              className={'pt-1'}
              currentImageString={roadToHealthBook}
              overrideOnClick={() => setPhotoActionBarVisible(true)}
              register={register}
              onValueChange={(imageString: string) =>
                setValue('roadToHealthBook', imageString)
              }
            ></ImageInput>
            <div className="flex items-center gap-1">
              <FormInput<InfantRoadToHealthModel>
                label={'Weight'}
                register={register}
                nameProp={'weightAtBirth'}
                placeholder={'Tap to add'}
                type={'number'}
                className="mt-4"
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
                label={'Length'}
                register={register}
                nameProp={'lengthAtBirth'}
                placeholder={'Tap to add'}
                type={'number'}
                className="mt-4"
              ></FormInput>
              <Typography
                type="h4"
                color={'textMid'}
                text={'cm'}
                className="mt-12"
              />
            </div>
            {!!weightAtBirth && Number(weightAtBirth) < 2.5 && (
              <Alert
                type={'warning'}
                message={'Low birth weight'}
                className="mt-6"
              />
            )}
          </>
        )}
        {hasMaternalCaseRecord === false && (
          <>
            <Typography
              type="h2"
              color={'textDark'}
              text={'Please confirm'}
              className="pt-6"
            />
            <div className="flex items-start gap-2">
              <Checkbox
                checked={notRoadToHealthBook}
                onCheckboxChange={(value) =>
                  setValue('notRoadToHealthBook', value.checked)
                }
              />
              <Typography
                text={`I do not have a copy of ${name}'s Road to Health Book. I declare that all information provided about ${name} is correct.`}
                type="body"
                color="textMid"
              />
            </div>
            <Alert
              type={'info'}
              message={`You will be required to upload ${name}'s document in a future visit.`}
            />
          </>
        )}
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
          onAction={(imageUrl: string) => {
            setValue('roadToHealthBook', imageUrl);
            setPhotoActionBarVisible(false);
          }}
          {...(!!roadToHealthBook && {
            onDelete: () => {
              setValue('roadToHealthBook', '');
              setPhotoActionBarVisible(false);
            },
          })}
        ></PhotoPrompt>
      </Dialog>
      <MaternalRecordExample
        isVisible={maternalRecordExampleVisible}
        onClose={() => setMaternalRecordExampleVisible(false)}
      />
    </>
  );
};
