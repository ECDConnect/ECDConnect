import {
  BannerWrapper,
  Button,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { progressTrackingSelectors } from '@store/progress-tracking';
import * as styles from './progress-tracking-category.styles';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import * as cardstyles from '../components/progress-observation-sub-category-card/progress-observation-sub-category-card.styles';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { useEffect } from 'react';
import { ProgressObservationCategoryState } from './progress-tracking-category.types';
import { ChildProgressAssessmentSteps } from '../child-progress-assessment/child-progress-assessment.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { contentReportSelectors } from '@store/content/report';

export const ProgressObservationCategory = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state: locationState } =
    useLocation<ProgressObservationCategoryState>();
  const { childId, progressTrackingCategoryId } = locationState;
  const category = useSelector(
    progressTrackingSelectors.getProgressTrackingCategoryById(
      progressTrackingCategoryId
    )
  );
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategoriesByCategoryId(
      progressTrackingCategoryId
    )
  );
  const reportingDate = locationState.reportingDate
    ? new Date(locationState.reportingDate)
    : new Date();
  const report = useSelector(
    contentReportSelectors.getChildProgressObservationReportByReportingPeriod(
      reportingDate,
      locationState.childId
    )
  );
  const { setCurrentCategoryById, startCurrentCategoryTracking } =
    useChildProgressObservation(childId, report);

  useEffect(() => {
    if (report) {
      setCurrentCategoryById(progressTrackingCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  const onStartTracking = () => {
    startCurrentCategoryTracking();

    history.push('child-progress-assessment', {
      step: ChildProgressAssessmentSteps.assessmentStepOne,
      childId: childId,
      progressTrackingCategoryId: progressTrackingCategoryId,
      reportingDate: locationState.reportingDate,
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      showBackground={false}
      color={'primary'}
      onBack={() => history.goBack()}
      title={category?.name}
      className={styles.bannerContentWrapper}
      displayOffline={!isOnline}
    >
      <div className={styles.wrapper}>
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
          <div
            className={styles.categoryArrowIconWrapper}
            style={{ color: category?.color }}
          >
            {renderIcon('ArrowDownIcon', 'h-10 w-10')}
          </div>
          <div
            className="rounded-15 border-4 pl-4 pr-4 pt-2 pb-2"
            style={{ borderColor: category?.color }}
          >
            {subCategories?.map((subCategory, index) => (
              <div
                key={`progress-sub-category-card-${subCategory.id}`}
                className={'mt-4 mb-4'}
              >
                <div className="flex flex-row">
                  <div
                    className={cardstyles.iconWrapper}
                    style={{ backgroundColor: category?.color }}
                  >
                    <img
                      className={'m-auto'}
                      src={subCategory?.imageUrl}
                      alt="card"
                    />
                  </div>
                  <Typography
                    className="mt-2"
                    text={subCategory?.name}
                    type="h4"
                    weight="bold"
                    lineHeight="snug"
                  />
                </div>
              </div>
            ))}
          </div>
          <Divider dividerType={'dashed'} className="mt-4 mb-4" />
          <Typography
            className={styles.spaceTop}
            color={'textMid'}
            type={'body'}
            hasMarkup={true}
            text={category?.description || ''}
          />

          <div className={styles.spaceTop}></div>
          <Button
            id="gtm-progress-tracking"
            color={'primary'}
            type={'filled'}
            disabled={false}
            onClick={onStartTracking}
            className={styles.startButton}
          >
            {renderIcon('ArrowCircleRightIcon', styles.buttonIcon)}
            <Typography
              color={'white'}
              type={'help'}
              weight={'normal'}
              text={'Start tracking'}
            />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default ProgressObservationCategory;
