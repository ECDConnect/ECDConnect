import { useCallback, useMemo, useState } from 'react';
import { Button } from '@ecdlink/ui';
import { InfantDto } from '@ecdlink/core';

interface Question {
  question: string;
  answer:
    | string
    | string[]
    | boolean
    | boolean[]
    | (string | number | undefined)[]
    | undefined;
}

export interface DynamicFormProps {
  name?: any;
  infant?: InfantDto;
  currentStep?: number;
  isTipPage?: boolean;
  steps?: any[]; // TODO: add type
  setIsTip?: (value: boolean) => void;
  setQuestions?: (value: Question[]) => void;
  setEnableButton?: (value: boolean) => void;
  onNextStep?: () => void;
  onPreviousStep?: () => void;
}

export const DynamicForm = ({
  name,
  infant,
  currentStep,
  steps,
  isTipPage,
  onNextStep,
  setIsTip,
}: DynamicFormProps) => {
  const [isEnableButton, setIsEnableButton] = useState(false);

  const [questions, setQuestions] = useState<Question[]>();

  const handleSetQuestions = useCallback(
    (value: Question[]) => {
      const filteredQuestions = questions?.filter((oldObj) => {
        const questionExists = value.some(
          (newObj) => newObj.question === oldObj.question
        );
        return !questionExists;
      });

      setQuestions(() =>
        filteredQuestions?.length
          ? [...filteredQuestions, ...value]
          : [...value]
      );
    },
    [questions]
  );

  const handleOnNext = useCallback(() => {
    setIsEnableButton(false);
    onNextStep && onNextStep();
  }, [onNextStep]);

  const onSubmit = useCallback(() => {
    const input = {
      visitId: '',
      infantId: infant?.user?.id,
      visitData: {
        visitName: name,
        questions,
      },
    };

    console.log('Submitting...', { input });
  }, [infant?.user?.id, name, questions]);

  const renderContent = useMemo(() => {
    if (!steps) return;

    const CurrentStep = steps[Number(currentStep)];

    return (
      <CurrentStep
        infant={infant}
        isTipPage={isTipPage}
        setIsTip={setIsTip}
        setQuestions={handleSetQuestions}
        setEnableButton={setIsEnableButton}
      />
    );
  }, [currentStep, handleSetQuestions, infant, isTipPage, setIsTip, steps]);

  const renderButton = useMemo(() => {
    if (Number(currentStep) === 0) {
      return {
        action: handleOnNext,
        text: 'Start',
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
  }, [currentStep, handleOnNext, onSubmit, steps?.length]);

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
