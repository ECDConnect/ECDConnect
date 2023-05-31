import { useCallback, useMemo, useState } from 'react';
import { Button } from '@ecdlink/ui';
import { PractitionerDto } from '@ecdlink/core';

export interface Question {
  question: string;
  answer:
    | string
    | string[]
    | boolean
    | boolean[]
    | (string | number | undefined)[]
    | undefined;
}

export interface SectionQuestions {
  visitSection: string;
  questions: Question[];
}

export interface DynamicFormProps {
  isView?: boolean;
  name?: string;
  smartStarter?: PractitionerDto;
  currentStep?: number;
  isTipPage?: boolean;
  steps?: any[];
  sectionQuestions?: SectionQuestions[];
  isLoading?: boolean;
  nextButtonText?: string;
  setIsTip?: (value: boolean) => void;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  setEnableButton?: (value: boolean) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
}

export const DynamicForm = ({
  isView,
  smartStarter,
  currentStep,
  steps,
  isTipPage,
  isLoading,
  nextButtonText = 'Next',
  setSectionQuestions: setSectionQuestionsForm,
  onNextStep,
  setIsTip,
  onClose,
  onSubmit,
}: DynamicFormProps) => {
  const [isEnableButton, setIsEnableButton] = useState(false);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const handleSetQuestions = useCallback(
    (value: SectionQuestions[]) => {
      setSectionQuestions((prevSections) => {
        const updatedQuestions = value.flatMap((newObj) => {
          const { visitSection: newVisitSection, questions: newQuestions } =
            newObj;
          const oldSection = prevSections?.find(
            (oldObj) => oldObj.visitSection === newVisitSection
          );
          const questionsFromOldSection = oldSection?.questions || [];

          const filteredQuestions = newQuestions.filter(
            (newQuestion) =>
              !questionsFromOldSection.some(
                (oldQuestion) => oldQuestion.question === newQuestion.question
              )
          );

          const otherSections = prevSections?.filter(
            (item) => item.visitSection !== newVisitSection
          );

          const mergedQuestions = filteredQuestions.length
            ? [...questionsFromOldSection, ...newQuestions]
            : [...newQuestions];

          return [
            ...(otherSections?.length ? otherSections : []),
            {
              visitSection: newVisitSection,
              questions: mergedQuestions,
            },
          ];
        }, []);

        setSectionQuestionsForm?.(updatedQuestions);
        return updatedQuestions;
      });
    },
    [setSectionQuestionsForm]
  );

  const handleOnNext = useCallback(() => {
    setIsEnableButton(false);
    onNextStep?.();
  }, [onNextStep]);

  const renderContent = useMemo(() => {
    if (!steps) return;

    const CurrentStep = steps[Number(currentStep)];

    if (!CurrentStep) return;

    return (
      <CurrentStep
        isView={isView}
        smartStarter={smartStarter}
        isTipPage={isTipPage}
        setIsTip={setIsTip}
        sectionQuestions={sectionQuestions}
        setSectionQuestions={handleSetQuestions}
        setEnableButton={setIsEnableButton}
        onNextStep={onNextStep}
      />
    );
  }, [
    isView,
    handleSetQuestions,
    smartStarter,
    currentStep,
    isTipPage,
    onNextStep,
    sectionQuestions,
    setIsTip,
    steps,
  ]);

  const renderButton = useMemo(() => {
    if (Number(steps?.length) === 1) {
      return {
        action: isView ? onClose : onSubmit,
        text: isView ? 'Close' : 'Save',
        icon: isView ? 'XIcon' : 'SaveIcon',
      };
    }

    if (Number(currentStep) < Number(steps?.length) - 1) {
      return {
        action: handleOnNext,
        text: nextButtonText,
        icon: 'ArrowCircleRightIcon',
      };
    }

    return {
      action: isView ? onClose : onSubmit,
      text: isView ? 'Close' : 'Save',
      icon: isView ? 'XIcon' : 'SaveIcon',
    };
  }, [
    isView,
    onClose,
    currentStep,
    nextButtonText,
    handleOnNext,
    onSubmit,
    steps?.length,
  ]);

  return (
    <div className="flex h-full flex-col">
      {renderContent}
      {!isTipPage && (
        <div id="button" className="mx-4 mt-auto flex items-end">
          <Button
            type="filled"
            color="primary"
            textColor="white"
            icon={renderButton.icon}
            className="mb-4 w-full"
            text={renderButton.text}
            onClick={renderButton.action}
            isLoading={isLoading}
            disabled={!isEnableButton || isLoading}
          />
        </div>
      )}
    </div>
  );
};
