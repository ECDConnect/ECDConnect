import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';
import {
  Alert,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  ImageInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import {
  SectionQuestions,
  visitSection,
} from '../../startup-accept-agreement.types';
import { useForm } from 'react-hook-form';
import {
  ProgrammeDetailsModel,
  ProgrammeDetailsSchema,
} from '@/schemas/trainee/programme-details';
import { yupResolver } from '@hookform/resolvers/yup';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
  setSectionQuestions: (value: SectionQuestions[]) => void;
  sectionQuestions: SectionQuestions[];
  onAllStepsComplete?: any;
  setShowProofOfBanking?: any;
}

export const ProofOfBanking: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
  setSectionQuestions,
  sectionQuestions,
  onAllStepsComplete,
  setShowProofOfBanking,
}) => {
  const { register: programmeFormRegister } = useForm<ProgrammeDetailsModel>({
    resolver: yupResolver(ProgrammeDetailsSchema),
    shouldUnregister: true,
    mode: 'onChange',
  });
  const [r4bPhotoUrl, setR4bPhotoUrl] = useState<string>();
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const [displayPhotoDeleteWarning, setDisplayPhotoDeleteWarning] =
    useState<boolean>(false);
  const { isOnline } = useOnlineStatus();
  const acceptedFormats = ['jpg, bmp, jpeg'];

  const [questions, setAnswers] = useState([
    {
      question:
        'Tap to take or upload a recent photo of your proof of bank account.',
      answer: '',
    },
  ]);

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection: visitSection,
          questions:
            sectionQuestions && sectionQuestions?.length > 0
              ? [...sectionQuestions?.[0]?.questions, ...updatedQuestions]
              : questions,
        },
      ]);
    },
    [questions]
  );

  const setPhotoUrl = (imageUrl: string) => {
    setR4bPhotoUrl(imageUrl);
    setPhotoActionBarVisible(false);
  };

  const deleteBirthDocumentPhoto = () => {
    setR4bPhotoUrl('');
    onOptionSelected('', 0);
    setDisplayPhotoDeleteWarning(false);
  };

  return (
    <>
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'Proof of banking'}
          />
          <div className="'flex items-center' w-full flex-row justify-start">
            <ImageInput
              acceptedFormats={acceptedFormats}
              label={questions?.[0].question}
              nameProp="r4bPhoto"
              icon="CameraIcon"
              className={'py-4'}
              currentImageString={r4bPhotoUrl}
              register={programmeFormRegister}
              overrideOnClick={() => setPhotoActionBarVisible(true)}
              onValueChange={(imageString: string) => {}}
            ></ImageInput>
          </div>
          {!questions?.some((item) => item?.answer === '') && (
            <Alert
              className="my-4"
              variant="flat"
              type="successLight"
              title={`All steps complete - your signature has been added.`}
            />
          )}
          <div className="mt-4 mb-16 h-full w-full">
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="primary"
              text="Save"
              textColor="white"
              icon="ArrowCircleRightIcon"
              onClick={() => {
                onAllStepsComplete();
              }}
              disabled={questions?.some((item) => item?.answer === '')}
            />
          </div>
        </div>
      </div>
      <Dialog
        visible={photoActionBarVisible}
        position={DialogPosition.Bottom}
        stretch
      >
        <div className={`p-4`}>
          <PhotoPrompt
            title={'Proof of banking'}
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => {
              setPhotoUrl(imageUrl);
              onOptionSelected(imageUrl, 0);
            }}
            onDelete={() => deleteBirthDocumentPhoto()}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </>
  );
};
