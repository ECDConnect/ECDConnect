import { Card, Divider, ImageWithFallback, Typography } from '@ecdlink/ui';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import { ProgressReportsCategorySummary } from '@/models/progress/child-progress-report';
import { ProgressTrackingAgeGroupDto } from '@ecdlink/core';

export type ProgressReportsSummaryPdfProps = {
  reportSummaries: ProgressReportsCategorySummary[];
  classroomGroupName: string;
  practitionerName: string;
  currentReportingPeriod: ProgressReportPeriod;
  ageGroup: ProgressTrackingAgeGroupDto;
};

export const ProgresseportsSummaryPdf: React.FC<
  ProgressReportsSummaryPdfProps
> = ({
  reportSummaries,
  classroomGroupName,
  practitionerName,
  currentReportingPeriod,
  ageGroup,
}) => {
  const getCategoryBg = (categoryName: string) => {
    switch (categoryName) {
      case 'Social emotional':
        return '#FFF4F9';
      case 'Cognitive':
        return '#F7F8FB';
      case 'Physical':
        return '#F9FCF4';
      case 'Language':
        return '#FAF6F9';
      default:
        return '#000000';
    }
  };

  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px' }}
    >
      <div className="flex flex-row">
        <Typography
          type="h1"
          color="textDark"
          text={`Report ${
            currentReportingPeriod!.reportNumber
          } Progress Summary`}
        />
        <div
          className={`bg-quatenary mt-3 ml-auto flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="buttonSmall"
            weight="bold"
            color="white"
            text={`${format(
              new Date(currentReportingPeriod?.startDate || ''),
              'd MMM'
            )} - ${format(
              new Date(currentReportingPeriod?.endDate || ''),
              'd MMM yyyy'
            )}`}
            lineHeight={4}
            className="pb-2 text-center"
          />
        </div>
      </div>

      <div className="mb-2 flex flex-row">
        <div className="flex flex-row">
          <Typography
            className="mr-2"
            type="h4"
            color="textDark"
            text={'Practitioner:'}
          />
          <Typography type="body" color="textDark" text={practitionerName} />
        </div>
        <div className="ml-auto flex flex-row">
          <Typography
            className="mr-2"
            type="h4"
            color="textDark"
            text={'Class:'}
          />
          <Typography
            type="body"
            color="textDark"
            text={`${classroomGroupName}`}
          />
        </div>
        <div className="ml-auto mr-5 flex flex-row">
          <Typography
            className="mr-2"
            type="h4"
            color="textDark"
            text={'Age:'}
          />
          <Typography type="body" color="textDark" text={`${ageGroup.name}`} />
        </div>
      </div>
      <Divider dividerType="dashed" />
      <Typography
        type="h2"
        color="textDark"
        text={'Number of children working on each skill:'}
        className="mb-5"
      />

      {!!reportSummaries.length && (
        <>
          <div className="flex flex-row">
            <div className="mr-4 w-1/2">
              <div className="ml-4 flex flex-row items-center">
                <ImageWithFallback
                  src={reportSummaries[0].imageUrl}
                  alt="category"
                  className="mr-2 h-8 w-8"
                />
                <Typography
                  type="h3"
                  color="textDark"
                  text={reportSummaries[0].name}
                  className="pb-4"
                />
              </div>
              <div
                className="mb-4 rounded-sm rounded-2xl border-2 p-4 shadow-sm"
                style={{
                  backgroundColor: getCategoryBg(reportSummaries[0].name),
                  borderColor: reportSummaries[0].color,
                }}
              >
                {reportSummaries[0].subCategories.map((subCategory) => (
                  <div key={subCategory.id}>
                    <div className="flex flex-row items-center">
                      <ImageWithFallback
                        src={subCategory.imageUrl}
                        alt="category"
                        className="mr-2 h-6 w-6"
                      />
                      <Typography
                        type="button"
                        color="textDark"
                        text={subCategory.name.toUpperCase()}
                        className="pb-3"
                      />
                    </div>
                    {subCategory.skills.map((skill) => (
                      <div key={skill.id} className="mb-2 flex flex-row">
                        <Typography
                          type="h5"
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
              </div>
            </div>
            {reportSummaries.length >= 2 && (
              <div className="w-1/2">
                <div className="ml-4 flex flex-row items-center">
                  <ImageWithFallback
                    src={reportSummaries[1].imageUrl}
                    alt="category"
                    className="mr-2 h-8 w-8"
                  />
                  <Typography
                    type="h3"
                    color="textDark"
                    text={reportSummaries[1].name}
                    className="pb-4"
                  />
                </div>
                <div
                  className="mb-4 rounded-sm rounded-2xl border-2 p-4 shadow-sm"
                  style={{
                    backgroundColor: getCategoryBg(reportSummaries[1].name),
                    borderColor: reportSummaries[1].color,
                  }}
                >
                  {reportSummaries[1].subCategories.map((subCategory) => (
                    <div key={subCategory.id}>
                      <div className="flex flex-row items-center">
                        <ImageWithFallback
                          src={subCategory.imageUrl}
                          alt="category"
                          className="mr-2 h-6 w-6"
                        />
                        <Typography
                          type="h4"
                          color="textDark"
                          text={subCategory.name.toUpperCase()}
                          className="pb-3"
                        />
                      </div>
                      {subCategory.skills.map((skill) => (
                        <div key={skill.id} className="mb-2 flex flex-row">
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
                </div>
              </div>
            )}
          </div>
          {reportSummaries.length >= 3 && (
            <div className="flex flex-row">
              <div className="mr-4 w-1/2">
                <div className="ml-4 flex flex-row items-center">
                  <ImageWithFallback
                    src={reportSummaries[2].imageUrl}
                    alt="category"
                    className="mr-2 h-8 w-8"
                  />
                  <Typography
                    type="h3"
                    color="textDark"
                    text={reportSummaries[2].name}
                    className="pb-4"
                  />
                </div>
                <div
                  className="mb-4 rounded-sm rounded-2xl border-2 p-4 shadow-sm"
                  style={{
                    backgroundColor: getCategoryBg(reportSummaries[2].name),
                    borderColor: reportSummaries[2].color,
                  }}
                >
                  {reportSummaries[2].subCategories.map((subCategory) => (
                    <div key={subCategory.id}>
                      <div className="flex flex-row items-center">
                        <ImageWithFallback
                          src={subCategory.imageUrl}
                          alt="category"
                          className="mr-2 h-6 w-6"
                        />
                        <Typography
                          type="h4"
                          color="textDark"
                          text={subCategory.name.toUpperCase()}
                          className="pb-3"
                        />
                      </div>
                      {subCategory.skills.map((skill) => (
                        <div key={skill.id} className="mb-2 flex flex-row">
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
                </div>
              </div>
              {reportSummaries.length >= 4 && (
                <div className="w-1/2">
                  <div className="ml-4 flex flex-row items-center">
                    <ImageWithFallback
                      src={reportSummaries[3].imageUrl}
                      alt="category"
                      className="mr-2 h-8 w-8"
                    />
                    <Typography
                      type="h3"
                      color="textDark"
                      text={reportSummaries[3].name}
                      className="pb-4"
                    />
                  </div>
                  <div
                    className="mb-4 rounded-sm rounded-2xl border-2 p-4 shadow-sm"
                    style={{
                      backgroundColor: getCategoryBg(reportSummaries[3].name),
                      borderColor: reportSummaries[3].color,
                    }}
                  >
                    {reportSummaries[3].subCategories.map((subCategory) => (
                      <div key={subCategory.id}>
                        <div className="flex flex-row items-center">
                          <ImageWithFallback
                            src={subCategory.imageUrl}
                            alt="category"
                            className="mr-2 h-6 w-6"
                          />
                          <Typography
                            type="h4"
                            color="textDark"
                            text={subCategory.name.toUpperCase()}
                            className="pb-3"
                          />
                        </div>
                        {subCategory.skills.map((skill) => (
                          <div key={skill.id} className="mb-2 flex flex-row">
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
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <Card className="bg-textDark mb-4 mt-auto flex flex-row rounded-2xl p-4">
        <ImageWithFallback src={lightbulbEmoji} className="mr-4 h-14 w-14" />
        <div className="flex flex-col">
          <Typography
            type="h2"
            color="white"
            text={'Help children develop holistically!'}
          />
          <Typography
            type="buttonSmall"
            color="white"
            text={
              'You can print this out and stick it up in your classroom to remind you which activities you should focus on.'
            }
          />
        </div>
      </Card>
    </div>
  );
};
