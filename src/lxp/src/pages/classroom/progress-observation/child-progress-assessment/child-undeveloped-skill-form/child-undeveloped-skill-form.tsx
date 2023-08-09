import { ProgressTrackingSkillDto } from '@ecdlink/core';
import {
  Button,
  Typography,
  RadioGroupOption,
  classNames,
  renderIcon,
  Alert,
  Radio,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { childrenSelectors } from '@store/children';
import { ChildUndevelopedSkillFormProps } from './child-undeveloped-skill-form.types';
import PositiveBonusEmoticon from '../../../../../assets/positive-bonus-emoticon.png';

export const ChildUndevelopedSkillForm: React.FC<
  ChildUndevelopedSkillFormProps
> = ({ skills, allSkillsYes, supportSkillId, childId, onSubmit }) => {
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
    var skillsRadioList: RadioGroupOption[] = [];
    if (noTryingToDoAndAtLeastOneNotYet) {
      if (skills.notYet && skills.notYet.length > 0) {
        skillsRadioList = skills.notYet.map((skill) => ({
          id: skill.id || 0,
          label: skill?.name,
          value: skill.id || 0,
        }));
        setSkillsRadioGroupOptions(skillsRadioList);
      }
    } else {
      if (skills.tryingToDo && skills.tryingToDo.length > 0) {
        skillsRadioList = skills.tryingToDo.map((skill) => ({
          id: skill.id || 0,
          label: skill?.name,
          value: skill.id || 0,
        }));
        setSkillsRadioGroupOptions(skillsRadioList);
      }
    }
    if (supportSkillId !== undefined && skillsRadioList.length > 0) {
      onSkillSelected(supportSkillId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAssessment = (exit: boolean) => {
    if (allSkillsYes) {
      onSubmit(undefined, true, exit);
    } else {
      if (!exit && !selectedUndevelopedSkill) return;
      onSubmit(selectedUndevelopedSkill, false, exit);
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
            <fieldset className="flex flex-col gap-2">
              {skillsRadioGroupOptions.map((item) => (
                <Radio
                  variant="slim"
                  key={`skill-${item.value}`}
                  description={item.label}
                  value={item.value}
                  checked={
                    item.id ===
                    (selectedUndevelopedSkill?.id || supportSkillId || -1)
                  }
                  disabled={false}
                  onChange={(event) => onSkillSelected(item.id)}
                />
              ))}
            </fieldset>
          </div>
        )}
      </div>
      <div className={'mt-4'}></div>
      <Button
        color={'primary'}
        type={'filled'}
        disabled={!allSkillsYes && !selectedUndevelopedSkill}
        onClick={() => submitAssessment(false)}
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
      <Button
        onClick={() => submitAssessment(true)}
        className="w-full"
        color="primary"
        type="outlined"
        disabled={false}
      >
        {renderIcon('XIcon', classNames('h-5 w-5 text-primary'))}
        <Typography
          type="help"
          className="ml-2"
          text="Save & exit"
          color="primary"
        />
      </Button>
    </div>
  );
};
