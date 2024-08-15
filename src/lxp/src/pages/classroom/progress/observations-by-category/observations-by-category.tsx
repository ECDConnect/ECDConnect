import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';

export type ObservationsByCategoryState = {
  categoryId: number;
  ageGroupId: number;
};

export const ObservationsByCategory: React.FC = () => {
  const history = useHistory();

  const { state: routeState } = useLocation<ObservationsByCategoryState>();

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const category = categories.find((x) => x.id === routeState.categoryId);

  return (
    <BannerWrapper
      size={'small'}
      title={category?.name}
      subTitle={`Step 1 of x`}
      onBack={() => {}}
    >
      <div className="mt-2 flex flex-col p-4">
        <Typography
          color="textDark"
          text={'COMING SOON!'}
          type={'h2'}
          className="mb-4"
        />
      </div>
    </BannerWrapper>
  );
};
