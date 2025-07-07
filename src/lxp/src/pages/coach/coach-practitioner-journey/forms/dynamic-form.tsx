import { useCallback, useMemo, useState } from 'react';
import { Button } from '@ecdlink/ui';
import { PractitionerDto } from '@ecdlink/core';
import { Rating } from '.';

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
  submitButton?: { text: string; icon: string };
  secondaryButton?: { text: string; icon: string; onClick: () => void };
  pqaRating?: Rating;
  reAccreditationRating?: Rating;
  setPqaRating?: (value: Rating) => void;
  setReAccreditationRating?: (value: Rating) => void;
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
  submitButton = { text: 'Save', icon: 'SaveIcon' },
  secondaryButton,
  pqaRating,
  reAccreditationRating,
  setSectionQuestions: setSectionQuestionsForm,
  setReAccreditationRating,
  onNextStep,
  setIsTip,
  onClose,
  onSubmit,
  setPqaRating,
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
        pqaRating={pqaRating}
        reAccreditationRating={reAccreditationRating}
        setReAccreditationRating={setReAccreditationRating}
        setIsTip={setIsTip}
        sectionQuestions={sectionQuestions}
        setSectionQuestions={handleSetQuestions}
        setEnableButton={setIsEnableButton}
        onNextStep={onNextStep}
        setPqaRating={setPqaRating}
      />
    );
  }, [
    steps,
    currentStep,
    isView,
    smartStarter,
    isTipPage,
    pqaRating,
    reAccreditationRating,
    setReAccreditationRating,
    setIsTip,
    sectionQuestions,
    handleSetQuestions,
    onNextStep,
    setPqaRating,
  ]);

  const renderButton = useMemo(() => {
    if (Number(steps?.length) === 1) {
      return {
        action: isView ? onClose : onSubmit,
        text: isView ? 'Close' : submitButton.text,
        icon: isView ? 'XIcon' : submitButton.icon,
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
      text: isView ? 'Close' : submitButton.text,
      icon: isView ? 'XIcon' : submitButton.icon,
    };
  }, [
    steps?.length,
    currentStep,
    isView,
    onClose,
    onSubmit,
    submitButton.text,
    submitButton.icon,
    handleOnNext,
    nextButtonText,
  ]);

  return (
    <div className="flex h-full flex-col" id="dynamicForm">
      {renderContent}
      {!isTipPage && (
        <div id="button" className="mx-4 mt-auto flex flex-col items-end">
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
          {secondaryButton?.text && (
            <Button
              type="outlined"
              color="primary"
              icon={secondaryButton.icon}
              className="mb-4 w-full"
              text={secondaryButton.text}
              onClick={secondaryButton.onClick}
              isLoading={isLoading}
              disabled={!isEnableButton || isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
};
