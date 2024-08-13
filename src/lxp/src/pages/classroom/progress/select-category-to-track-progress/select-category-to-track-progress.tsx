import { classroomsSelectors } from '@/store/classroom';
import { BannerWrapper, Button, CoreRadioGroup, Typography } from '@ecdlink/ui';
import { useObserveProgressForChildren } from '@/hooks/useObserveProgressForChildren';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import ROUTES from '@/routes/routes';

export const SelectCategoryToTrack: React.FC = () => {
  const history = useHistory();

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const { currentReportingPeriod, ageGroupsAvailableForTracking } =
    useObserveProgressForChildren();

  const [step, setStep] = useState(1);

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    number | undefined
  >();
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  return (
    <BannerWrapper
      size={'small'}
      title={`Track progress - report ${currentReportingPeriod?.reportNumber}`}
      subTitle={`Step ${step} of 2`}
      onBack={() => (step === 2 ? setStep(1) : history.goBack())}
    >
      <div className="mt-2 flex h-full flex-col p-4">
        {/* Step 1 */}
        {step === 1 && (
          <>
            <Typography
              color="textDark"
              text={'Which age group do you want to track progress for?'}
              type={'h2'}
              className="mb-4"
            />
            <CoreRadioGroup
              options={ageGroupsAvailableForTracking.map((x) => ({
                id: x.id,
                label: x.name,
                value: x.id,
              }))}
              currentValue={selectedAgeGroup}
              colour={'quatenary'}
              selectedOptionBackgroundColor="uiBg"
              onChange={(val: number) => {
                setSelectedAgeGroup(val);
              }}
            />
          </>
        )}
        {step === 2 && (
          <>
            <Typography
              color="textDark"
              text={'Which category do you want to track?'}
              type={'h2'}
              className="mb-4"
            />
            <CoreRadioGroup
              options={categories.map((x) => ({
                id: x.id,
                label: x.name,
                value: x.id,
                icon: <img src={x.imageUrl} alt="category" />,
              }))}
              currentValue={selectedCategory}
              colour={'quatenary'}
              selectedOptionBackgroundColor="uiBg"
              onChange={(val: number) => {
                setSelectedCategory(val);
              }}
            />
          </>
        )}
        <Button
          onClick={() => {
            if (step === 1) {
              setStep(2);
            } else if (step === 2) {
              history.push(ROUTES.PROGRESS_OBSERVATIONS_BY_CATEGORY, {
                categoryId: selectedCategory,
                ageGroup: selectedAgeGroup,
              });
            }
          }}
          className="mt-auto w-full"
          size="small"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'ArrowCircleRightIcon'}
          text={'Next'}
          disabled={
            (step === 1 && !selectedAgeGroup) ||
            (step === 2 && !selectedCategory)
          }
        />
      </div>
    </BannerWrapper>
  );
};
