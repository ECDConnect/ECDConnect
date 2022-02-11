import { ProgrammeDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export type SummaryVariation = 'create' | 'update' | 'view';

export interface ProgrammeSummaryRouteState {
  programmeId: string;
  variation: SummaryVariation;
}

export interface ProgrammeSummaryProps extends ComponentBaseProps {
  programme?: ProgrammeDto;
  noPlan?: boolean;
  variation: SummaryVariation;
}
