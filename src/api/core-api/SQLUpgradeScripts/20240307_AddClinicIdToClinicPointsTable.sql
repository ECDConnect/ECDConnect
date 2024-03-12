
ALTER TABLE public."PointsClinicSummary" ADD "ClinicId" uuid NOT NULL;
ALTER TABLE public."PointsClinicSummary" ADD CONSTRAINT "FK_PointsClinicSummary_ClinicId" FOREIGN KEY ("ClinicId") REFERENCES "Clinic"("Id");

ALTER TABLE public."BreastFeedingClub" ADD "ClinicId" uuid NOT NULL;
ALTER TABLE public."BreastFeedingClub" ADD CONSTRAINT "FK_BreastFeedingClub_ClinicId" FOREIGN KEY ("ClinicId") REFERENCES "Clinic"("Id");