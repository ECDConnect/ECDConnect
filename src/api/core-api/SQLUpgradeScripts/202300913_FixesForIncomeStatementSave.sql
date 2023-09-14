alter table "StatementsIncome" add column "StatementsIncomeStatementId" uuid DEFAULT null;
alter table "StatementsIncome" add constraint "PK_StatementsIncome_StatementsIncomeStatementId" FOREIGN KEY ("StatementsIncomeStatementId") REFERENCES "StatementsIncomeStatement"("Id") ON DELETE RESTRICT;

alter table "StatementsExpenses" add column "StatementsIncomeStatementId" uuid DEFAULT null;
alter table "StatementsExpenses" add constraint "PK_StatementsExpenses_StatementsIncomeStatementId" FOREIGN KEY ("StatementsIncomeStatementId") REFERENCES "StatementsIncomeStatement"("Id") ON DELETE RESTRICT;
