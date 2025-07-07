import { classroomsSelectors } from '@/store/classroom';
import {
  Alert,
  BannerWrapper,
  Button,
  CoreRadioGroup,
  ImageWithFallback,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import ROUTES from '@/routes/routes';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const SelectCategoryToTrack: React.FC = () => {
  const history = useHistory();

  const { isOnline } = useOnlineStatus();

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const { currentReportingPeriod, ageGroupsAvailableForTracking, children } =
    useProgressForChildren();

  const [step, setStep] = useState(1);

  const [selectedAgeGroup, setSelectedAgeGroup] = useState<
    number | undefined
  >();
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();

  // Get filtered categories based on age group
  const skills = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(selectedAgeGroup || 0)
  );

  const filteredCategories = categories.filter((cat) =>
    skills.some((skill) => skill.subCategory.category.id === cat.id)
  );

  // we need to find the children over 5 from the original list and not filtered
  const anyChildrenOver5 = children.some(
    (x) => x.ageInMonths && x.ageInMonths > 60
  );

  return (
    <BannerWrapper
      size={'small'}
      title={`Track progress - report ${currentReportingPeriod?.reportNumber}`}
      subTitle={`Step ${step} of 2`}
      onBack={() => (step === 2 ? setStep(1) : history.goBack())}
      renderBorder={true}
      displayOffline={!isOnline}
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
              options={filteredCategories.map((x) => ({
                id: x.id,
                label: x.name,
                value: x.id,
                icon: <ImageWithFallback src={x.imageUrl} alt="category" />,
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
        {anyChildrenOver5 && (
          <Alert
            className="mt-4"
            type={'warning'}
            messageColor="textDark"
            title={'Some children are older than 5 years old!'}
            list={[
              'Our progress trackers are only for children 5 years old and younger',
              "Stay tuned, tools for tracking older children's progress are coming soon!",
            ]}
          />
        )}
        <Button
          onClick={() => {
            if (step === 1) {
              setStep(2);
            } else if (step === 2) {
              history.push(ROUTES.PROGRESS_OBSERVATIONS_BY_CATEGORY, {
                categoryId: selectedCategory,
                ageGroupId: selectedAgeGroup,
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
