export interface WeightOrHeightForAge {
  label: string;
  weight?: number[];
  height?: number[];
}

export interface xAxisData {
  y: any;
  x: number;
  name?: string;
}

export interface WeightOrHeightForAgeProps {
  date: number[];
  SD3: WeightOrHeightForAge;
  SD2: WeightOrHeightForAge;
  median: WeightOrHeightForAge;
  SD3neg: WeightOrHeightForAge;
  SD2neg: WeightOrHeightForAge;
}

export type DataSetType = keyof WeightOrHeightForAgeProps;
