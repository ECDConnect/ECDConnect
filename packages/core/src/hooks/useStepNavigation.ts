import { useState } from 'react';

export interface StepItem {
  key: number;
}

export const useStepNavigation = (initialStepKey: number) => {
  const [stepHistory, setStepHistory] = useState<StepItem[]>([]);
  const [activeStepKey, setActiveStepKey] = useState<number>(initialStepKey);

  const canGoBack = () => stepHistory.length > 0;

  const goBackOneStep = () => {
    if (stepHistory.length === 0) return;

    const lastAddedItemInHistory = stepHistory[stepHistory.length - 1];

    const updatedHistory = stepHistory.slice(0, -1);

    setStepHistory(updatedHistory);

    if (lastAddedItemInHistory !== undefined)
      setActiveStepKey(lastAddedItemInHistory.key);
  };

  const addStepToHistory = (stepKey: number) => {
    const stepHistoryCopy = [...stepHistory];

    if (stepHistory.some((existingStep) => existingStep.key === stepKey))
      return;

    stepHistoryCopy.push({ key: stepKey });

    setStepHistory(stepHistoryCopy);
  };

  const goToStep = (newStepKey: number) => {
    addStepToHistory(activeStepKey);
    setActiveStepKey(newStepKey);
  };

  return {
    goBackOneStep,
    goToStep,
    canGoBack,
    activeStepKey,
  };
};
