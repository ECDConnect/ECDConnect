import { Card, Divider, Typography } from '@ecdlink/ui';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { format } from 'date-fns';
import lightbulbEmoji from '@/assets/ECD_Connect_lightbulb.png';
import {
  ChildProgressDetailedSkillObservation,
  ProgressReportsCategorySummary,
} from '@/models/progress/child-progress-report';
import {
  ProgressTrackingAgeGroupDto,
  ProgressTrackingCategoryDto,
} from '@ecdlink/core';
import blueFaceImg from '@/assets/progress-reports/blue-face.png';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export type ProgressCaregiverReportBuildingPageProps = {
  childFirstName: string;
  pageNumber: number;
  totalPages: number;
  reportingPeriodEndDate: Date;
  skillsByCategory: (ProgressTrackingCategoryDto & {
    skills: ChildProgressDetailedSkillObservation[];
  })[];
};

export const ProgressCaregiverReportBuildingPage: React.FC<
  ProgressCaregiverReportBuildingPageProps
> = ({
  childFirstName,
  pageNumber,
  totalPages,
  reportingPeriodEndDate,
  skillsByCategory,
}) => {
  return (
    <div
      className={'flex flex-col px-4 pb-4 pt-4'}
      style={{ height: '1100px' }}
    >
      <div className="mb-4 flex flex-row">
        <img src={blueFaceImg} className="mr-4 h-20 w-20" />
        <Typography
          type="h1"
          color="textDark"
          text={`Looking ahead, ${childFirstName} will build these skills`}
          className="pt-5"
        />
        <div
          className={`bg-quatenary mt-3 ml-auto mt-6 flex flex-shrink-0 flex-row items-center justify-between rounded-full px-3 py-1`}
          style={{ height: 'fit-content', width: 'fit-content' }}
        >
          <Typography
            type="small"
            weight="bold"
            color="white"
            text={`${format(reportingPeriodEndDate, 'MMM yyy')}`}
            lineHeight={4}
            className="pb-3 text-center"
          />
        </div>
      </div>
      <Divider dividerType="dashed" className="mb-4" />
      {skillsByCategory
        .filter((x) => x.skills.some((y) => y.isNegative))
        .map((category) => (
          <div
            key={category.id}
            className="bg-infoBb mt-6 mb-4 flex flex-col rounded-sm rounded-2xl border-2 p-4 pb-6  shadow-sm"
            style={{
              borderColor: category.color,
              // backgroundColor: getCategoryBg(category.name),
            }}
          >
            <div className="flex flex-row">
              <img src={category.imageUrl} className="mr-4 h-14 w-14" />
              <Typography
                type="h3"
                color="textDark"
                text={category.name}
                className="mb-2"
              />
            </div>
            {category.skills
              .filter((x) => x.isNegative)
              .map((skill) => (
                <p
                  key={skill.skillId}
                  className="font-body text-textDark"
                  style={{ fontSize: '12px' }}
                >
                  <span>&#8226;</span> {skill.skillDescription}
                </p>
              ))}
          </div>
        ))}
      <p
        className="font-body text-textDark mt-auto ml-auto"
        style={{ fontSize: '12px', fontWeight: 'bold' }}
      >
        {`Page ${pageNumber} of ${totalPages}`}
      </p>
    </div>
  );
};
