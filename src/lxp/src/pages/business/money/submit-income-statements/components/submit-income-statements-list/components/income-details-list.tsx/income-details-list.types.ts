import { IncomeStatementsDto } from '@/../../../packages/core/lib';

export interface IncomeDetailsListProps {
  hideDetails?: () => void;
  statementTitle: string;
  incomeStatements?: IncomeStatementsDto[];
}
