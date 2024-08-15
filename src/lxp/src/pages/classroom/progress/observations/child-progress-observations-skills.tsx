import {
  ActionModal,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { ChildProgressSkill } from '@/models/progress/progress-skill';
import {
  ChildDto,
  ProgressTrackingAgeGroupDto,
  useDialog,
} from '@ecdlink/core';
import {
  ProgressSkillValues,
  ProgressSkillValuesArray,
} from '@/enums/ProgressSkillValues';
import { useCallback } from 'react';

export type ChildProgressObservationsSkillsProps = {
  currentStep: number;
  skills: ChildProgressSkill[];
  child: ChildDto;
  ageGroup: ProgressTrackingAgeGroupDto;
  replaceSkillText: (skillText: string) => string;
  onSetSkillValue: (skillId: number, value: ProgressSkillValues) => void;
};

export const ChildProgressObservationsSkills: React.FC<
  ChildProgressObservationsSkillsProps
> = ({
  currentStep,
  skills,
  child,
  ageGroup,
  replaceSkillText,
  onSetSkillValue,
}) => {
  const dialog = useDialog();

  const handleShowSupportImage = useCallback(
    (skillText: string, image: string) => {
      dialog({
        position: DialogPosition.Middle,
        render: (submit, cancel) => (
          <div className="p-4">
            <Typography type="h3" color="textDark" text={skillText} />
            <img className="mt-2 mb-2" src={image} />
            <Button
              onClick={cancel}
              size="small"
              color="quatenary"
              textColor="quatenary"
              type="outlined"
              text={'Close'}
              className="w-full"
            />
          </div>
        ),
      });
    },
    [dialog]
  );

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
          <div className={'flex flex-row'}>
            <Typography
              type="h3"
              color="textDark"
              text={replaceSkillText(skill.name)}
            />
            {!!skill.supportImage && (
              <div className="ml-auto">
                <Button
                  onClick={() =>
                    handleShowSupportImage(
                      skill.description,
                      skill.supportImage!
                    )
                  }
                  size="small"
                  color="quatenary"
                  textColor="white"
                  type="filled"
                  text={'Picture'}
                />
              </div>
            )}
          </div>

          {/* TODO - add option to show picture if required */}
          <ButtonGroup<ProgressSkillValues>
            type={ButtonGroupTypes.Button}
            options={ProgressSkillValuesArray.map((x) => ({
              text: x,
              value: x,
            }))}
            onOptionSelected={(
              value: ProgressSkillValues | ProgressSkillValues[]
            ) => {
              onSetSkillValue(skill.id, value as ProgressSkillValues);
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
