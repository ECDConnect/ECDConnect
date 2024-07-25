import { progressTrackingSelectors } from '@/store/progress-tracking';
import { BannerWrapper, Button } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ChildProgressObservationPageState } from '../../progress-observation/child-progress-observation/child-progress-observation.types';
import { useState } from 'react';
import { ChildProgressObservationsSkills } from './child-progress-observations-skills';
import { useObserveProgressForChild } from '@/hooks/useObserveProgressForChild';

export const ProgressObservations: React.FC = () => {
  const history = useHistory();

  const { state: routeState } =
    useLocation<ChildProgressObservationPageState>();

  const {
    child,
    currentReportingPeriod,
    currentAgeGroup,
    allSkillsWithCurrentObservation,
    addObservationForSkill,
  } = useObserveProgressForChild(routeState.childId);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSkillsSteps = Math.ceil(
    allSkillsWithCurrentObservation.length / 5
  );

  // TODO - might need to add extra steps for final sections, for now just based off of skills for age group.

  return (
    <BannerWrapper
      size={'small'}
      onBack={() =>
        currentStep === 1 ? history.goBack() : setCurrentStep(currentStep - 1)
      }
      title={`Report ${currentReportingPeriod?.reportNumber}`} // TODO, is this the number for the child, or for the reporting window???
      subTitle={`Step ${currentStep} of ${totalSkillsSteps}`}
      renderOverflow
    >
      <div className="mb-4 flex w-full flex-col px-4 pt-4">
        {currentStep <= totalSkillsSteps && (
          <ChildProgressObservationsSkills
            ageGroup={currentAgeGroup!}
            child={child!}
            currentStep={currentStep}
            skills={allSkillsWithCurrentObservation}
            onSetSkillValue={addObservationForSkill}
          />
        )}
        {/* TODO - for older children last steps will be skills to work on etc */}
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="ArrowCircleRightIcon"
          text="Next"
          textColor="white"
          disabled={currentStep === totalSkillsSteps}
        />
        <Button
          onClick={() => {}}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="outlined"
          icon="XIcon"
          text="Save & exit"
          textColor="quatenary"
        />
      </div>
    </BannerWrapper>
  );
};
