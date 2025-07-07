import { Alert, CheckboxGroup, Typography } from '@ecdlink/ui';
import { ChildDto } from '@ecdlink/core';
import {
  ChildProgressDetailedSkillObservation,
  ChildProgressSkillToWorkOn,
} from '@/models/progress/child-progress-report';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';

export type ObservationsForChildSkillsToWorkOnProps = {
  child: ChildDto;
  negativeSkills: ChildProgressDetailedSkillObservation[];
  addSkillToWorkOn: (skillId: number) => void;
  removeSkillToWorkOn: (skillId: number) => void;
  doNotKnowPercentage: number;
  doNotKnowCount: number;
  skillsToChoose: number;
  skillsToWorkOn: ChildProgressSkillToWorkOn[];
};

export const ObservationsForChildSkillsToWorkOn: React.FC<
  ObservationsForChildSkillsToWorkOnProps
> = ({
  child,
  negativeSkills,
  skillsToChoose,
  doNotKnowPercentage,
  doNotKnowCount,
  skillsToWorkOn,
  addSkillToWorkOn,
  removeSkillToWorkOn,
}) => {
  return (
    <>
      {doNotKnowPercentage >= 25 && (
        <>
          <Typography
            type="h2"
            color="textDark"
            className="mb-4"
            text={`Spend more time observing ${child.user?.firstName}`}
          />
          <Alert
            className="mb-4"
            type={'warning'}
            messageColor="textDark"
            title={`You chose "Don't know" for ${doNotKnowCount} skills.`}
            list={[
              `Spend more time watching ${child.user?.firstName} so that you can share more information about them.`,
              `Tap "Save & exit" below. You can return to complete the report when you're ready.`,
            ]}
          />
        </>
      )}
      {!negativeSkills.length && doNotKnowPercentage < 25 && (
        <>
          <Typography
            type="h2"
            color="textDark"
            className="mb-4"
            text={`${child.user?.firstName} can do everything in this assessment`}
          />
          <div className="mt-2 flex flex-col justify-center p-8">
            <div className="mt-6 flex w-full justify-center">
              <EmojiYellowSmile className="h-40 w-40" />
            </div>
            <div>
              <Typography
                className="mt-4 text-center"
                color="textDark"
                text={`${child.user?.firstName} is developing well!`}
                type={'h2'}
              />
            </div>
            <div>
              <Typography
                className="mt-6 text-center"
                color="textMid"
                text={`Keep observing ${child.user?.firstName}.`}
                type={'body'}
              />
            </div>
          </div>
        </>
      )}
      {!!negativeSkills.length && doNotKnowPercentage < 25 && (
        <>
          <Typography
            type="h2"
            color="textDark"
            className="mb-4"
            text={`Choose ${skillsToChoose} skills to work on with ${child.user?.firstName}`}
          />
          <Typography
            type="h4"
            color="textMid"
            className="mb-4"
            text={`These should be things that ${child.user?.firstName} is trying to do but needs support with.`}
          />
          {negativeSkills.map((skill) => {
            const selected = skillsToWorkOn.some(
              (x) => x.skillId === skill.skillId
            );
            return (
              <CheckboxGroup
                id={`${skill.skillId}`}
                key={`${skill.skillId}`}
                title={skill.skillName}
                checked={selected}
                value={skill.skillId}
                onChange={() => {
                  if (selected) {
                    removeSkillToWorkOn(skill.skillId);
                  }

                  if (!selected && skillsToWorkOn.length < 4) {
                    addSkillToWorkOn(skill.skillId);
                  }
                }}
                className="mb-1"
                checkboxColor="primary"
              />
            );
          })}
        </>
      )}
    </>
  );
};
