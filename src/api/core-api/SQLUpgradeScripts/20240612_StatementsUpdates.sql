
ALTER TABLE public."StatementsIncomeStatement" DROP column "AutoSubmitted";
ALTER TABLE public."StatementsIncomeStatement" DROP column "AnnualSubmittedDate";
ALTER TABLE public."StatementsIncomeStatement" DROP column "Period";
ALTER TABLE public."StatementsIncomeStatement" DROP column "IncomeTotal";
ALTER TABLE public."StatementsIncomeStatement" DROP column "ExpenseTotal";
ALTER TABLE public."StatementsIncomeStatement" DROP column "Balance";
ALTER TABLE public."StatementsIncomeStatement" DROP column "SubmittedDate";
ALTER TABLE public."StatementsIncomeStatement" DROP column "RelatedDocumentId";



ALTER TABLE public."StatementsIncome" DROP column "UserId";
ALTER TABLE public."StatementsIncome" DROP column "Submitted";
ALTER TABLE public."StatementsIncome" DROP column "AmountExpected";
ALTER TABLE public."StatementsIncome" DROP column "ContributionTypeId";
ALTER TABLE public."StatementsIncome" DROP column "FeeTypeId";
ALTER TABLE public."StatementsIncome" DROP column "IncomeStatementId";
ALTER TABLE public."StatementsIncome" DROP column "ChildCoverAmount";



ALTER TABLE public."StatementsExpenses" DROP column "UserId";
ALTER TABLE public."StatementsExpenses" DROP column "Submitted";
ALTER TABLE public."StatementsExpenses" DROP column "Description";
ALTER TABLE public."StatementsExpenses" DROP column "IncomeStatementId";



alter table public."StatementsIncomeStatement" add "Downloaded" boolean not null default false;
alter table public."StatementsIncome" add "NumberOfChildrenCovered" numeric null;