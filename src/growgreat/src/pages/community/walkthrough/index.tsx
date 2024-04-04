import { TeamTab } from '../team-tab';
import { LeagueTab } from '../league-tab';
import { TeamPoints } from '../team-tab/team/points';
import { BreastfeedingClubsTab } from '../breastfeeding-clubs-tab';
import { COMMUNITY_WALKTHROUGH_STEPS } from './steps';

export const CommunityWalkthrough: React.FC<{
  walkthroughStepIndex: number;
}> = ({ walkthroughStepIndex }) => {
  return (
    <>
      {[
        COMMUNITY_WALKTHROUGH_STEPS.ONE,
        COMMUNITY_WALKTHROUGH_STEPS.THREE,
        COMMUNITY_WALKTHROUGH_STEPS.THREE,
        COMMUNITY_WALKTHROUGH_STEPS.FIVE,
        COMMUNITY_WALKTHROUGH_STEPS.SIX,
      ].includes(walkthroughStepIndex) && <TeamTab />}
      {walkthroughStepIndex === COMMUNITY_WALKTHROUGH_STEPS.TWO && (
        <LeagueTab />
      )}
      {walkthroughStepIndex === COMMUNITY_WALKTHROUGH_STEPS.FOUR && (
        <TeamPoints />
      )}
      {walkthroughStepIndex === COMMUNITY_WALKTHROUGH_STEPS.EIGHT && (
        <BreastfeedingClubsTab />
      )}
    </>
  );
};
