import { ProgressTrackingSkillDto } from '@ecdlink/core';
import {
  Button,
  CoreRadioGroup,
  Typography,
  RadioGroupOption,
  classNames,
  renderIcon,
  Alert,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import { ChildUndevelopedSkillFormProps } from './child-undeveloped-skill-form.types';
import PositiveBonusEmoticon from '../../../../../assets/positive-bonus-emoticon.png';

export const ChildUndevelopedSkillForm: React.FC<
  ChildUndevelopedSkillFormProps
> = ({ skills, allSkillsYes, childId, onSubmit }) => {
  const noTryingToDoAndAtLeastOneNotYet =
    !allSkillsYes &&
    skills.tryingToDo &&
    skills.tryingToDo.length === 0 &&
    skills.notYet &&
    skills.notYet.length > 0;
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
    if (noTryingToDoAndAtLeastOneNotYet) {
      if (skills.notYet && skills.notYet.length > 0) {
        const skillsRadioList: RadioGroupOption[] = skills.notYet.map(
          (skill) => ({
            id: skill.id || 0,
            label: skill?.name,
            value: skill.id || 0,
          })
        );
        setSkillsRadioGroupOptions(skillsRadioList);
      }
    } else {
      if (skills.tryingToDo && skills.tryingToDo.length > 0) {
        const skillsRadioList: RadioGroupOption[] = skills.tryingToDo.map(
          (skill) => ({
            id: skill.id || 0,
            label: skill?.name,
            value: skill.id || 0,
          })
        );
        setSkillsRadioGroupOptions(skillsRadioList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAssessment = () => {
    if (allSkillsYes) {
      onSubmit(undefined);
    } else {
      if (!selectedUndevelopedSkill) return;
      onSubmit(selectedUndevelopedSkill);
    }
  };

  const onSkillSelected = (skillId: number) => {
    const skill = noTryingToDoAndAtLeastOneNotYet
      ? skills.notYet.find((skill) => skill.id === skillId)
      : skills.tryingToDo.find((skill) => skill.id === skillId);
    setSelectedUndevelopedSkill(skill);
  };

  return (
    <div className={'bg-white px-4 pt-2'}>
      <Typography
        type={'h2'}
        color={'textDark'}
        text={
          allSkillsYes
            ? `${childUser?.firstName} can do all of the things in this area`
            : `Choose one skill to work on with ${childUser?.firstName}`
        }
      />
      <div className={'mt-4'}>
        {allSkillsYes && (
          <div className="grid grid-cols-1 justify-center gap-4">
            <div className="flex justify-center">
              <img src={PositiveBonusEmoticon} alt="developing well" />
            </div>
            <div className="flex justify-center">
              <Typography
                type="body"
                color={'textDark'}
                text={`${childUser?.firstName} is developing well.`}
                fontSize="18"
                className="pt-2"
              />
            </div>
            <div className="flex justify-center">
              <Typography
                type="body"
                color={'textMid'}
                text={`Keep observing ${childUser?.firstName}.`}
                fontSize="14"
              />
            </div>
          </div>
        )}
        {!allSkillsYes && (
          <div>
            {noTryingToDoAndAtLeastOneNotYet && (
              <div className={'mt-4 mb-4 px-4'}>
                <Alert
                  type={'info'}
                  title='You did not choose "trying to do" for any of the skills.'
                  messageColor="textDark"
                  message={`Choose a skill that ${childUser?.firstName} is not doing yet.`}
                />
              </div>
            )}
            <CoreRadioGroup
              options={skillsRadioGroupOptions}
              colour="uiBg"
              selectedOptionBackgroundColor={'infoBb'}
              onChange={onSkillSelected}
              currentValue={selectedUndevelopedSkill}
            />
          </div>
        )}
      </div>
      <div className={'mt-4'}></div>
      <Button
        color={'primary'}
        type={'filled'}
        disabled={!allSkillsYes && !selectedUndevelopedSkill}
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
