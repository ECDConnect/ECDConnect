import { progressTrackingSelectors } from '@/store/progress-tracking';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ChildProgressObservationPageState } from '../progress-observation/child-progress-observation/child-progress-observation.types';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { useState } from 'react';

export const ChildProgressSkillTracking: React.FC = () => {
  const history = useHistory();

  const { state: routeState } =
    useLocation<ChildProgressObservationPageState>();

  const child = useSelector(childrenSelectors.getChildById(routeState.childId));
  const currentAgeGroup = useSelector(
    childrenSelectors.getProgressAgeGroupForChild(routeState.childId)
  );

  const { reportNumber, reportingPeriod } = useSelector(
    classroomsSelectors.getCurrentProgressReportWindow()
  );

  const progressReport = useSelector(
    progressTrackingSelectors.getProgressReportForAgeGroup(currentAgeGroup!.id)
  );

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = Math.ceil(progressReport.length / 5);

  // TODO - might need to add extra steps for final sections, for now just based off of skills for age group.

  const replaceText = (skillText: string) => {
    let finalText = skillText;

    // Child name
    finalText = skillText.replace(
      '[childFirstName]',
      child?.user?.firstName || ''
    );

    return finalText;
  };

  return (
    <BannerWrapper
      size={'small'}
      onBack={() =>
        currentStep === 1 ? history.goBack() : setCurrentStep(currentStep - 1)
      }
      title={`Report ${reportNumber}`} // TODO, is this the number for the child, or for the reporting window???
      subTitle={`Step ${currentStep} of ${totalSteps}`}
      renderOverflow
    >
      <div className="mb-4 flex w-full flex-col px-4 pt-4">
        <Typography
          type="h2"
          color="primary"
          text={`Tell us about ${child?.user?.firstName}`}
        />
        <StatusChip
          backgroundColour="secondary"
          borderColour="secondary"
          text={`${currentAgeGroup?.name} progress tracker`}
          textColour={'white'}
          className={'mt-4 mb-4'}
          style={{ width: 'fit-content' }}
        />
        {progressReport
          .slice((currentStep - 1) * 5, currentStep * 5 - 1)
          .map((skill) => (
            <div key={`skill-${skill.id}`} className="mb-4">
              <Typography
                type="h3"
                color="textDark"
                text={replaceText(skill.name)}
              />
              {/* TODO - add option to show picture if required */}
              <ButtonGroup<string | null>
                type={ButtonGroupTypes.Button}
                options={[
                  {
                    text: 'Yes',
                    value: 'true',
                  },
                  {
                    text: 'No',
                    value: 'false',
                  },
                  {
                    text: "Don't know",
                    value: null,
                  },
                ]}
                onOptionSelected={(
                  value: string | (string | null)[] | null
                ) => {}} // TODO
                multiple={false}
                selectedOptions={[]} // TODO
                color="secondary"
                className="mt-2"
              />
            </div>
          ))}
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="ArrowCircleRightIcon"
          text="Next"
          textColor="white"
          disabled={currentStep === totalSteps}
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
