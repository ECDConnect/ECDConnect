import { Alert, Button, Divider, Typography } from '@ecdlink/ui';
import { CheckboxChange } from '@ecdlink/ui';
import { classNames, renderIcon } from '@ecdlink/ui';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as styles from './category-level-form.styles';
import { CategoryLevelFormProps } from './category-level-form.types';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { CategoryLevelFormResult } from '@models/classroom/progress-observation/ChildProgressAssessment';
import CheckboxCard from '../../../../../components/checkbox-card/checkbox-card';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import ProgressLevelBar from '../../components/progress-level-bar/progress-level-bar';
import { ProgressTrackingSkillDto } from '@ecdlink/core';

export const CategoryLevelForm: React.FC<CategoryLevelFormProps> = ({
  progressTrackingCategoryId,
  levelId,
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
  const [selectedTasks, setSelectedTasks] = useState<ProgressTrackingSkillDto[]>(
    getSelectedSkillIdsForCategoryLevel(levelId) || []
  );
  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(childrenSelectors.getChildUserById(child?.userId));

  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategoriesByCategoryId(
      progressTrackingCategoryId
    )
  );

  const subCategoryIds = subCategories?.map((subCategory) => subCategory?.id || 0);

  const subCategoryAssessments = useSelector(
    progressTrackingSelectors.getChildProgressSubCategoryAssessments(subCategoryIds, levelId)
  );

  const subCategoryAssessmentTasks = subCategoryAssessments?.reduce((acc, curr) => {
    acc = acc.concat(curr.skills);
    return acc;
  }, [] as ProgressTrackingSkillDto[]);

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

  const submitAssessment = () => {
    const result: CategoryLevelFormResult = {
      progressTrackingCategoryId: progressTrackingCategoryId,
      levelId: levelId,
      selectedSkills: selectedTasks || [],
      missedSkills:
        subCategoryAssessmentTasks?.filter(
          (skill) => !selectedTasks.some((task) => task.id === skill.id)
        ) || [],
    };
    onSubmit(result);
  };

  const childSkillSelected = (checkBox: CheckboxChange) => {
    if (!checkBox.value) return;

    const selectedSkillIndex = selectedTasks?.findIndex((task) => task.id === checkBox.value);

    if (selectedSkillIndex === -1) {
      const newSelectedTask = subCategoryAssessmentTasks?.find(
        (skill) => skill.id === checkBox.value
      );

      if (!newSelectedTask) return;

      const newSelectedSkills = [...(selectedTasks || []), newSelectedTask];
      setSelectedTasks(newSelectedSkills);
    } else {
      const newSelectedSkills = [...(selectedTasks || [])];

      newSelectedSkills.splice(selectedSkillIndex, 1);

      setSelectedTasks(newSelectedSkills);
    }
    optionSelected();
  };

  const isItemSelected = (skillId?: number) => {
    if (!skillId) return false;

    const isSelected = selectedTasks.findIndex((skill) => skill.id === skillId) > -1;

    return isSelected;
  };

  return (
    <>
      <ProgressLevelBar currentLevelId={levelId} />
      <div className={'px-4 pt-2 bg-uiBg'}>
        <Typography
          type={'h1'}
          color={'primary'}
          fontSize={'24'}
          text={`<b>Choose the things ${childUser?.firstName} does <u>easily</u></b>`}
          hasMarkup={true}
        />
        {subCategoryAssessments &&
          subCategoryAssessments.map((subCategoryAssessment, index) => (
            <div
              className={index === 0 ? 'pt-2' : 'pt-4'}
              key={`sub-category-${subCategoryAssessment.subCategory?.id}-assessment`}
            >
              <Typography
                type={'body'}
                color="textDark"
                text={subCategoryAssessment.subCategory.name}
              />
              {subCategoryAssessment.skills.map((skill: ProgressTrackingSkillDto) => (
                <div className={'pt-2'} key={`assessment-skill-${skill?.id}`}>
                  <CheckboxCard
                    description={skill.name}
                    checked={isItemSelected(skill.id)}
                    onCheckboxChange={(checkBox: CheckboxChange) => {
                      childSkillSelected(checkBox);
                    }}
                    value={skill?.id}
                  />
                </div>
              ))}
            </div>
          ))}
        {levelId && levelId === ProgressTrackingLevels.LevelTwo && (
          <Alert
            type="info"
            title={`Only choose the things that ${childUser?.firstName} can do easily.`}
            list={[
              `It is unlikely that every child will be able to do skills at Level 2. `,
              `Observe each child carefully to see what they can do! `,
            ]}
            className={'mt-4'}
          />
        )}
        <div className={styles.spaceTop}>
          <Divider />
        </div>
        <Button
          color={'primary'}
          type={'filled'}
          disabled={false}
          onClick={() => submitAssessment()}
          className={styles.startButton}
        >
          {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 mr-2 text-white'))}
          <Typography color={'white'} type={'help'} weight={'normal'} text={'Next'} />
        </Button>
      </div>
    </>
  );
};
