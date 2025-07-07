import {
  BannerWrapper,
  Button,
  Card,
  Divider,
  ImageWithFallback,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useProgressForClassAndAgeGroup } from '@/hooks/useProgressForClassAndAgeGroup';
import { useProgressGenerateSummaryPdfReport } from '@/hooks/useProgressGenerateSummaryPdfReport';
import { useMemo, useRef } from 'react';
import { ProgresseportsSummaryPdf } from './reports-summary-pdf';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ProgressTrackingService } from '@/services/ProgressTrackingService';
import { authSelectors } from '@/store/auth';
import { pointsThunkActions } from '@/store/points';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../../class-dashboard/class-dashboard.types';

export type ProgressViewReportsSummaryState = {
  ageGroupId: number;
  classroomGroupId: string;
};

export const ProgressViewReportsSummary: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const userAuth = useSelector(authSelectors.getAuthUser);

  const { state: routeState } = useLocation<ProgressViewReportsSummaryState>();

  const {
    reportsSummary,
    classroomGroup,
    ageGroup,
    childReports,
    currentReportingPeriod,
  } = useProgressForClassAndAgeGroup(
    routeState.classroomGroupId,
    routeState.ageGroupId
  );

  const { generateReport } = useProgressGenerateSummaryPdfReport();

  const splitPdf = useMemo(() => {
    if (reportsSummary.length < 3) {
      return false;
    }

    const skillCounts = reportsSummary.map((x) =>
      x.subCategories.reduce((count, subCat) => {
        return count + subCat.skills.length;
      }, 0)
    );

    if (
      (skillCounts[0] || 0) + (skillCounts[2] || 0) > 15 ||
      (skillCounts[1] || 0) + (skillCounts[3] || 0) > 15
    ) {
      return true;
    }

    return false;
  }, [reportsSummary]);

  const shareRef = useRef<HTMLDivElement>(null);

  const currentPractitioner = useSelector(
    practitionerSelectors.getPractitioner
  );
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(classroomGroup!.userId)
  );

  const classPractitioner = practitioner || currentPractitioner;

  const addPoints = async () => {
    if (isOnline) {
      await new ProgressTrackingService(
        userAuth?.auth_token || ''
      ).classroomProgressSummaryDownloaded(routeState.classroomGroupId);

      const currentDate = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setMonth(currentDate.getMonth() - 12);
      appDispatch(
        pointsThunkActions.getPointsSummaryForUser({
          userId: userAuth?.id!,
          startDate: oneYearAgo,
          endDate: currentDate,
        })
      ).unwrap();
    }
  };

  const handleGoBack = () => {
    history.push(ROUTES.CLASSROOM.ROOT, {
      activeTabIndex: TabsItems.PROGRESS,
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      title={`${classroomGroup?.name} progress summary`}
      onBack={() => handleGoBack()}
    >
      <div className={'flex h-full flex-col px-4 pb-4 pt-4'}>
        <Typography
          type="h2"
          color="textDark"
          text={`${classroomGroup?.name} - progress summary`}
        />
        <Typography
          className="mb-2"
          type="h4"
          color="textDark"
          text={`Progress reports created for ${childReports.length} children`}
        />
        <div
          className={`mb-4 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1 bg-${
            ageGroup.color || 'secondary'
          }`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="buttonSmall"
            weight="bold"
            color="white"
            text={`${ageGroup.description}`}
            lineHeight={4}
            className="text-center"
          />
        </div>
        <Divider dividerType="solid" />
        <Typography
          className="mt-4"
          type="h4"
          color="textDark"
          text={'Number of children working on each skill'}
        />
        {reportsSummary.map((category) => (
          <div key={category.id} className="mt-4">
            <div className="mb-4 flex flex-row items-center">
              <ImageWithFallback
                src={category.imageUrl}
                alt="category"
                className="mr-2 h-12 w-12"
              />
              <Typography type="h3" color="textDark" text={category.name} />
            </div>
            <Card className="bg-uiBg mb-4 rounded-2xl p-4">
              {category.subCategories.map((subCategory) => (
                <div key={subCategory.id} className="mb-4">
                  <div className="flex flex-row items-center">
                    <ImageWithFallback
                      src={subCategory.imageUrl}
                      alt="category"
                      className="mr-2 h-8 w-8"
                    />
                    <Typography
                      type="h4"
                      color="textDark"
                      text={subCategory.name.toUpperCase()}
                    />
                  </div>
                  {subCategory.skills.map((skill) => (
                    <div key={skill.id} className="mt-4 flex flex-row">
                      <Typography
                        type="h4"
                        color="textDark"
                        className="mr-4"
                        text={skill.childrenWorkingOnSkillCount.toString()}
                      />
                      <Typography
                        type="body"
                        color="textMid"
                        text={skill.description}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
            <Divider dividerType="dashed" />
          </div>
        ))}
        {/* Hidden PDF content */}
        <div hidden={true}>
          <div ref={shareRef} style={{ letterSpacing: '0.01px' }}>
            <ProgresseportsSummaryPdf
              ageGroup={ageGroup}
              classroomGroupName={classroomGroup?.name || ''}
              currentReportingPeriod={currentReportingPeriod!}
              practitionerName={`${classPractitioner?.user?.firstName} ${
                classPractitioner?.user?.surname || ''
              }`}
              reportSummaries={
                splitPdf ? reportsSummary.slice(0, 2) : reportsSummary
              }
            />
            {splitPdf && (
              <div className="mt-20">
                <ProgresseportsSummaryPdf
                  ageGroup={ageGroup}
                  classroomGroupName={classroomGroup?.name || ''}
                  currentReportingPeriod={currentReportingPeriod!}
                  practitionerName={`${classPractitioner?.user?.firstName} ${
                    classPractitioner?.user?.surname || ''
                  }`}
                  reportSummaries={
                    splitPdf ? reportsSummary.slice(2, 4) : reportsSummary
                  }
                />
              </div>
            )}
          </div>
        </div>
        <Button
          disabled={!isOnline}
          onClick={() => {
            generateReport(
              shareRef.current!,
              shareRef.current?.offsetWidth || 750
            );
            addPoints();
          }}
          className="mt-4 mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          text={'Download summary'}
          icon={'DownloadIcon'}
          textColor="white"
        />
      </div>
    </BannerWrapper>
  );
};
