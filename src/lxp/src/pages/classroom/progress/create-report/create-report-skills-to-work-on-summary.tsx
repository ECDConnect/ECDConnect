import { Card, Typography } from '@ecdlink/ui';
import { ChildProgressDetailedSkillToWorkOn } from '@/models/progress/child-progress-report';

export type ProgressCreateReportSkillsToWorkOnSummaryProps = {
  childFirstname: string;
  skillsToWorkOn: ChildProgressDetailedSkillToWorkOn[];
};

export const ProgressCreateReportSkillsToWorkOnSummary: React.FC<
  ProgressCreateReportSkillsToWorkOnSummaryProps
> = ({ childFirstname, skillsToWorkOn }) => {
  return (
    <>
      <Typography
        type="h2"
        color="textDark"
        text={`You plans for supporting ${childFirstname}`}
        className="mb-2"
      />
      {skillsToWorkOn.map((skill) => (
        <Card
          key={skill?.skillId}
          className="border-primary my-2 flex flex-col gap-1 rounded-2xl border p-4"
        >
          <Typography type="small" color="textMid" text={'Skill:'} />
          <Typography type="body" color="textDark" text={skill.skillName} />
          <Typography type="small" color="textMid" text={'Todo:'} />
          <Typography type="body" color="textDark" text={skill.howToSupport} />
        </Card>
      ))}
    </>
  );
};
