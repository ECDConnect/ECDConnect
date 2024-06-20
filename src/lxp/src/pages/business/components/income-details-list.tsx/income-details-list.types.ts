import { IncomeItemMinDto } from '@/../../../packages/core/lib';

export interface IncomeDetailsListProps {
  hideDetails?: () => void;
  statementTitle: string;
  incomeItems: IncomeItemMinDto[];
  statementMonth: number;
  statementId: string;
}
