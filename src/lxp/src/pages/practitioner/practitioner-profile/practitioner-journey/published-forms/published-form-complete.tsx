import { useAppDispatch } from '@/store';
import {
  BannerWrapper,
  Button,
  Divider,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useRef, useState, useMemo, useEffect } from 'react';
import { PublishedFormStep } from './published-form-step';
import {
  AssessmentFormDto,
  AssessmentPageDto,
} from '@/models/journey/Journey.dto';
import { submitJourneyAssessmentFormData } from '@/store/pqa/pqa.actions';

export type CompletePublishedFormProps = {
  assessmentFormData: AssessmentFormDto;
  onBack: (value: boolean) => void;
  onFormComplete: () => void;
};

export const CompletePublishedForm: React.FC<CompletePublishedFormProps> = ({
  assessmentFormData,
  onBack,
  onFormComplete,
}) => {
  const appDispatch = useAppDispatch();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const today = new Date();

  const formPages = assessmentFormData.formPages || [];
  const totalSteps = useMemo(() => formPages.length + 1, [formPages.length]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formPagesData, setFormPagesData] =
    useState<AssessmentPageDto[]>(formPages);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (assessmentFormData?.formPages?.length) {
      setFormPagesData(assessmentFormData.formPages);
    }
  }, [assessmentFormData.formPages]);

  const currentPageIndex = currentStep - 2;
  const currentStepData =
    currentStep > 1 &&
    currentPageIndex >= 0 &&
    currentPageIndex < formPagesData.length
      ? formPagesData[currentPageIndex]
      : undefined;

  const isStepComplete = useMemo(() => {
    if (currentStep === 1) return true;
    if (!currentStepData?.formQuestions) return false;

    return currentStepData.formQuestions.every((q) => {
      return !!q.answer && q.answer !== '';
    });
  }, [currentStep, currentStepData]);

  const handleStepChange = (updatedStep: AssessmentPageDto) => {
    setFormPagesData((prev) =>
      prev.map((p) => (p.id === updatedStep.id ? updatedStep : p))
    );
  };

  const prepareSubmissionData = (pages: AssessmentPageDto[]) => {
    return pages.map((page) => ({
      id: page.id,
      name: page.stepNr,
      formQuestions: page.formQuestions?.map((q) => ({
        id: q.id,
        name: q.name,
        answer: q.answer || '',
        answerId: q.answerId || '',
      })),
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      // Prevent moving forward if data for next step isn’t ready yet
      if (currentStep === 1 && formPagesData.length === 0) return;

      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = 0;
      }
      setCurrentStep((prev) => prev + 1);
    } else if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        const formInput = prepareSubmissionData(formPagesData);
        await appDispatch(
          submitJourneyAssessmentFormData({
            formId: assessmentFormData.id!,
            formName: assessmentFormData.name!,
            input: formInput,
          })
        );
        onFormComplete();
      } catch (error) {
        // handle error
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Show spinner if data not ready
  if (currentStep === 1 && assessmentFormData?.name === undefined) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="pt-4"
      />
    );
  }

  return (
    <BannerWrapper
      contentRef={wrapperRef}
      size="small"
      onBack={() =>
        currentStep === 1 ? onBack(false) : setCurrentStep((prev) => prev - 1)
      }
      title={assessmentFormData?.name || ''}
      subTitle={`Step ${currentStep} of ${totalSteps}`}
      renderOverflow
      onClose={() => onBack(false)}
    >
      <div className="w-12/12 ml-4 mr-4 mt-5">
        {currentStep === 1 ? (
          <>
            <Typography
              className="mt-3"
              type="h5"
              text={`About the ${assessmentFormData?.name} form`}
            />
            <Typography
              className=""
              type="small"
              text={`${format(today, 'dd MMMM yyyy')}`}
              color="textLight"
            />
            <Divider dividerType="dashed" className="my-2" />
            <Typography
              className="mt-3"
              type="body"
              text={`${assessmentFormData?.description}`}
            />
            <div className="mt-7 mb-7 flex">
              <Typography
                className="mt-3"
                type="body"
                text={`This content is powered by:`}
              />
              {assessmentFormData?.logoUrl && (
                <img
                  src={assessmentFormData.logoUrl}
                  alt="Form provider logo"
                  className="ml-6 h-auto w-36"
                />
              )}
            </div>
          </>
        ) : currentStepData ? (
          <PublishedFormStep
            stepData={currentStepData}
            onStepChange={handleStepChange}
          />
        ) : (
          <Typography text="No questions found for this step." type={'small'} />
        )}

        <div className="mt-auto mb-4">
          <Button
            onClick={handleNext}
            disabled={!isStepComplete || isSubmitting}
            className="w-full"
            size="normal"
            color="quatenary"
            type="filled"
            icon={
              currentStep === totalSteps ? 'SaveIcon' : 'ArrowCircleRightIcon'
            }
            text={
              isSubmitting
                ? 'Saving...'
                : currentStep === 1
                ? 'Start'
                : currentStep === totalSteps
                ? 'Save'
                : 'Next'
            }
            textColor="white"
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
