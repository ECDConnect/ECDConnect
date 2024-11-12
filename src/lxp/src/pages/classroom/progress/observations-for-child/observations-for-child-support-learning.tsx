import { Alert, Card, FormInput, Typography } from '@ecdlink/ui';
import { ChildDto, ProgressTrackingAgeGroupDto } from '@ecdlink/core';
import { ChildProgressDetailedSkillToWorkOn } from '@/models/progress/child-progress-report';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { differenceInMonths } from 'date-fns';
import { useProgressWalkthrough } from '@/hooks/useProgressWalkthrough';

export type ObservationsForChildSupportLearningProps = {
  child: ChildDto;
  howToSupport?: string;
  skillsToWorkOn: ChildProgressDetailedSkillToWorkOn[];
  currentAgeGroup: ProgressTrackingAgeGroupDto;
  updateSkillToWorkOn: (skillId: number, value: string) => void;
  updateHowToSupport: (value: string) => void;
};

export const ObservationsForChildSupportLearning: React.FC<
  ObservationsForChildSupportLearningProps
> = ({
  child,
  howToSupport,
  skillsToWorkOn,
  currentAgeGroup,
  updateSkillToWorkOn,
  updateHowToSupport: updateHowToSupportGeneral,
}) => {
  const { ageGroup } = useProgressWalkthrough();

  const ageGroupCurrent = currentAgeGroup || ageGroup;
  const ageInMonths =
    !!child.user && !!child.user.dateOfBirth
      ? differenceInMonths(new Date(), new Date(child.user!.dateOfBirth!))
      : 0;

  return (
    <>
      <Typography
        type="h2"
        color="textDark"
        className="mb-4"
        text={`Supporting ${child.user?.firstName}'s learning`}
      />
      <Alert
        type={'info'}
        messageColor="textDark"
        title={`Your answers will be added to ${child.user?.firstName}'s caregiver report.`}
      />
      {!skillsToWorkOn.length && (
        <>
          <Card className="bg-successMain my-4 rounded-2xl p-4">
            <div className="flex flex-row">
              <EmojiYellowSmile className="mr-4 h-16 w-16" />
              <div className="flex flex-col">
                <Typography
                  type="h3"
                  weight="bold"
                  color="white"
                  text={`Wonderful! ${child.user?.firstName} is ${ageInMonths} months old and can do everything in the ${ageGroupCurrent.description} progress tracker!`}
                />
                <Typography
                  className="mt-2"
                  type="h3"
                  weight="bold"
                  color="white"
                  text={`Keep observing ${child.user?.firstName} and support their learning.`}
                />
              </div>
            </div>
          </Card>
          <FormInput
            label={`What are some of the activities you will do with ${child.user?.firstName} to support their development?`}
            textInputType="textarea"
            placeholder={
              'E.g. Group to share ball, take turns to kick ball, score goals, catch, throw'
            }
            className="mt-2"
            onChange={(event) => updateHowToSupportGeneral(event.target.value)}
            value={howToSupport}
          />
        </>
      )}
      {!!skillsToWorkOn.length && (
        <div className="mb-4">
          {skillsToWorkOn.map((skill) => (
            <div key={skill.skillId}>
              <Typography
                type="h4"
                color="textDark"
                className="mt-4"
                text={`What will you do to support ${child.user?.firstName} in developing this skill:`}
              />
              <Typography
                type="small"
                color="textMid"
                className="mt-1"
                text={skill.skillName}
              />
              <FormInput
                textInputType="textarea"
                placeholder={
                  'E.g. Group to share ball, take turns to kick ball, score goals, catch, throw'
                }
                className="mt-2"
                onChange={(event) =>
                  updateSkillToWorkOn(skill.skillId, event.target.value)
                }
                value={skill.howToSupport}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
