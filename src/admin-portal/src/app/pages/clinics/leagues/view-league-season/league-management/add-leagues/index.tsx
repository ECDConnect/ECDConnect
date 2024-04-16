import { Breadcrumb, BreadcrumbProps, Button } from '@ecdlink/ui';
import ROUTES from '../../../../../../routes/app.routes-constants';
import { useState } from 'react';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';

export const AddLeagues = () => {
  const [quantityLeagues, setQuantityLeagues] = useState<number>();

  const [currentStep, setCurrentStep] = useState(1);

  const isToShowPreviousButton = currentStep > 1;
  const isLastStep = currentStep === quantityLeagues + 1;
  const isDisabledNextButton = currentStep === 1 && !quantityLeagues;

  const paths: BreadcrumbProps['paths'] = [
    {
      name: 'Clinics',
      url: ROUTES.CLINICS.ALL_CLINICS,
    },
    {
      name: 'Leagues',
      url: ROUTES.CLINICS.LEAGUES.ROOT,
    },
    {
      name: '{startDate} - {endDate} Leagues',
      url: ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT,
    },
    {
      name: 'Add Leagues - {District}, {startDate} to {endDate}',
      url: '',
    },
  ];

  const onPreviousStep = () => {
    if (isToShowPreviousButton) {
      setCurrentStep((prevState) => prevState - 1);
    }
  };

  const onNextStep = () => {
    if (currentStep < quantityLeagues + 1) {
      setCurrentStep((prevState) => prevState + 1);
    }
  };

  const onSave = () => {
    console.log('Saving leagues...');
  };

  return (
    <div>
      <Breadcrumb paths={paths} />
      {currentStep === 1 && (
        <Step1
          quantityLeagues={quantityLeagues}
          setQuantityLeagues={setQuantityLeagues}
        />
      )}
      {currentStep > 1 && <Step2 />}
      <div className="mt-8 flex gap-2">
        {isToShowPreviousButton && (
          <Button
            className="rounded-2xl px-24"
            icon="ArrowCircleLeftIcon"
            type="outlined"
            color="secondary"
            textColor="secondary"
            text="Previous"
            onClick={onPreviousStep}
          />
        )}
        <Button
          className="rounded-2xl px-24"
          icon={isLastStep ? 'SaveIcon' : 'ArrowCircleRightIcon'}
          type="filled"
          color="secondary"
          textColor="white"
          disabled={isDisabledNextButton}
          text={isLastStep ? 'Save' : 'Next'}
          onClick={() => (isLastStep ? onSave() : onNextStep())}
        />
      </div>
    </div>
  );
};
