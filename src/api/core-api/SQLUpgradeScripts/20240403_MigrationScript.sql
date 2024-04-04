
-- TEAM LEAD TO CLINIC
INSERT INTO public."ClinicTeamLead"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "ClinicId", "TeamLeadId", "TenantId", "WelcomeMessage")
select uuid_generate_v4(), true, CURRENT_DATE, CURRENT_DATE, '', "ClinicId", "Id", "TenantId", ''
from "TeamLead" tl 


-- UPDATE CHWs
UPDATE public."HealthCareWorker" AS hcw
SET "ClinicId" = tl."ClinicId"
FROM "TeamLead" AS tl
WHERE hcw."TeamLeadId"=tl."Id";


-- NOW REMOVE OLD COLUMNS
ALTER TABLE public."TeamLead" DROP column "ClinicId";
ALTER TABLE public."HealthCareWorker" DROP column "TeamLeadId";