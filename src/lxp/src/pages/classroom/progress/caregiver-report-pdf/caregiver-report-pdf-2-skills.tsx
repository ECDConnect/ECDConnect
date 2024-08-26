import { Divider, Typography } from '@ecdlink/ui';
import { format } from 'date-fns';
import { ChildProgressDetailedSkillObservation } from '@/models/progress/child-progress-report';
import { ProgressTrackingCategoryDto } from '@ecdlink/core';
import greenFaceImg from '@/assets/progress-reports/green-face.png';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';

export type ProgressCaregiverReportSkillsPageProps = {
  childFirstName: string;
  skillsByCategory: (ProgressTrackingCategoryDto & {
    skills: ChildProgressDetailedSkillObservation[];
  })[];
  reportingPeriodEndDate: Date;
  pageNumber: number;
  totalPages: number;
};

export const ProgressCaregiverReportSkillsPage: React.FC<
  ProgressCaregiverReportSkillsPageProps
> = ({
  childFirstName,
  skillsByCategory,
  pageNumber,
  totalPages,
  reportingPeriodEndDate,
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
      style={{ height: '1400px' }}
    >
      <div className="mb-4 flex flex-row">
        <img src={greenFaceImg} className="mr-4 h-20 w-20" />
        <Typography
          type="h1"
          color="textDark"
          text={`${childFirstName} is doing well in these areas`}
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

      {skillsByCategory.map((category) => (
        <div
          className="mt-6 mb-4 flex flex-col rounded-sm rounded-2xl border-2 p-4 pb-6 shadow-sm"
          style={{
            borderColor: category.color,
            backgroundColor: getCategoryBg(category.name),
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
          {category.skills.every((x) => !x.isPositive) && (
            <Typography
              type="body"
              color="textDark"
              text={`${childFirstName} is still working on doing things in this area!`}
            />
          )}
          {category.skills
            .filter((x) => x.isPositive)
            .map((skill) => (
              <p className="font-body text-textDark">
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
