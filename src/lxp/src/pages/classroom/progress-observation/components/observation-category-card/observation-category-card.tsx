import { capitalizeFirstLetter } from '@ecdlink/core';
import {
  Button,
  Divider,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@store/progress-tracking';
import * as styles from './observation-category-card.styles';
import { ObservationCategoryCardProps } from './observation-category-card.types';

export const ObservationCategoryCard: React.FC<
  ObservationCategoryCardProps
> = ({
  categoryImageUrl,
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

  if (!className) {
    className = 'bg-uiBg';
  } else if (className.indexOf('bg-') === -1) {
    className = `${className} bg-uiBg`;
  }

  return (
    <div className={classNames(styles.wrapper, className)}>
      <div
        className={styles.contentWrapper}
        onClick={!onEdit ? undefined : () => onEdit()}
      >
        <div className={styles.headerBar}>
          <div
            className="mr-4 rounded-full p-4"
            style={{ backgroundColor: categoryColour }}
          >
            <img
              className={'w-22 h-22'}
              src={categoryImageUrl}
              alt="category"
            />
          </div>
          <div>
            <Typography
              className={'w-full'}
              weight={'bold'}
              type={'h4'}
              color={'textDark'}
              text={capitalizeFirstLetter(categoryName.toLowerCase())}
            />
          </div>
        </div>
        <Divider dividerType="dashed" />
        {achievedLevel && (
          <div className={styles.levelContainer}>
            <div className="mr-4">
              <img
                className={'m-auto'}
                src={achievedLevel.imageUrl}
                alt="category"
              />
            </div>
            <div>
              <Typography
                type={'small'}
                weight={'bold'}
                color={'textDark'}
                text={achievedLevel.name.toUpperCase()}
              />
            </div>
          </div>
        )}
        {!isCompetentWithCategory && (
          <>
            <Typography
              className={styles.spaceTopBig}
              type={'help'}
              color={'textLight'}
              text={!!childName ? `Helping ${childName} with` : `Support area`}
            />
            <Typography
              className={styles.spaceTopSmall}
              type={'body'}
              color={'textMid'}
              text={skill?.name || ''}
            />
            <Typography
              className={styles.spaceTopMedium}
              type={'help'}
              color={'textLight'}
              text={`To do`}
            />
            <Typography
              className={styles.spaceTopSmall}
              type={'body'}
              color={'textMid'}
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
            type={'filled'}
            color="primary"
            size="small"
            onClick={() => onEdit()}
          >
            <Typography
              className={styles.spaceRight}
              type={'small'}
              color={'white'}
              text={'Edit'}
            ></Typography>
            {renderIcon('PencilIcon', styles.buttonIcon)}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ObservationCategoryCard;
