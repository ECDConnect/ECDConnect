import { ProgressTrackingSkillDto } from '@ecdlink/core';
import {
  Button,
  CoreRadioGroup,
  Divider,
  Typography,
  RadioGroupOption,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import { ChildUndevelopedSkillFormProps } from './child-undeveloped-skill-form.types';

export const ChildUndevelopedSkillForm: React.FC<
  ChildUndevelopedSkillFormProps
> = ({ undevelopedSkills, childId, onSubmit }) => {
  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );
  const [skillsRadioGroupOptions, setSkillsRadioGroupOptions] = useState<
    RadioGroupOption[]
  >([]);

  const [selectedUndevelopedSkill, setSelectedUndevelopedSkill] =
    useState<ProgressTrackingSkillDto>();

  useEffect(() => {
    if (undevelopedSkills && undevelopedSkills.length > 0) {
      const skillsRadioList: RadioGroupOption[] = undevelopedSkills.map(
        (skill) => ({
          id: skill.id || 0,
          label: skill?.name,
          value: skill.id || 0,
        })
      );
      setSkillsRadioGroupOptions(skillsRadioList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAssessment = () => {
    if (!selectedUndevelopedSkill) return;
    onSubmit(selectedUndevelopedSkill);
  };

  const onSkillSelected = (skillId: number) => {
    const skill = undevelopedSkills.find((skill) => skill.id === skillId);
    setSelectedUndevelopedSkill(skill);
  };

  return (
    <div className={'bg-uiBg px-4 pt-2'}>
      <Typography
        type={'h1'}
        color={'primary'}
        fontSize={'24'}
        text={`<b>Choose one thing that ${childUser?.firstName} finds <u>difficult</u></b>`}
        hasMarkup={true}
      />
      <div className={'mt-4'}>
        <CoreRadioGroup
          options={skillsRadioGroupOptions}
          colour="infoMain"
          selectedOptionBackgroundColor={'infoBb'}
          onChange={onSkillSelected}
          currentValue={selectedUndevelopedSkill}
        />
      </div>
      <div className={'mt-4'}>
        <Divider />
      </div>
      <Button
        color={'primary'}
        type={'filled'}
        disabled={!selectedUndevelopedSkill}
        onClick={() => submitAssessment()}
        className={'mt-4 mb-4 w-full'}
      >
        {renderIcon(
          'ArrowCircleRightIcon',
          classNames('h-5 w-5 mr-2 text-white')
        )}
        <Typography
          color={'white'}
          type={'help'}
          weight={'normal'}
          text={'Next'}
        />
      </Button>
    </div>
  );
};
