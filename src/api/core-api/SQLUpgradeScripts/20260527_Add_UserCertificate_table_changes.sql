CREATE TABLE IF NOT EXISTS public."UserCertificate" (
	"Id" uuid NOT NULL,
	"IsActive" bool DEFAULT true NULL,
	"InsertedDate" timestamp NULL,
	"UpdatedDate" timestamp NULL,
    "UpdatedBy" text null,
	"UserId" uuid NOT NULL,
	"VisitId" uuid NULL,
	"UserTrainingCourseId" uuid NULL,
	"TenantId" uuid NOT NULL,
	"CertificateName" text NOT NULL,
    "CertificateRegNr" text NOT NULL,
	CONSTRAINT "PK_UserCertificate" PRIMARY KEY ("Id"),
	CONSTRAINT "FK_UserCertificate_Visit_VisitId" FOREIGN KEY ("VisitId") REFERENCES public."Visit"("Id") ON DELETE SET NULL,
	CONSTRAINT "FK_UserCertificate_UserTrainingCourse_UserTrainingCourseId" FOREIGN KEY ("UserTrainingCourseId") REFERENCES public."UserTrainingCourse"("Id") ON DELETE SET NULL,
	CONSTRAINT "FK_UserCertificate_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT
);


-- Add FK constraints if missing
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FK_UserCertificate_UserTrainingCourse_UserTrainingCourseId'
    ) THEN
        ALTER TABLE public."UserCertificate"
            ADD CONSTRAINT "FK_UserCertificate_UserTrainingCourse_UserTrainingCourseId"
            FOREIGN KEY ("UserTrainingCourseId") REFERENCES public."UserTrainingCourse"("Id") ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'FK_UserCertificate_AspNetUsers_UserId'
    ) THEN
        ALTER TABLE public."UserCertificate"
            ADD CONSTRAINT "FK_UserCertificate_AspNetUsers_UserId"
            FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;
    END IF;
END $$;
