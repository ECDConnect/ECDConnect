import { capitalizeFirstLetter, capitalizeWords } from '@ecdlink/core';
import { Button, Typography, classNames, renderIcon } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import * as styles from './observation-category-card.styles';
import { ObservationCategoryCardProps } from './observation-category-card.types';

export const ObservationCategoryCard: React.FC<
  ObservationCategoryCardProps
> = ({
  categoryName,
  categoryColour,
  levelId,
  childName,
  helpingSkillId,
  toDoNote,
  className,
  isCompetentWithCategory,
  onEdit,
}) => {
  const achievedLevel = useSelector(
    progressTrackingSelectors.getProgressTrackingLevelById(levelId)
  );
  const skill = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillById(helpingSkillId)
  );

  return (
    <div
      className={classNames(styles.wrapper, className)}
      style={{ borderTopWidth: '4px', borderTopColor: categoryColour }}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.headerBar}>
          <Typography
            className={achievedLevel ? 'w-9/12' : 'w-full'}
            weight={'bold'}
            type={'body'}
            color={'textMid'}
            text={capitalizeFirstLetter(categoryName.toLowerCase())}
          />
          {achievedLevel && (
            <div className={styles.levelContainer}>
              {achievedLevel && (
                <img
                  className={'m-auto'}
                  src={achievedLevel.imageUrl}
                  alt="category"
                />
              )}
              <Typography
                type={'small'}
                weight={'bold'}
                color={'textMid'}
                text={capitalizeWords(achievedLevel.name.toLowerCase())}
              />
            </div>
          )}
        </div>
        {!isCompetentWithCategory && (
          <>
            <Typography
              className={styles.spaceTopBig}
              type={'help'}
              color={'textLight'}
              text={`Helping ${childName} with:`}
            />
            <Typography
              className={styles.spaceTopSmall}
              type={'body'}
              color={'textMid'}
              weight="bold"
              text={skill?.name || ''}
            />
            <Typography
              className={styles.spaceTopMedium}
              type={'help'}
              color={'textLight'}
              text={`To do:`}
            />
            <Typography
              className={styles.spaceTopSmall}
              type={'body'}
              color={'textMid'}
              weight="bold"
              text={toDoNote}
            />
          </>
        )}
        {isCompetentWithCategory && (
          <>
            <Typography
              className={styles.spaceTopBig}
              type={'help'}
              color={'textLight'}
              text={`${childName} can do all of things in this area!`}
            />
          </>
        )}

        {onEdit && (
          <Button
            className={styles.spaceTopBig}
            type={'outlined'}
            color="primary"
            size="small"
            onClick={() => onEdit()}
          >
            {renderIcon('PencilIcon', styles.buttonIcon)}
            <Typography
              className={styles.spaceRight}
              type={'small'}
              color={'primary'}
              text={'Edit'}
            ></Typography>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ObservationCategoryCard;
