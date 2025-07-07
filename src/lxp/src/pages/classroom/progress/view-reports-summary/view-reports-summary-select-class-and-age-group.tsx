import { BannerWrapper, Button, CoreRadioGroup, Typography } from '@ecdlink/ui';
import { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import ROUTES from '@/routes/routes';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { classroomsSelectors } from '@/store/classroom';

export const ProgressViewReportsSummarySelectClassroomGroupAndAgeGroup: React.FC =
  () => {
    const history = useHistory();

    const { children, currentReportingPeriod } = useProgressForChildren();
    const classroomGroups = useSelector(classroomsSelectors.getClassroomGroups);

    const [step, setStep] = useState(1);

    const [selectedAgeGroup, setSelectedAgeGroup] = useState<
      number | undefined
    >();
    const [selectedClassroomGroup, setSelectedClassroomGroup] = useState<
      string | undefined
    >();

    const availableAgeGroups = useMemo(() => {
      if (!selectedClassroomGroup) {
        return [];
      }

      var classroomGroup = classroomGroups.find(
        (x) => x.id === selectedClassroomGroup
      );

      const childrenForClassroomGroup = children.filter((x) =>
        classroomGroup?.learners.some((y) => y.childUserId === x.childUserId)
      );

      const ageGroups = childrenForClassroomGroup
        .map((x) => x.ageGroup)
        .filter((x) => !!x);

      return ageGroups.filter(
        (x, index) => ageGroups.findIndex((y) => x!.id === y!.id) === index
      );
    }, [children, selectedClassroomGroup]);

    return (
      <BannerWrapper
        size={'small'}
        title={`Child progress summary`}
        onBack={() =>
          history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 2 })
        }
      >
        <div className={'flex h-full flex-col px-4 pb-4 pt-4'}>
          {/* SELECT CLASSROOM GROUP */}
          {step === 1 && (
            <>
              <Typography
                color="textDark"
                text={'Choose a class to view'}
                type={'h2'}
                className="mb-4"
              />
              <Typography
                className="mb-2"
                type="h4"
                color="textMid"
                text={`${format(
                  new Date(currentReportingPeriod?.startDate || new Date()),
                  'd MMM'
                )} - ${format(
                  new Date(currentReportingPeriod?.endDate || new Date()),
                  'd MMM yyyy'
                )}`}
              />
              <CoreRadioGroup
                options={classroomGroups.map((x, index) => ({
                  id: index,
                  label: x.name,
                  value: x.id,
                }))}
                currentValue={selectedClassroomGroup}
                colour={'quatenary'}
                selectedOptionBackgroundColor="uiBg"
                onChange={(val: string) => {
                  setSelectedClassroomGroup(val);
                }}
              />
            </>
          )}
          {/* SELECT AGE GROUP */}
          {step === 2 && (
            <>
              <Typography
                color="textDark"
                text={'Choose an age range to view'}
                type={'h2'}
                className="mb-4"
              />
              <CoreRadioGroup
                options={availableAgeGroups.map((x, index) => ({
                  id: index,
                  label: x!.name,
                  value: x!.id,
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
          <Button
            onClick={() => {
              if (step === 1) {
                setStep(2);
              } else {
                history.replace(ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY, {
                  ageGroupId: selectedAgeGroup,
                  classroomGroupId: selectedClassroomGroup,
                });
              }
            }}
            className="mt-4 mb-4 w-full"
            size="normal"
            color="quatenary"
            type="filled"
            text={'Next'}
            icon={'ArrowCircleRightIcon'}
            textColor="white"
            disabled={step === 1 ? !selectedClassroomGroup : !selectedAgeGroup}
          />
        </div>
      </BannerWrapper>
    );
  };
