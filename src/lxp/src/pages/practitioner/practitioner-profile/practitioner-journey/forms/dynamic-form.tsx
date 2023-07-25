import React, { useCallback, useMemo, useState } from 'react';
import { Button } from '@ecdlink/ui';
import { PractitionerDto } from '@ecdlink/core';
import { ButtonProps } from '@ecdlink/ui/lib/components/button/button.types';

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
  isSecondaryPage?: boolean;
  steps?: any[];
  sectionQuestions?: SectionQuestions[];
  isLoading?: boolean;
  nextButtonText?: string;
  submitButton?: { text: string; icon: string; type?: ButtonProps['type'] };
  secondaryButton?: { text: string; icon: string; onClick: () => void };
  setIsSecondaryPage?: (value: boolean) => void;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  setEnableButton?: (value: boolean) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
  onView?: () => void;
}

export const DynamicForm = ({
  isView,
  smartStarter,
  currentStep,
  steps,
  isSecondaryPage,
  isLoading,
  nextButtonText = 'Next',
  submitButton = { text: 'Save', icon: 'SaveIcon', type: 'filled' },
  secondaryButton,
  setSectionQuestions: setSectionQuestionsForm,
  onNextStep,
  setIsSecondaryPage,
  onClose,
  onSubmit,
  onView,
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
        smartStarter={smartStarter}
        isSecondaryPage={isSecondaryPage}
        setIsSecondaryPage={setIsSecondaryPage}
        sectionQuestions={sectionQuestions}
        setSectionQuestions={handleSetQuestions}
        setEnableButton={setIsEnableButton}
        onNextStep={onNextStep}
      />
    );
  }, [
    steps,
    currentStep,
    smartStarter,
    isSecondaryPage,
    setIsSecondaryPage,
    sectionQuestions,
    handleSetQuestions,
    onNextStep,
  ]);

  const onSubmitFunction = useCallback(() => {
    if (onView && isView) {
      return onView();
    }

    if (isView) {
      return onClose?.();
    }

    onSubmit?.();
  }, [isView, onClose, onSubmit, onView]);

  const renderButton = useMemo(() => {
    if (Number(steps?.length) === 1) {
      return {
        action: onSubmitFunction,
        text: submitButton.text,
        icon: submitButton.icon,
        type: submitButton.type,
      };
    }

    if (Number(currentStep) < Number(steps?.length) - 1) {
      return {
        action: handleOnNext,
        text: nextButtonText,
        icon: 'ArrowCircleRightIcon',
        type: submitButton.type,
      };
    }

    return {
      action: onSubmitFunction,
      text: isView ? 'Close' : submitButton.text,
      icon: isView ? 'XIcon' : submitButton.icon,
      type: submitButton.type,
    };
  }, [
    steps?.length,
    currentStep,
    onSubmitFunction,
    isView,
    submitButton.text,
    submitButton.icon,
    submitButton.type,
    handleOnNext,
    nextButtonText,
  ]);

  return (
    <div className="flex h-full flex-col">
      {renderContent}
      {!isSecondaryPage && (
        <div id="button" className="mx-4 mt-auto flex flex-col items-end">
          <Button
            type={renderButton.type ?? 'filled'}
            color="primary"
            textColor={renderButton.type === 'outlined' ? 'primary' : 'white'}
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
