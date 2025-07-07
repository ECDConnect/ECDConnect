import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  DialogPosition,
  ImageWithFallback,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useObserveProgressForAgeGroupAndCategory } from '@/hooks/useObserveProgressForAgeGroupAndCategory';
import { useCallback, useState } from 'react';
import {
  ProgressSkillValues,
  ProgressSkillValuesArray,
} from '@/enums/ProgressSkillValues';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../../class-dashboard/class-dashboard.types';
import { useDialog } from '@ecdlink/core';

export type ObservationsByCategoryState = {
  categoryId: number;
  ageGroupId: number;
};

export const ObservationsByCategory: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();

  const { state: routeState } = useLocation<ObservationsByCategoryState>();

  const {
    category,
    ageGroup,
    addObservationForSkill,
    skillsForAgeGroupAndCategory,
    childReports,
    syncChildProgressReports,
  } = useObserveProgressForAgeGroupAndCategory(
    routeState.categoryId,
    routeState.ageGroupId
  );

  const [currentStep, setCurrentStep] = useState<number>(1);

  const currentSkill = skillsForAgeGroupAndCategory[currentStep - 1];

  const handleShowSupportImage = useCallback(() => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, cancel) => (
        <div className="p-4">
          <Typography
            type="h3"
            color="textDark"
            text={currentSkill.description}
          />
          <ImageWithFallback
            className="mt-2 mb-2"
            src={currentSkill.supportImage}
          />
          <Button
            onClick={cancel}
            size="small"
            color="quatenary"
            textColor="quatenary"
            type="outlined"
            text={'Close'}
            className="w-full"
          />
        </div>
      ),
    });
  }, [dialog, currentSkill]);

  return (
    <BannerWrapper
      size={'small'}
      title={category?.name}
      subTitle={`Step ${currentStep} of ${skillsForAgeGroupAndCategory.length}`}
      onBack={() => {
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        } else {
          history.push(ROUTES.CLASSROOM.ROOT, {
            activeTabIndex: TabsItems.PROGRESS,
          });
        }
      }}
      renderBorder={true}
      displayOffline={!isOnline}
      onClose={() => {
        if (isOnline) {
          syncChildProgressReports();
        }
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.PROGRESS,
        });
      }}
    >
      <div className="mt-2 flex flex-col p-4">
        <div className="mt-4 mb-4 flex flex-row">
          <div
            className={`flex h-7 flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
              ageGroup.color || 'secondary'
            }`}
            style={{ height: 'fit-content', width: 'fit-content' }}
          >
            <Typography
              type="body"
              weight="bold"
              color="white"
              text={`${ageGroup.description}`}
              lineHeight={4}
              className="text-center"
            />
          </div>
          <div
            className={`ml-4 flex h-7 flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
              category.color || 'secondary'
            }`}
            style={{
              height: 'fit-content',
              width: 'fit-content',
              backgroundColor: category.color,
            }} // TODO - maybe fix the category colours???
          >
            <ImageWithFallback
              src={category.imageUrl}
              alt="category"
              className="mr-2 h-5 w-5"
            />
            <Typography
              type="body"
              weight="bold"
              color="white"
              text={`${category.name}`}
              lineHeight={4}
              className="text-center"
            />
          </div>
        </div>

        <div className="flex flex-row">
          <Typography
            type="h2"
            color="primary"
            text={currentSkill.description}
            className="mb-4"
          />
          {!!currentSkill.supportImage && (
            <div className="ml-auto">
              <Button
                onClick={() => handleShowSupportImage()}
                size="small"
                color="quatenary"
                textColor="white"
                type="filled"
                text={'Picture'}
              />
            </div>
          )}
        </div>

        {childReports.map((childReport) => (
          <div key={`child-${childReport.childId}`} className="mb-4">
            <Typography
              type="h3"
              color="textDark"
              text={childReport.childFirstName}
            />
            <ButtonGroup<ProgressSkillValues>
              type={ButtonGroupTypes.Button}
              options={ProgressSkillValuesArray.map((x) => ({
                text: x,
                value: x,
              }))}
              onOptionSelected={(
                value: ProgressSkillValues | ProgressSkillValues[]
              ) => {
                addObservationForSkill(
                  childReport.childId!,
                  childReport.activeReportingPeriodForChild?.id!,
                  currentSkill.id,
                  value as ProgressSkillValues
                );
              }}
              multiple={false}
              selectedOptions={
                childReport.report.skillObservations.find(
                  (x) => x.skillId === currentSkill.id
                )?.value
              }
              color="secondary"
              className="mt-2"
            />
          </div>
        ))}

        <Button
          onClick={() => {
            if (currentStep === skillsForAgeGroupAndCategory.length) {
              if (isOnline) {
                syncChildProgressReports();
              }
              history.push(ROUTES.CLASSROOM.ROOT, {
                activeTabIndex: TabsItems.PROGRESS,
              });
            } else {
              setCurrentStep(currentStep + 1);
            }
          }}
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon={
            currentStep === skillsForAgeGroupAndCategory.length
              ? 'SaveIcon'
              : 'ArrowCircleRightIcon'
          }
          text={
            currentStep === skillsForAgeGroupAndCategory.length
              ? 'Save'
              : 'Next'
          }
          textColor="white"
        />
      </div>
    </BannerWrapper>
  );
};
