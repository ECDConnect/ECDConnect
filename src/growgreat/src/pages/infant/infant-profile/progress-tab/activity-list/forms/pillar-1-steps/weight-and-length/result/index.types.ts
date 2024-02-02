import { VisitData } from '@ecdlink/graphql';

export interface GrowthStatus {
  length: VisitData[];
  weight: VisitData[];
}

export interface xAxisData {
  y: any;
  x: number;
  name?: string;
  date: Date;
}
