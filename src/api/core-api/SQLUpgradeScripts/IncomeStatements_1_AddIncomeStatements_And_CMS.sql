-- "StatementsContributionType" definition

-- Drop table

-- DROP TABLE "StatementsContributionType";

CREATE TABLE "StatementsContributionType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Description" text NULL,
	"TenantId" uuid NULL,
	"Notes" varchar NULL,
	CONSTRAINT "PK_StatementsContributionType" PRIMARY KEY ("Id")
);


-- "StatementsExpenseType" definition

-- Drop table

-- DROP TABLE "StatementsExpenseType";

CREATE TABLE "StatementsExpenseType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Description" text NULL,
	"TenantId" uuid NULL,
	"Notes" text NULL,
	CONSTRAINT "PK_StatementsExpenseType" PRIMARY KEY ("Id")
);


-- "StatementsExpenses" definition

-- Drop table

-- DROP TABLE "StatementsExpenses";

CREATE TABLE "StatementsExpenses" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"Submitted" bool NOT NULL,
	"DatePaid" timestamp NOT NULL,
	"Notes" text NULL,
	"Description" text NULL,
	"Amount" float8 NOT NULL,
	"PhotoProof" text NULL,
	"TenantId" uuid NULL,
	"IncomeStatementId" text NULL,
	"ExpenseTypeId" text NULL,
	CONSTRAINT "PK_StatementsExpenses" PRIMARY KEY ("Id")
);


-- "StatementsFeeType" definition

-- Drop table

-- DROP TABLE "StatementsFeeType";

CREATE TABLE "StatementsFeeType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Description" text NULL,
	"TenantId" uuid NULL,
	"Notes" varchar NULL,
	CONSTRAINT "PK_StatementsFeeType" PRIMARY KEY ("Id")
);


-- "StatementsIncome" definition

-- Drop table

-- DROP TABLE "StatementsIncome";

CREATE TABLE "StatementsIncome" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"ChildUserId" text NULL,
	"Submitted" bool NOT NULL,
	"DateReceived" timestamp NOT NULL,
	"Notes" text NULL,
	"Description" text NULL,
	"Amount" float8 NOT NULL,
	"ChildCoverAmount" float8 NOT NULL,
	"PhotoProof" text NULL,
	"TenantId" uuid NULL,
	"AmountExpected" float8 NULL,
	"IncomeStatementId" text NULL,
	"PayTypeId" text NULL,
	"ContributionTypeId" text NULL,
	"IncomeTypeId" text NULL,
	"FeeTypeId" text NULL,
	CONSTRAINT "PK_StatementsIncome" PRIMARY KEY ("Id")
);


-- "StatementsIncomeStatement" definition

-- Drop table

-- DROP TABLE "StatementsIncomeStatement";

CREATE TABLE "StatementsIncomeStatement" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"TenantId" uuid NULL,
	"Submitted" bool NOT NULL DEFAULT false,
	"Month" int4 NULL,
	"Year" int4 NULL,
	"Period" text NULL,
	"IncomeTotal" float8 NOT NULL,
	"ExpenseTotal" float8 NOT NULL,
	"Balance" float8 NOT NULL,
	"SubmittedDate" timestamp NULL,
	"Notes" text NULL,
	"AnnualSubmittedDate" timestamp NULL,
	"AutoSubmitted" bool NOT NULL DEFAULT false,
	CONSTRAINT "PK_StatementsIncomeStatement" PRIMARY KEY ("Id")
);


-- "StatementsIncomeType" definition

-- Drop table

-- DROP TABLE "StatementsIncomeType";

CREATE TABLE "StatementsIncomeType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Description" text NULL,
	"TenantId" uuid NULL,
	"Notes" varchar NULL,
	CONSTRAINT "PK_StatementsIncomeType" PRIMARY KEY ("Id")
);


-- "StatementsPayType" definition

-- Drop table

-- DROP TABLE "StatementsPayType";

CREATE TABLE "StatementsPayType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"Description" text NULL,
	"TenantId" uuid NULL,
	"Notes" varchar NULL,
	CONSTRAINT "PK_StatementsPayType" PRIMARY KEY ("Id")
);


-- "StatementsStartupSupport" definition

-- Drop table

-- DROP TABLE "StatementsStartupSupport";

CREATE TABLE "StatementsStartupSupport" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"Notes" text NULL,
	"Description" text NULL,
	"StartDate" timestamp NOT NULL,
	"EndDate" timestamp NOT NULL,
	"TenantId" uuid NULL,
	"Amount" float8 NOT NULL,
	"ProgrammeId" uuid NULL,
	"ChildUserId" text NULL,
	CONSTRAINT "PK_StatementsStartupSupport" PRIMARY KEY ("Id")
);


--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.IncomeStatementSubmitEnd','General.IncomeStatementSubmitEnd','IncomeStatementSubmitEnd','8',true,true,'2022-03-07 07:39:37.330','0001-01-01 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
--INSERT INTO "SystemSetting" ("Id","Grouping","FullPath","Name","Value","IsSystemValue","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId") VALUES
--	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),'General.IncomeStatementSubmitStart','General.IncomeStatementSubmitStart','IncomeStatementSubmitStart','25',true,true,'2022-03-07 07:39:37.330','0001-01-01 00:00:00.000',NULL,'258a15e6-3736-45ea-875c-48d9377de4c8');
