import { LeagueType, Tier } from '@/constants/Community';
import { LeagueClinicPointsDto } from '@ecdlink/core';
import { Colours } from '@ecdlink/ui';

interface TierPercentages {
  bronzePercentage: number;
  silverPercentage: number;
  goldPercentage: number;
}

export function getTierDetails(
  teamType: LeagueType,
  points: number
): {
  tierName: Tier;
  tierColor: Colours;
  pointsToNextTier: number;
  nextTier?: 'Silver' | 'Gold';
} {
  const bronzeColour: Colours = 'alertDark';
  const silverColour: Colours = 'textLight';
  const goldColour: Colours = 'tertiary';

  if (teamType === LeagueType.SuperLeague) {
    if (points < 5000) {
      return {
        tierName: Tier.Bronze,
        tierColor: bronzeColour,
        pointsToNextTier: 5000 - points,
        nextTier: 'Silver',
      };
    } else if (points >= 5000 && points <= 8000) {
      return {
        tierName: Tier.Silver,
        tierColor: silverColour,
        pointsToNextTier: 8000 - points,
        nextTier: 'Gold',
      };
    } else {
      return {
        tierName: Tier.Gold,
        tierColor: goldColour,
        pointsToNextTier: 0,
      };
    }
  } else {
    if (points < 1000) {
      return {
        tierName: Tier.Bronze,
        tierColor: bronzeColour,
        pointsToNextTier: 1000 - points,
        nextTier: 'Silver',
      };
    } else if (points >= 1000 && points <= 3000) {
      return {
        tierName: Tier.Silver,
        tierColor: silverColour,
        pointsToNextTier: 3000 - points,
        nextTier: 'Gold',
      };
    } else {
      return {
        tierName: Tier.Gold,
        tierColor: goldColour,
        pointsToNextTier: 0,
      };
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

export function getLeaguePointsColours(
  isTop25PercentInTheLeague: boolean,
  isMiddle50PercentInTheLeague: boolean
): { mainColour: Colours; backgroundColour: Colours } {
  let mainColour: Colours = 'alertMain';
  let backgroundColour: Colours = 'alertBg';

  if (isMiddle50PercentInTheLeague) {
    mainColour = 'secondary';
    backgroundColour = 'secondaryAccent2';
  }

  if (isTop25PercentInTheLeague) {
    mainColour = 'successMain';
    backgroundColour = 'successBg';
  }

  return { mainColour, backgroundColour };
}

export function calculateClinicLeaguePositionPercentiles(
  clinics: LeagueClinicPointsDto[],
  selectedClinicRanking: number
) {
  const totalClinics = clinics?.length;

  const position = selectedClinicRanking || 0;

  const top25Percentile = Math.ceil(0.25 * totalClinics);
  const top50Percentile = Math.ceil(0.5 * totalClinics);

  const isTop25PercentInTheLeague = position > 0 && position <= top25Percentile;
  const isMiddle50PercentInTheLeague =
    position > 0 && position <= top50Percentile;

  return {
    isTop25PercentInTheLeague,
    isMiddle50PercentInTheLeague,
  };
}
