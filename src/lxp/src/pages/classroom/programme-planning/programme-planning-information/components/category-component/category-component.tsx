import { ProgressTrackingCategoryDto } from '@ecdlink/core';
import { Typography, renderIcon } from '@ecdlink/ui';
import { useSelector } from 'react-redux';

import { progressTrackingSelectors } from '@store/progress-tracking';
import { ProgressObsersvationSubCategoryCard } from '../../../../progress-observation/components/progress-observation-sub-category-card/progress-observation-sub-category-card';
import * as styles from './category-component.styles';

export interface ProgressTrackingCategoryProps {
  category: ProgressTrackingCategoryDto;
}

export const CategoryComponent = ({
  category,
}: ProgressTrackingCategoryProps) => {
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategoriesByCategoryId(
      category.id
    )
  );

  return (
    <div className={'px-4'}>
      <div className={styles.categoryIconWrapper}>
        <div
          className={styles.imageRounder}
          style={{ backgroundColor: category?.color ?? '#808080' }}
        >
          <img
            style={{ height: 48, width: 48 }}
            alt={`progress-tracking-category-${category?.id}`}
            src={category?.imageUrl}
          />
        </div>
      </div>
      <Typography
        className={'mt-3'}
        align={'center'}
        color={'textMid'}
        type={'body'}
        fontSize={'18'}
        weight={'bold'}
        text={category?.name || ''}
      />
      <div className={styles.categoryArrowIconWrapper}>
        {renderIcon('ArrowNarrowDownIcon', styles.arrowIcon)}
      </div>
      {subCategories?.map((subCategory, index) => (
        <div
          key={`progress-sub-category-card-${subCategory.id}`}
          className={index === 0 ? styles.spaceTop : 'mt-2'}
        >
          <ProgressObsersvationSubCategoryCard
            color={category?.color}
            text={subCategory?.name}
            subText={subCategory?.description}
            image={subCategory?.imageUrl}
            isFullCard={true}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryComponent;
