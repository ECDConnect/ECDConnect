CREATE TABLE public."VisitCertificate" (
	"Id" uuid NOT NULL,
	"IsActive" bool DEFAULT true NULL,
	"InsertedDate" timestamp NULL,
	"UpdatedDate" timestamp NULL,
    "UpdatedBy" text null,
	"VisitId" uuid NOT NULL,
	"TenantId" uuid NOT NULL,	
	"CertificateName" text NULL,
	CONSTRAINT "PK_VisitCertificate" PRIMARY KEY ("Id"),
	CONSTRAINT "FK_VisitCertificate_Visit_VisitId" FOREIGN KEY ("VisitId") REFERENCES public."Visit"("Id") ON DELETE SET NULL
);

INSERT INTO public."VisitCertificate"
    ("Id", "InsertedDate", "VisitId", "TenantId", "CertificateName")
SELECT 
    gen_random_uuid(),
    v."CertificateCreated" AS "InsertedDate",
    v."Id",
    v."TenantId",
    v."CertificateName"
FROM "Visit" v
WHERE v."CertificateName" IS NOT NULL;

drop column "CertificateName" from public."Visit";
drop column "CertificateCreated" from public."Visit";