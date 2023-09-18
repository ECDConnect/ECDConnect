-- SCRIPT TO MIGRATE ON IincomeStatmentId to StatemetsIncomeStatementId for income and expense records
-- NOTE: this ignores any rows where the statement is missing

UPDATE "StatementsIncome" 
SET "StatementsIncomeStatementId" = "IncomeStatementId"::uuid
where "IncomeStatementId"::uuid in (select "Id" from "StatementsIncomeStatement" sis);


UPDATE "StatementsExpenses" 
SET "StatementsIncomeStatementId" = "IncomeStatementId"::uuid
where "IncomeStatementId"::uuid in (select "Id" from "StatementsIncomeStatement" sis);