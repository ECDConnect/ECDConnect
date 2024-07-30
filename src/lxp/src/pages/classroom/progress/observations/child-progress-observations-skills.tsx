import { ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { ChildProgressSkill } from '@/models/progress/progress-skill';
import { ChildDto, ProgressTrackingAgeGroupDto } from '@ecdlink/core';

export type ChildProgressObservationsSkillsProps = {
  currentStep: number;
  skills: ChildProgressSkill[];
  child: ChildDto;
  ageGroup: ProgressTrackingAgeGroupDto;
  onSetSkillValue: (skillId: number, value: string) => void;
};

export const ChildProgressObservationsSkills: React.FC<
  ChildProgressObservationsSkillsProps
> = ({ currentStep, skills, child, ageGroup, onSetSkillValue }) => {
  const replaceText = (skillText: string) => {
    let finalText = skillText;

    // Child name
    finalText = skillText.replace(
      '[childFirstName]',
      child?.user?.firstName || ''
    );

    return finalText;
  };

  // TODO - Should these be moved somewhere more central
  enum ProgressSkillValues {
    Yes = 'Yes',
    No = 'No',
    DoNotKnow = "Don't know",
  }

  const ProgressSkillValuesArray = [
    ProgressSkillValues.Yes,
    ProgressSkillValues.No,
    ProgressSkillValues.DoNotKnow,
  ];

  return (
    <>
      <Typography
        type="h2"
        color="primary"
        text={`Tell us about ${child?.user?.firstName}`}
      />
      <div
        className={`mt-4 mb-4 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
          ageGroup.color || 'secondary'
        }`}
        style={{ height: 'fit-content', width: 'fit-content' }}
      >
        <Typography
          type="buttonSmall"
          weight="bold"
          color="white"
          text={`${ageGroup.description} progress tracker`}
          lineHeight={4}
          className="text-center"
        />
      </div>
      {skills.slice((currentStep - 1) * 5, currentStep * 5).map((skill) => (
        <div key={`skill-${skill.id}`} className="mb-4">
          <Typography
            type="h3"
            color="textDark"
            text={replaceText(skill.name)}
          />
          {/* TODO - add option to show picture if required */}
          <ButtonGroup<string>
            type={ButtonGroupTypes.Button}
            options={ProgressSkillValuesArray.map((x) => ({
              text: x,
              value: x,
            }))}
            onOptionSelected={(value: string | string[]) => {
              onSetSkillValue(skill.id, value as string);
            }}
            multiple={false}
            selectedOptions={skill.value}
            color="secondary"
            className="mt-2"
          />
        </div>
      ))}
    </>
  );
};
