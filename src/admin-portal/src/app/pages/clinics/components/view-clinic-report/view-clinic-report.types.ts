export interface TierPercentages {
  bronzePercentage: number;
  silverPercentage: number;
  goldPercentage: number;
}

export enum LeagueType {
  League = 'League',
  SuperLeague = 'Super League',
}

export enum Tier {
  Bronze = 'Bronze',
  Silver = 'Silver',
  Gold = 'Gold',
}

export interface ViewClinicReportProps {
  // TODO: replace any with the real type
  clinic?: any;
}
