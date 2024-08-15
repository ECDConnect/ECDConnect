import {
  Alert,
  Button,
  Card,
  Divider,
  ListItem,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { ChildDto, ProgressTrackingAgeGroupDto } from '@ecdlink/core';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { differenceInMonths, format, isBefore } from 'date-fns';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { useMemo, useState } from 'react';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { useSelector } from 'react-redux';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export type ProgressLandingCompleteProps = {
  childId: string;
  child: ChildDto;
  currentReportingPeriod: ProgressReportPeriod;
  currentReport: ChildProgressDetailedReport;
  currentAgeGroup: ProgressTrackingAgeGroupDto | undefined;
};

export const ProgressLandingComplete: React.FC<
  ProgressLandingCompleteProps
> = ({
  childId,
  child,
  currentAgeGroup,
  currentReportingPeriod,
  currentReport,
}) => {
  const history = useHistory();
  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories()
  );

  const [showDetails, setShowDetails] = useState(false);

  const isBeforePeriod = isBefore(
    new Date(),
    new Date(currentReportingPeriod.startDate)
  );

  const doNotKnowSkills = useMemo(() => {
    return currentReport.skillObservations.filter(
      (x) => x.value === ProgressSkillValues.DoNotKnow
    );
  }, [currentReport]);

  const doNotKnowSkillsByCategory = useMemo(() => {
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
  }, [categories, subCategories, doNotKnowSkills]);

  const skillsToWorkOnByCategory = useMemo(() => {
    const toWorkOnSubCategories = subCategories.filter((x) =>
      currentReport.skillsToWorkOn.some((y) => y.subCategoryId === x.id)
    );

    return categories
      .filter((x) =>
        currentReport.skillsToWorkOn.some((y) => y.categoryId === x.id)
      )
      .map((category) => {
        const subCats = toWorkOnSubCategories.filter((x) =>
          category.subCategories.some((y) => y.id === x.id)
        );

        return {
          ...category,
          subCategories: subCats.map((x) => ({
            ...x,
            skills: currentReport.skillsToWorkOn.filter(
              (y) => y.subCategoryId === x.id
            ),
          })),
        };
      });
  }, [categories, subCategories, currentReport]);

  const ageInMonths =
    !!child.user && !!child.user.dateOfBirth
      ? differenceInMonths(new Date(), new Date(child.user!.dateOfBirth!))
      : 0;

  const currentObservationsAllPositive = currentReport.skillObservations.every(
    (x) => x.isPositive
  );

  return (
    <>
      <Card className="bg-successMain my-4 flex items-center gap-4 rounded-2xl p-4">
        <EmojiYellowSmile className="h-16 w-12" />
        <Typography
          type="h3"
          weight="bold"
          color="white"
          text={`You have completed ${child.user?.firstName}'s progress observations!`}
        />
      </Card>
      {isBeforePeriod && (
        <Alert
          type={'info'}
          messageColor="textDark"
          title={`You can create the caregiver report from ${format(
            new Date(currentReportingPeriod.startDate),
            'd MMMM'
          )}`}
          list={[
            `Keep observing ${child.user?.firstName} & tap "See completed sections" to edit you observations.`,
          ]}
        />
      )}
      {!isBeforePeriod && (
        <Typography
          type="body"
          color="textMid"
          text={
            'You can edit your observations, add a note, or create the progress report.'
          }
          className="mb-4"
        />
      )}
      {!currentReport.notes && (
        <ListItem
          key={'notes'}
          title={'Add a note'}
          subTitle={'Write a note or observation'}
          buttonType={'filled'}
          buttonIcon={'PlusIcon'}
          buttonText={'Add'}
          buttonTextColor={'white'}
          buttonColor={'quatenary'}
          showButton={true}
          showDivider={true}
          withBorderRadius={false}
          dividerType={'dashed'}
          withPaddingY={true}
          onButtonClick={() =>
            history.push(ROUTES.PROGRESS_OBSERVATIONS_NOTES, {
              childId: childId,
            })
          }
        />
      )}
      {(isBeforePeriod || currentReport.unknownPercentage >= 25) && (
        <Button
          onClick={() =>
            history.push(ROUTES.PROGRESS_OBSERVATIONS, {
              childId: childId,
            })
          }
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="ArrowCircleRightIcon"
          text="Keep tracking progress"
          textColor="white"
        />
      )}
      {!isBeforePeriod && currentReport.unknownPercentage < 25 && (
        <Button
          onClick={() =>
            history.push(ROUTES.PROGRESS_CREATE_REPORT, {
              childId: childId,
            })
          }
          className="mt-auto mb-4 w-full"
          size="normal"
          color="quatenary"
          type="filled"
          icon="DocumentReportIcon"
          text="Create caregiver report"
          textColor="white"
        />
      )}
      <Button
        onClick={() => setShowDetails(!showDetails)}
        className="mb-4 w-full"
        size="normal"
        color="quatenary"
        type="outlined"
        icon={showDetails ? 'EyeOffIcon' : 'EyeIcon'}
        text={showDetails ? 'Hide details' : 'Show details'}
        textColor="quatenary"
      />
      {showDetails && (
        <div className="pb-4">
          <Divider dividerType="dashed" className="mb-4" />
          <Typography
            type="h3"
            color="textDark"
            className="mb-4"
            text={`What you are working on with ${child.user?.firstName}`}
          />

          {/* All positive answers, green success card */}
          {currentObservationsAllPositive && (
            <Card className="bg-successBg mb-4 rounded-2xl p-4">
              <div className="flex flex-row items-center">
                <EmojiYellowSmile className="mr-4 h-16 w-12" />
                <Typography
                  type="h3"
                  color="tertiary"
                  text={`Wonderful! ${child.user?.firstName} is ${ageInMonths} months old and can do everything in the ${currentAgeGroup?.description} progress tracker!`}
                />
              </div>
              <Divider dividerType="dashed" className="mt-2 mb-2" />
              <Typography
                type="body"
                color="textDark"
                text={`Keep observing ${child.user?.firstName} and supporting their learning.`}
              />
              <Typography
                type="body"
                color="textMid"
                className="mt-2"
                text={'Todo:'}
              />
              <Typography
                type="body"
                color="textDark"
                text={currentReport.howToSupport}
              />
              <Button
                onClick={() =>
                  history.push(ROUTES.PROGRESS_OBSERVATIONS, {
                    childId: childId,
                    step: 'SupportLearning',
                  })
                }
                className="mt-2"
                size="normal"
                color="quatenary"
                type="filled"
                icon="PencilIcon"
                text="Edit"
                textColor="white"
                iconPosition="end"
              />
            </Card>
          )}

          {/* Show skills to work on */}
          {!currentObservationsAllPositive &&
            skillsToWorkOnByCategory.map((category) => (
              <div key={category.id}>
                <Card className="bg-uiBg mb-4 rounded-2xl p-4">
                  <div className="flex flex-row items-center">
                    <img
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
                        <img
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
                          <Button
                            onClick={() =>
                              history.push(ROUTES.PROGRESS_OBSERVATIONS, {
                                childId: childId,
                                step: 'SupportLearning',
                              })
                            }
                            className="mt-2"
                            size="normal"
                            color="quatenary"
                            type="filled"
                            icon="PencilIcon"
                            text="Edit"
                            textColor="white"
                            iconPosition="end"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </Card>
              </div>
            ))}

          {/* Show notes */}
          {!!currentReport.notes && (
            <Card className="bg-uiBg mb-4 rounded-2xl p-4">
              <Typography type="h3" color="textDark" text={'Notes'} />
              <Typography
                type="body"
                color="textMid"
                text={currentReport.notes}
              />
              <Button
                onClick={() =>
                  history.push(ROUTES.PROGRESS_OBSERVATIONS_NOTES, {
                    childId: childId,
                  })
                }
                className="mt-2"
                size="normal"
                color="quatenary"
                type="filled"
                icon="PencilIcon"
                text="Edit"
                textColor="white"
                iconPosition="end"
              />
            </Card>
          )}

          {/* Do not know skills */}
          {currentReport.skillObservations.some(
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
                      <img
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
                          <img
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
                            <Button
                              onClick={() =>
                                history.push(ROUTES.PROGRESS_OBSERVATIONS, {
                                  childId: childId,
                                  jumpToSkillId: skill.skillId,
                                })
                              }
                              className="mt-2"
                              size="normal"
                              color="quatenary"
                              type="filled"
                              icon="PencilIcon"
                              text="Edit"
                              textColor="white"
                              iconPosition="end"
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
          {!!doNotKnowSkills.length && currentReport.unknownPercentage < 25 && (
            <Alert
              type={'info'}
              messageColor="textDark"
              title={`Keep observing ${child.user?.firstName} and take note of which of these things ${child.user?.firstName} can or does do!`}
            />
          )}
          <Button
            onClick={() =>
              history.push(ROUTES.PROGRESS_OBSERVATIONS, {
                childId: childId,
              })
            }
            className="mt-4"
            size="normal"
            color="quatenary"
            type="filled"
            icon="PencilAltIcon"
            text="Change my answers"
            textColor="white"
          />
        </div>
      )}
    </>
  );
};
