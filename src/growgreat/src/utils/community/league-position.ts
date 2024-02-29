import { LeagueType, Tier } from '@/constants/Community';
import { Colours } from '@ecdlink/ui';

interface TierPercentages {
  bronzePercentage: number;
  silverPercentage: number;
  goldPercentage: number;
}

export function getTierDetails(
  teamType: LeagueType,
  points: number
): { tierName: Tier; tierColor: Colours } {
  const bronzeColour: Colours = 'alertDark';
  const silverColour: Colours = 'textLight';
  const goldColour: Colours = 'tertiary';

  if (teamType === LeagueType.SuperLeague) {
    if (points < 5000) {
      return { tierName: Tier.Bronze, tierColor: bronzeColour };
    } else if (points >= 5000 && points <= 8000) {
      return { tierName: Tier.Silver, tierColor: silverColour };
    } else {
      return { tierName: Tier.Gold, tierColor: goldColour };
    }
  } else {
    if (points < 1000) {
      return { tierName: Tier.Bronze, tierColor: bronzeColour };
    } else if (points >= 1000 && points <= 3000) {
      return { tierName: Tier.Silver, tierColor: silverColour };
    } else {
      return { tierName: Tier.Gold, tierColor: goldColour };
    }
  }
}

export function calculateTierPercentages(
  leagueType: LeagueType
): TierPercentages {
  const maxPoints = leagueType === LeagueType.SuperLeague ? 10000 : 5000;
  const totalPercentage = 100;

  let bronzePercentage = 0;
  let silverPercentage = 0;
  let goldPercentage = 0;

  if (leagueType === LeagueType.SuperLeague) {
    bronzePercentage = (5000 / maxPoints) * totalPercentage;
    silverPercentage = ((8000 - 5000) / maxPoints) * totalPercentage;
    goldPercentage = ((maxPoints - 8000) / maxPoints) * totalPercentage;
  } else {
    bronzePercentage = (1000 / maxPoints) * totalPercentage;
    silverPercentage = ((3000 - 1000) / maxPoints) * totalPercentage;
    goldPercentage = ((maxPoints - 3000) / maxPoints) * totalPercentage;
  }

  return {
    bronzePercentage,
    silverPercentage,
    goldPercentage,
  };
}
