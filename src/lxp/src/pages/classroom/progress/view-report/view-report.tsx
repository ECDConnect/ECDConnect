import {
  BannerWrapper,
  Button,
  Card,
  Divider,
  ImageWithFallback,
  Typography,
} from '@ecdlink/ui';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { format } from 'date-fns';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import ROUTES from '@/routes/routes';
import { useProgressForChild } from '@/hooks/useProgressForChild';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export type ProgressViewReportState = {
  childId: string;
  reportId: string;
};

export const ProgressViewReport: React.FC = () => {
  const history = useHistory();

  const { isOnline } = useOnlineStatus();

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories()
  );

  const { state: routeState } = useLocation<ProgressViewReportState>();

  const { childId } = routeState;
  const { child, detailedReports } = useProgressForChild(childId);

  const report = detailedReports.find((x) => x.id === routeState.reportId);

  const doNotKnowSkillsByCategory = useMemo(() => {
    const doNotKnowSkills =
      report?.skillObservations.filter(
        (x) => x.value === ProgressSkillValues.DoNotKnow
      ) || [];

    const doNotKnowSubCategories = subCategories.filter((x) =>
      doNotKnowSkills.some((y) => y.subCategoryId === x.id)
    );

    return categories
      .filter((x) => doNotKnowSkills.some((y) => y.categoryId === x.id))
      .map((category) => {
        const subCats = doNotKnowSubCategories.filter((x) =>
          category.subCategories.some((y) => y.id === x.id)
        );

        return {
          ...category,
          subCategories: subCats.map((x) => ({
            ...x,
            skills: doNotKnowSkills.filter((y) => y.subCategoryId === x.id),
          })),
        };
      });
  }, [categories, subCategories, report]);

  const skillsToWorkOnByCategory = useMemo(() => {
    if (!report) {
      return [];
    }

    const toWorkOnSubCategories = subCategories.filter((x) =>
      report.skillsToWorkOn.some((y) => y.subCategoryId === x.id)
    );

    return categories
      .filter((x) => report.skillsToWorkOn.some((y) => y.categoryId === x.id))
      .map((category) => {
        const subCats = toWorkOnSubCategories.filter((x) =>
          category.subCategories.some((y) => y.id === x.id)
        );

        return {
          ...category,
          subCategories: subCats.map((x) => ({
            ...x,
            skills: report.skillsToWorkOn.filter(
              (y) => y.subCategoryId === x.id
            ),
          })),
        };
      });
  }, [categories, subCategories, report]);

  return (
    <BannerWrapper
      size={'small'}
      title={`Report ${report?.reportingPeriodNumber} - ${new Date(
        report!.reportingPeriodEndDate
      ).getFullYear()}`}
      subTitle={`${child?.user?.firstName} ${child?.user?.surname}`}
      onBack={() => history.goBack()}
      renderBorder={true}
      displayOffline={!isOnline}
    >
      <div className={'flex h-full flex-col px-4 pb-4 pt-4'}>
        <Typography
          type="h2"
          color="textDark"
          text={`Report ${report?.reportingPeriodNumber} - ${new Date(
            report!.reportingPeriodEndDate
          ).getFullYear()}`}
        />
        <Typography
          className="mb-2"
          type="h4"
          color="textMid"
          text={`${format(
            new Date(report?.reportingPeriodStartDate || ''),
            'd MMM'
          )} - ${format(
            new Date(report?.reportingPeriodEndDate || ''),
            'd MMM yyyy'
          )}`}
        />
        <Divider dividerType="dashed" />
        <Typography
          className="mt-4 mb-4"
          type="h3"
          color="textDark"
          text={'Focus areas:'}
        />
        {/* Show skills to work on */}
        {skillsToWorkOnByCategory.map((category) => (
          <div key={category.id}>
            <Card className="border-primary mb-4 rounded-2xl border p-4">
              <div className="flex flex-row items-center">
                <ImageWithFallback
                  src={category.imageUrl}
                  alt="category"
                  className="mr-2 h-12 w-12"
                />
                <Typography type="h3" color="textDark" text={category.name} />
              </div>
              {category.subCategories.map((subCategory) => (
                <div key={subCategory.id}>
                  <Divider dividerType="dashed" className="mt-2 mb-2" />
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
                    <div key={skill.skillId}>
                      <Typography
                        type="small"
                        color="textMid"
                        className="mt-2"
                        text={'Skill:'}
                      />
                      <Typography
                        type="body"
                        color="textDark"
                        className="mt-2"
                        text={skill.skillName}
                      />
                      <Typography
                        type="small"
                        color="textMid"
                        className="mt-2"
                        text={'Todo:'}
                      />
                      <Typography
                        type="body"
                        color="textDark"
                        className="mt-2"
                        text={skill.howToSupport}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Show notes */}
        {!!report?.notes && (
          <>
            <Divider dividerType="dashed" />
            <Typography type="h3" color="textDark" text={'Notes'} />
            <Typography type="body" color="textMid" text={report.notes} />
            <Divider dividerType="dashed" />
          </>
        )}

        {/* Do not know skills */}
        {report?.skillObservations.some(
          (x) => x.value === ProgressSkillValues.DoNotKnow
        ) && (
          <>
            <Divider dividerType="dashed" className="mb-4" />
            <Typography
              type="h3"
              color="textDark"
              className="mb-4"
              text={'You chose “Don’t know” for these skills'}
            />
            {doNotKnowSkillsByCategory.map((category) => (
              <div key={category.id}>
                <Card className="bg-uiBg mb-4 rounded-2xl p-4">
                  <div className="flex flex-row items-center">
                    <ImageWithFallback
                      src={category.imageUrl}
                      alt="category"
                      className="mr-2 h-12 w-12"
                    />
                    <Typography
                      type="h3"
                      color="textDark"
                      text={category.name}
                    />
                  </div>
                  {category.subCategories.map((subCategory) => (
                    <div key={subCategory.id}>
                      <Divider dividerType="dashed" className="mt-2 mb-2" />
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
                        <div key={skill.skillId}>
                          <Typography
                            type="body"
                            color="textDark"
                            className="mt-4"
                            text={skill.skillName}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </Card>
              </div>
            ))}
          </>
        )}

        <Button
          onClick={() =>
            history.push(ROUTES.PROGRESS_SHARE_REPORT, {
              childId: routeState.childId,
              reportId: routeState.reportId,
            })
          }
          className="mt-4 mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          text={'Share caregiver report'}
          icon={'ShareIcon'}
          textColor="white"
        />
        <Button
          onClick={() =>
            history.push(ROUTES.PROGRESS_REPORT_LIST, {
              childId: routeState.childId,
            })
          }
          className="mb-4 w-full"
          size="normal"
          color="quatenary"
          type="outlined"
          icon="ArrowCircleLeftIcon"
          text="Back to reports"
          textColor="quatenary"
        />
      </div>
    </BannerWrapper>
  );
};
