import { progressTrackingSelectors } from '@store/progress-tracking';
import { useSelector } from 'react-redux';
import SkillCard from '../../../skill-card/skill-card';
import { ActivitySubCategoryCardProps } from './activity-sub-category-card.types';
import { classNames } from '@ecdlink/ui';

export const ActivitySubCategoryCard: React.FC<
  ActivitySubCategoryCardProps
> = ({ subCategory, className }) => {
  const category = useSelector(
    progressTrackingSelectors.getProgressTrackingCategoryBySubCategoryId(
      subCategory?.id
    )
  );

  return (
    <SkillCard
      key={subCategory.id}
      className={classNames('mt-2', className)}
      icon={subCategory.imageUrl}
      title={subCategory.name}
      hexBackgroundColor={category?.color}
    ></SkillCard>
  );
};
