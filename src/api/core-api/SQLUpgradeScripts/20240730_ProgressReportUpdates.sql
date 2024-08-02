delete from public."ChildProgressReport";

ALTER TABLE public."ChildProgressReport" DROP column "IntegrationSubmitDate";
ALTER TABLE public."ChildProgressReport" DROP column "Hierarchy";
ALTER TABLE public."ChildProgressReport" DROP column "ReportDate";

ALTER TABLE public."ChildProgressReport" ADD "ChildProgressReportPeriodId" uuid NOT NULL;
ALTER TABLE "ChildProgressReport" ADD CONSTRAINT "FK_ChildProgressReport_ChildProgressReportPeriod" FOREIGN KEY ("ChildProgressReportPeriodId") REFERENCES "ChildProgressReportPeriod"("Id") ON DELETE RESTRICT;