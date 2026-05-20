import { useAppDispatch } from '@/store';
import {
  Alert,
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
import { computeClassroomMetrics } from '@/utils/classroom/classroomMetrics';

export type CompletePublishedFormProps = {
  assessmentFormData: AssessmentFormDto;
  onBack: (value: boolean) => void;
  onFormComplete: (visitId: string) => void;
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

  const [multiInstances, setMultiInstances] = useState<Record<string, any[]>>(
    {}
  );
  const [editingInstanceId, setEditingInstanceId] = useState<string | null>(
    null
  );

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

  const isResultStep = currentStepData?.isScoreResult === 'true';
  const isMultiStep =
    !!currentStepData?.multiAnswers &&
    currentStepData.multiAnswers.trim() !== '';

  const isInListView = isMultiStep && editingInstanceId === null;
  const isInEditView = isMultiStep && editingInstanceId !== null;

  const allQuestionsUpToNow = useMemo(() => {
    if (!isResultStep) return [];

    return formPagesData
      .slice(0, currentPageIndex + 1)
      .flatMap((page) => page.formQuestions || [])
      .filter(
        (q) => q.answerType === 'checkBox' || q.answerType === 'radioButton'
      ); // only scored ones
  }, [formPagesData, currentPageIndex, isResultStep]);

  const isStepComplete = useMemo(() => {
    if (currentStep === 1) return true;

    if (isInListView) {
      const instances = multiInstances[currentStepData.id] || [];
      return instances.length > 0;
    }

    //disable next button if canSkip is true and multiAnswers is empty
    if (
      currentStepData?.canSkip === 'true' &&
      currentStepData.multiAnswers === ''
    )
      return true;
    if (currentStepData?.isScored === 'true') return true;

    if (!currentStepData?.formQuestions) return false;

    return currentStepData.formQuestions.every((q) => {
      return !!q.answer && q.answer !== '';
    });
  }, [
    currentStep,
    currentStepData,
    currentStepData?.id,
    multiInstances,
    isInListView,
  ]);

  const handleStepChange = (updatedStep: AssessmentPageDto) => {
    setFormPagesData((prev) =>
      prev.map((p) => (p.id === updatedStep.id ? updatedStep : p))
    );
  };

  const prepareSubmissionData = (pages: AssessmentPageDto[]) => {
    return pages.flatMap((page) => {
      if (page.multiAnswers && multiInstances[page.id]?.length) {
        return multiInstances[page.id].map((instance, idx) => ({
          id: page.id,
          name: `${page.stepNr}.${idx + 1}`,
          formQuestions: instance.answers.map((q: any) => ({
            id: q.id,
            name: q.name,
            answer: q.answer || '',
            answerId: q.answerId || '',
          })),
        }));
      }

      return {
        id: page.id,
        name: page.stepNr,
        formQuestions:
          page.formQuestions?.map((q) => ({
            id: q.id,
            name: q.name,
            answer: q.answer || '',
            answerId: q.answerId || '',
          })) ?? [],
      };
    });
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
        const reportData = await appDispatch(
          submitJourneyAssessmentFormData({
            formId: assessmentFormData.id!,
            formName: assessmentFormData.name!,
            input: formInput,
          })
        ).unwrap();
        onFormComplete(reportData.visitId ?? '');
      } catch (error) {
        console.error('Failed to submit form data:', error);
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

  const getFailedQuestions = () => {
    return allQuestionsUpToNow.filter((question) => {
      if (!question.answerId || question.answerId.trim() === '') return true;

      if (
        question.answerType === 'checkBox' &&
        question.formQuestionOptions?.length
      ) {
        const selectedIds = question.answerId.split('|').map((id) => id.trim());
        const hasValidSelection = selectedIds.some((id) => {
          const opt = question.formQuestionOptions?.find((o) => o.id === id);
          return opt && !opt.name.toLowerCase().includes('none');
        });
        return !hasValidSelection;
      }
      return false;
    });
  };

  const failedQuestions = isResultStep ? getFailedQuestions() : [];
  const allPassed = isResultStep && failedQuestions.length === 0;

  const renderMultiStepContent = () => {
    if (isInListView) {
      return (
        <div>
          <Typography
            type="h2"
            text={currentStepData!.name}
            color="textDark"
            className="semi-bold"
          />
          {currentStepData!.description && (
            <Alert type="info" title={currentStepData!.description} />
          )}

          <div className="mt-6 mb-8 space-y-4">
            {multiInstances[currentStepData!.id]?.length &&
              multiInstances[currentStepData!.id].map((instance, idx) => {
                const metrics = computeClassroomMetrics(instance.answers || []);
                return (
                  <div key={instance.id} className="w-full">
                    <Typography
                      type="body"
                      text={`Classroom ${idx + 1}: ${
                        metrics?.capacity
                      } children`}
                    />
                    {metrics && (
                      <>
                        <div className="flex items-center justify-between">
                          <Typography
                            type="small"
                            color="textLight"
                            text={`${metrics.capacity} children; ${metrics.shortSideCm}cm x ${metrics.longSideCm}cm; ${metrics.assistants} assistants`}
                          />
                          <Button
                            iconPosition="end"
                            icon="PencilIcon"
                            type="filled"
                            size="small"
                            textColor="secondary"
                            text="Edit"
                            color="secondaryAccent2"
                            onClick={() => setEditingInstanceId(instance.id)}
                          />
                        </div>
                        <Divider dividerType="dashed" className="my-2" />
                      </>
                    )}
                  </div>
                );
              })}
          </div>

          <Button
            type="filled"
            color="quatenary"
            textColor="white"
            text={currentStepData?.multiAnswers?.trim() || 'Add item'}
            icon="PlusIcon"
            onClick={() => {
              const newId = `temp-${Date.now()}`;
              setMultiInstances((prev) => ({
                ...prev,
                [currentStepData!.id]: [
                  ...(prev[currentStepData!.id] || []),
                  { id: newId, answers: {} }, // ← will store question answers here
                ],
              }));
              setEditingInstanceId(newId);
            }}
            className="mb-6 w-7/12"
          />
        </div>
      );
    }

    return (
      <div>
        {(() => {
          const currentInstance = multiInstances[currentStepData!.id]?.find(
            (inst) => inst.id === editingInstanceId
          );

          let effectiveStepData = { ...currentStepData! };

          if (currentInstance?.answers?.length) {
            const mergedQuestions =
              currentStepData!.formQuestions?.map((q) => {
                const saved = currentInstance.answers.find(
                  (a: any) => a.id === q.id
                );
                return saved ? { ...q, ...saved } : q;
              }) || [];

            effectiveStepData = {
              ...effectiveStepData,
              formQuestions: mergedQuestions,
            };
          }

          return (
            <div>
              <PublishedFormStep
                stepData={effectiveStepData}
                onStepChange={(updatedStep) => {
                  setMultiInstances((prev) => {
                    const items = prev[currentStepData!.id] || [];
                    const updatedItems = items.map((item) =>
                      item.id === editingInstanceId
                        ? { ...item, answers: updatedStep.formQuestions }
                        : item
                    );
                    return { ...prev, [currentStepData!.id]: updatedItems };
                  });
                }}
              />

              <div className="mt-auto mb-4">
                <Button
                  onClick={() => setEditingInstanceId(null)}
                  disabled={
                    !effectiveStepData.formQuestions?.every(
                      (q) => !!q.answer?.trim() || !!q.answerId?.trim()
                    )
                  }
                  className="w-11/12"
                  size="normal"
                  color="quatenary"
                  type="filled"
                  text="Save"
                  textColor="white"
                />
              </div>
            </div>
          );
        })()}
      </div>
    );
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <Typography
            className="semi-bold mt-3"
            type="h2"
            text={`About the ${assessmentFormData?.name} form`}
          />
          <Typography
            className="semi-bold"
            type="h4"
            color="textMid"
            text={`${format(today, 'dd MMMM yyyy')}`}
          />
          <Divider dividerType="dashed" className="my-2" />
          <Typography
            className="mt-3"
            type="body"
            color="textMid"
            text={`${assessmentFormData?.description}`}
          />
          <div className="mt-7 mb-7 flex">
            <Typography
              type="h4"
              className="semi-bold m-3"
              color="textDark"
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
      );
    }

    if (!currentStepData) {
      return (
        <Typography text="No questions found for this step." type={'small'} />
      );
    }

    if (isMultiStep) {
      return renderMultiStepContent();
    }

    return (
      <PublishedFormStep
        stepData={currentStepData}
        onStepChange={handleStepChange}
        allQuestions={allQuestionsUpToNow}
        failedQuestions={failedQuestions}
        allPassed={allPassed}
      />
    );
  };

  const nextButtonText = isSubmitting
    ? 'Saving...'
    : currentStep === 1
    ? 'Start'
    : currentStep === totalSteps
    ? 'Save'
    : 'Next';

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
      <div className="flex h-full w-full flex-col bg-white p-4">
        {renderStepContent()}

        {!isInEditView && (
          <div className="mt-auto mb-4">
            <Button
              onClick={handleNext}
              disabled={!isStepComplete || isSubmitting}
              className="mt-auto w-full"
              size="normal"
              color="quatenary"
              type="filled"
              icon={
                currentStep === totalSteps ? 'SaveIcon' : 'ArrowCircleRightIcon'
              }
              text={nextButtonText}
              textColor="white"
            />
            {isMultiStep && (
              <Button
                onClick={handleNext}
                className="mt-2 w-full"
                size="normal"
                color="quatenary"
                textColor="quatenary"
                type="outlined"
                icon={'ClockIcon'}
                text={`Skip`}
              />
            )}
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};
