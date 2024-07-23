import {
  Button,
  Typography,
  classNames,
  renderIcon,
  ButtonGroup,
  ButtonGroupTypes,
} from '@ecdlink/ui';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as styles from './category-level-form.styles';
import { CategoryLevelFormProps } from './category-level-form.types';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { CategoryLevelFormResult } from '@models/classroom/progress-observation/ChildProgressAssessment';
import { ProgressSkillValuesArray } from '@/enums/ProgressSkillValues';
import ProgressLevelBar from '../../components/progress-level-bar/progress-level-bar';
import { ProgressTrackingSkillDto } from '@ecdlink/core';

export const CategoryLevelForm: React.FC<CategoryLevelFormProps> = ({
  progressTrackingCategoryId,
  levelId,
  level,
  childId,
  optionSelected = () => {},
  onSubmit,
}) => {
  const {
    currentReport,
    currentCategory,
    setCurrentCategoryById,
    getSelectedSkillIdsForCategoryLevel,
  } = useChildProgressObservation(childId);
  const [selectedTasks, setSelectedTasks] = useState<
    ProgressTrackingSkillDto[]
  >(getSelectedSkillIdsForCategoryLevel(levelId) || []);
  const child = useSelector(childrenSelectors.getChildById(childId));

  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategoriesByCategoryId(
      progressTrackingCategoryId
    )
  );

  const subCategoryIds = subCategories?.map(
    (subCategory) => subCategory?.id || 0
  );

  const subCategoryAssessments = useSelector(
    progressTrackingSelectors.getChildProgressSubCategoryAssessments(
      subCategoryIds,
      levelId
    )
  );

  const subCategoryAssessmentTasks = subCategoryAssessments?.reduce(
    (acc, curr) => {
      acc = acc.concat(curr.skills);
      return acc;
    },
    [] as ProgressTrackingSkillDto[]
  );

  useEffect(() => {
    if (progressTrackingCategoryId && currentReport) {
      setCurrentCategoryById(progressTrackingCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  useEffect(() => {
    const levelTasks = getSelectedSkillIdsForCategoryLevel(levelId);
    setSelectedTasks(levelTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, currentCategory]);

  const submitAssessment = (exit: boolean) => {
    const result: CategoryLevelFormResult = {
      progressTrackingCategoryId: progressTrackingCategoryId,
      levelId: levelId,
      selectedSkills: selectedTasks || [],
      missedSkills:
        subCategoryAssessmentTasks?.filter(
          (skill) => !selectedTasks.some((task) => task.id === skill.id)
        ) || [],
    };
    onSubmit(result, exit);
  };

  const skillOptionSelected = (skillId: number, value: string) => {
    var newSelectedTasks = [];
    var selectedSkill = selectedTasks.find((x) => x.id === skillId);
    if (!selectedSkill) {
      const newSkill = subCategoryAssessmentTasks?.find(
        (x) => x.id === skillId
      );
      if (!newSkill) return;
      selectedSkill = { ...newSkill };
      newSelectedTasks = [...(selectedTasks || []), selectedSkill];
    } else {
      newSelectedTasks = [...selectedTasks];
    }
    selectedSkill.value = value;
    setSelectedTasks(newSelectedTasks);
    optionSelected();
  };

  const whichSkillOptionSelected = (skillId?: number) => {
    if (!skillId) return undefined;
    var skill = selectedTasks.find((skill) => skill.id === skillId);
    if (skill === undefined || !skill.value) return undefined;
    return skill?.value;
  };

  const isComplete =
    selectedTasks.length === subCategoryAssessmentTasks?.length;

  return (
    <>
      <ProgressLevelBar currentLevelId={levelId} currentLevel={level} />
      <div className={'bg-white px-4 pt-2'}>
        <Typography
          type={'h2'}
          fontSize={'24'}
          text={`Tell us about ${child?.user?.firstName}`}
          hasMarkup={true}
        />
        {subCategoryAssessments &&
          subCategoryAssessments.map((subCategoryAssessment, index) => (
            <div
              className={index === 0 ? 'pt-2 pb-4' : 'pt-4 pb-4'}
              key={`sub-category-${subCategoryAssessment.subCategory?.id}-assessment`}
            >
              <Typography
                type={'h3'}
                color="textDark"
                text={subCategoryAssessment.subCategory.name}
              />
              {subCategoryAssessment.skills.map(
                (skill: ProgressTrackingSkillDto) => (
                  <div className={'pt-2'} key={`assessment-skill-${skill?.id}`}>
                    <Typography type={'h4'} text={skill.name} />
                    <ButtonGroup<string>
                      options={
                        ProgressSkillValuesArray.map((x) => {
                          return { text: x, value: x };
                        }) || []
                      }
                      onOptionSelected={(value: string | string[]) => {
                        skillOptionSelected(skill.id, value as string);
                      }}
                      selectedOptions={whichSkillOptionSelected(skill.id)}
                      color="secondary"
                      type={ButtonGroupTypes.Button}
                      className={'w-full'}
                      multiple={false}
                    />
                  </div>
                )
              )}
            </div>
          ))}
        <div className={styles.spaceTop}></div>
        <Button
          color={'primary'}
          type={'filled'}
          disabled={!isComplete}
          onClick={() => submitAssessment(false)}
          className={styles.startButton}
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
          color="primary"
          type="outlined"
          disabled={false}
          onClick={() => submitAssessment(true)}
          className={styles.saveAndExitButton}
        >
          {renderIcon('XIcon', classNames('h-5 w-5 mr-2 text-primary'))}
          <Typography
            color={'primary'}
            type={'help'}
            weight={'normal'}
            text={'Save & exit'}
          />
        </Button>
      </div>
    </>
  );
};
