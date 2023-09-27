import { Header, Label } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { replaceBraces, usePrevious } from '@ecdlink/core';
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
import { InfantRoadToHealthModel } from '@/schemas/infant/infant-road-to-health';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import { MaternalRecordExample } from '@/pages/infant/components/infant-road-to-health/maternalRecordExampleDialog';
import { useStaticData } from '@/hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { newGuid } from '@/utils/common/uuid.utils';
import { documentActions, documentThunkActions } from '@/store/document';
import { Document } from '@ecdlink/core/lib';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useAppDispatch } from '@/store';
import { DocumentActions } from '@/store/document/document.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { infantRoadToHealthModelSchema } from './infant-road-to-health';
import { InfantModelInput } from '@/../../../packages/graphql/lib';

const acceptedFormats = ['jpg', 'pdf', 'jpeg'];

export const RoadToHeathBookStep = ({
  infant,
  setInfantInput,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const {
    watch,
    setValue,
    register,
    control: infantRoadToHealthControl,
  } = useForm<InfantRoadToHealthModel>({
    resolver: yupResolver(infantRoadToHealthModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const {
    weightAtBirth,
    lengthAtBirth,
    roadToHealthBook,
    notRoadToHealthBook,
  } = watch();

  const { errors } = useFormState({ control: infantRoadToHealthControl });

  const visitSection = 'Road to Health Book';

  const [hasMaternalCaseRecord, setHasMaternalCaseRecord] = useState<
    boolean | null
  >(null);
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [maternalRecordExampleVisible, setMaternalRecordExampleVisible] =
    useState(false);

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const question1 = "Does the caregiver have {client}'s Road to Health Book?";

  const previousWeight = usePrevious(weightAtBirth);
  const previousLength = usePrevious(lengthAtBirth);
  const previousRoadToHealthBook = usePrevious(roadToHealthBook);
  const previousHasMaternalCaseRecord = usePrevious(hasMaternalCaseRecord);
  const previousNotRoadToHealthBook = usePrevious(notRoadToHealthBook);
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();

  const user = useSelector(userSelectors.getUser);

  const appDispatch = useAppDispatch();

  const { isRejected, isLoading } = useThunkFetchCall(
    'documents',
    DocumentActions.CREATE_DOCUMENT
  );

  const wasLoading = usePrevious(isLoading);

  const { errorDialog } = useRequestResponseDialog();

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  //if the infant didn't have RTH book when created, the weightAtBirth and lengthAtBirth wouldn't be set, so set it now
  const onUpdateInfant = useCallback(async () => {
    if (infant?.user?.id) {
      let input: InfantModelInput = {
        weightAtBirth: Number(weightAtBirth),
        lengthAtBirth: Number(lengthAtBirth),
        dateOfBirth: infant?.user?.dateOfBirth,
      };
      setInfantInput?.(input);
    }
  }, [lengthAtBirth, weightAtBirth]);

  const onSubmitDocument = useCallback(async () => {
    if (infant?.user?.id) {
      const fileName = 'roadtohealthbook.png';
      const workflowStatusId = getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentPendingVerification
      );
      const documentTypeId = getDocumentTypeIdByEnum(
        FileTypeEnum.RoadToHealthBook
      );
      const documentInputModel: Document = {
        id: newGuid(),
        userId: infant?.user.id,
        createdUserId: user?.id ?? '',
        workflowStatusId: workflowStatusId ?? '',
        documentTypeId: documentTypeId ?? '',
        name: fileName,
        fileName: fileName,
        file: roadToHealthBook,
        fileType: FileTypeEnum.RoadToHealthBook,
      };

      appDispatch(documentActions.createDocument(documentInputModel));
      await appDispatch(
        documentThunkActions.createDocument(documentInputModel)
      ).unwrap();
    }
  }, [
    appDispatch,
    getDocumentTypeIdByEnum,
    getWorkflowStatusIdByEnum,
    infant,
    roadToHealthBook,
    user?.id,
  ]);

  const onOptionSelected = useCallback(() => {
    if (
      previousLength === lengthAtBirth &&
      previousWeight === weightAtBirth &&
      previousRoadToHealthBook === roadToHealthBook &&
      previousHasMaternalCaseRecord === hasMaternalCaseRecord &&
      previousNotRoadToHealthBook === notRoadToHealthBook
    )
      return;

    setSectionQuestions?.([
      {
        visitSection,
        questions: [
          {
            question: question1,
            answer: String(hasMaternalCaseRecord),
          },
          {
            question: 'Weight',
            answer: String(weightAtBirth),
          },
          {
            question: 'Length',
            answer: String(lengthAtBirth),
          },
          {
            question: 'Take a photo of page ii of the Road to Health Book.',
            answer: roadToHealthBook,
          },
        ],
      },
    ]);

    const withDocument =
      !!roadToHealthBook &&
      Number(lengthAtBirth) > 0 &&
      Number(weightAtBirth) > 0;

    const isAllCompleted =
      (hasMaternalCaseRecord && withDocument) ||
      (!hasMaternalCaseRecord && !!notRoadToHealthBook);

    setEnableButton?.(isAllCompleted);

    if (hasMaternalCaseRecord && withDocument) {
      onUpdateInfant();
    }
    if (roadToHealthBook && previousRoadToHealthBook !== roadToHealthBook) {
      onSubmitDocument();
    }
  }, [
    hasMaternalCaseRecord,
    lengthAtBirth,
    notRoadToHealthBook,
    onSubmitDocument,
    onUpdateInfant,
    previousHasMaternalCaseRecord,
    previousLength,
    previousNotRoadToHealthBook,
    previousRoadToHealthBook,
    previousWeight,
    roadToHealthBook,
    setEnableButton,
    setSectionQuestions,
    weightAtBirth,
  ]);

  useEffect(() => {
    if (wasLoading && isRejected) {
      errorDialog();
    }
  }, [errorDialog, isRejected, wasLoading]);

  useEffect(() => {
    onOptionSelected();
  }, [onOptionSelected]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={visitSection}
        subTitle={name}
      />
      <div className="flex flex-col gap-4 p-4">
        <Label text={replaceBraces(question1, name || '')} />
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
                id={'weight'}
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
                label={'Length'}
                register={register}
                nameProp={'lengthAtBirth'}
                placeholder={'Tap to add'}
                type={'number'}
                className="mt-4"
                id={'length'}
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
