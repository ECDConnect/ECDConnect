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
  name?: string;
  smartStarter?: PractitionerDto;
  currentStep?: number;
  isTipPage?: boolean;
  steps?: any[];
  sectionQuestions?: SectionQuestions[];
  setIsTip?: (value: boolean) => void;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  setEnableButton?: (value: boolean) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
  onClose?: () => void;
}

export const DynamicForm = ({
  name,
  smartStarter,
  currentStep,
  steps,
  isTipPage,
  setSectionQuestions: setSectionQuestionsForm,
  onNextStep,
  setIsTip,
  onClose,
}: DynamicFormProps) => {
  const [isEnableButton, setIsEnableButton] = useState(false);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();

  const handleOnNext = useCallback(() => {
    setIsEnableButton(false);
    onNextStep?.();
  }, [onNextStep]);

  const onSubmit = useCallback(async () => {
    console.log('submitting...');
  }, []);

  const renderContent = useMemo(() => {
    if (!steps) return;

    const CurrentStep = steps[Number(currentStep)];

    if (!CurrentStep) return;

    return (
      <CurrentStep
        smartStarter={smartStarter}
        isTipPage={isTipPage}
        setIsTip={setIsTip}
        sectionQuestions={sectionQuestions}
        setSectionQuestions={() => {}}
        setEnableButton={setIsEnableButton}
        onNextStep={onNextStep}
      />
    );
  }, [
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
        action: onSubmit,
        text: 'Save',
        icon: 'SaveIcon',
      };
    }
    if (Number(currentStep) === 0) {
      return {
        action: handleOnNext,
        text: name?.startsWith('Care for') ? 'Start' : 'Next',
        icon: 'ClipboardListIcon',
      };
    }

    if (Number(currentStep) < Number(steps?.length) - 1) {
      return {
        action: handleOnNext,
        text: 'Next',
        icon: 'ArrowCircleRightIcon',
      };
    }

    return {
      action: onSubmit,
      text: 'Save',
      icon: 'SaveIcon',
    };
  }, [currentStep, handleOnNext, onSubmit, steps?.length, name]);

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
            disabled={!isEnableButton}
          />
        </div>
      )}
    </div>
  );
};
