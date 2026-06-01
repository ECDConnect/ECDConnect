CREATE TABLE IF NOT EXISTS public."UserCertificate" (
	"Id" uuid NOT NULL,
	"IsActive" bool DEFAULT true NULL,
	"InsertedDate" timestamp NULL,
	"UpdatedDate" timestamp NULL,
    "UpdatedBy" text null,
	"UserId" uuid NULL,
	"VisitId" uuid NULL,
	"UserTrainingCourseId" uuid NULL,
	"TenantId" uuid NOT NULL,
	"CertificateName" text NULL,
	CONSTRAINT "PK_UserCertificate" PRIMARY KEY ("Id"),
	CONSTRAINT "FK_UserCertificate_Visit_VisitId" FOREIGN KEY ("VisitId") REFERENCES public."Visit"("Id") ON DELETE SET NULL,
	CONSTRAINT "FK_UserCertificate_UserTrainingCourse_UserTrainingCourseId" FOREIGN KEY ("UserTrainingCourseId") REFERENCES public."UserTrainingCourse"("Id") ON DELETE SET NULL,
	CONSTRAINT "FK_UserCertificate_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT
);

-- Add columns if the table was created by an earlier version of this script
ALTER TABLE public."UserCertificate" ADD COLUMN IF NOT EXISTS "UserTrainingCourseId" uuid NULL;
ALTER TABLE public."UserCertificate" ADD COLUMN IF NOT EXISTS "UserId" uuid NULL;

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

-- Migrate data from Visit only if those columns still exist (i.e. the old VisitCertificate script has not yet run)
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Visit' AND column_name = 'CertificateName'
    ) THEN
        INSERT INTO public."UserCertificate"
            ("Id", "InsertedDate", "VisitId", "TenantId", "CertificateName")
        SELECT
            gen_random_uuid(),
            v."CertificateCreated" AS "InsertedDate",
            v."Id",
            v."TenantId",
            v."CertificateName"
        FROM "Visit" v
        WHERE v."CertificateName" IS NOT NULL;

        ALTER TABLE public."Visit" DROP COLUMN IF EXISTS "CertificateCreated";
        ALTER TABLE public."Visit" DROP COLUMN IF EXISTS "CertificateName";
    END IF;
END $$;
