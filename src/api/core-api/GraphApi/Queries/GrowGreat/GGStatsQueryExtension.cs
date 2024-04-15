using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class GGStatsQueryExtension
    {
        public async Task<FileModel> DownloadGGStatsFile(
          [Service] IFileGenerationService fileService,
          [Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory)
        {
            var sheet1Name = $"CHW";
            var sheet2Name = $"Mothers";
            var sheet3Name = $"Children";
            var sheet4Name = $"Antenatal Visits";
            var sheet5Name = $"Post-natal Visits";
            var sheet6Name = $"Antenatal Visit Data";
            var sheet7Name = $"Antenatal Visit Data Alerts";
            var sheet8Name = $"Post-natal Visit Data";
            var sheet9Name = $"Post-natal Visit Data Alerts";
           
            var sheet1HeaderData = new List<List<string>>
            {
                new List<string>{"First Name","Surname","ID Number","Cellphone Number","Registered"}
            };

            var sheet2HeaderData = new List<List<string>>
            {
                new List<string>{"Mother First Name","Mother Surname","Expected Date of Delivery","Age","HCW First Name","HCW Surname"}
            };
            var sheet3HeaderData = new List<List<string>>
            {
                new List<string>{"Child Name","Date Of Birth","Weight At Birth","Length At Birth","Gender","Caregiver First Name","Caregiver Surname","HCW First Name","HCW Surname"}
            };
            var sheet4HeaderData = new List<List<string>>
            {
                new List<string>{"Mother First Name","Mother Surname","Description","Start Date","End Date","Completed"}
            };
            var sheet5HeaderData = new List<List<string>>
            {
                new List<string>{ "Child Name", "Visit Name","Start Date","End Date","Completed"}
            };
            var sheet6HeaderData = new List<List<string>>
            {
                new List<string>{"Mother First Name","Mother Surname","Visit Name","Visit Section","Question","Answer"}
            };
            var sheet7HeaderData = new List<List<string>>
            {
                new List<string>{"Mother First Name","Mother Surname","Visit Name","Visit Section","Comment","Color","Type"}
            };
            var sheet8HeaderData = new List<List<string>>
            {
                new List<string>{ "Child Name","Visit Name","Visit Section", "Question", "Answer", "Type"}
            };
            var sheet9HeaderData = new List<List<string>>
            {
                new List<string>{ "Child Name","Visit Name","Visit Section", "Comment", "Color", "Type"}
            };

            var templateHeaderSheet = $"Kliptown-Reg-G&Tladi-Local-Reg-D&Protea-Glen-Reg-D_Stats_" + DateTime.Now.Date.ToString("dd_MMM_yyyy");

            //var clinicNames = clinicRepo.GetAll().Where(c => c.TenantId == TenantExecutionContext.Tenant.Id).Select(c => new List<string> { c.Name, c.Id.ToString(), "" }).ToList();

            var fileName = templateHeaderSheet.Replace(" ", "_");
            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { sheet1Name, sheet1HeaderData },
                { sheet2Name, sheet2HeaderData },
                { sheet3Name, sheet3HeaderData },
                { sheet4Name, sheet4HeaderData },
                { sheet5Name, sheet5HeaderData },
                { sheet6Name, sheet6HeaderData },
                { sheet7Name, sheet7HeaderData },
                { sheet8Name, sheet8HeaderData },
                { sheet9Name, sheet9HeaderData },
            };

            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

        private List<HealthCareWorker> GetHealthCareWorkers([Service] IHttpContextAccessor contextAccessor,
                                                            IGenericRepositoryFactory repoFactory,
                                                            List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            return hcwRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.ClinicId)).ToList();

            /* select anu."FirstName", anu."Surname", anu."IdNumber", anu."PhoneNumber", case when hcw."IsRegistered" = true then 'Yes' else 'No' end as Registered
             from "HealthCareWorker" hcw
             inner join "AspNetUsers" anu on anu."Id" = hcw."UserId"
             where "ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G', 'Tladi Local - Reg D', 'Protea Glen - Reg D')) and hcw."IsActive" = true
             order by anu."Surname", anu."FirstName"*/
        }

        private List<Mother> GetMothers([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            return motherRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.HealthCareWorker.ClinicId) && x.IsActive).ToList();

            /*select 
            anu1."FirstName" as "Mother Firstname", anu1."Surname" as "Mother Surname", m."ExpectedDateOfDelivery", m."Age",
            anu."FirstName" as "HCW Firstname", anu."Surname" as "HCW Surname" 
            from "Mother" m
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = m."HealthCareWorkerId" 
            inner join "AspNetUsers" anu on anu."Id" = hcw."UserId"
            where hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            order by anu."FirstName"
             */
        }

        private List<Visit> GetMotherVisits([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            return visitRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.Mother.HealthCareWorker.ClinicId) && 
                                            x.DueDate.HasValue && x.DueDate.Value.Year == DateTime.Now.Year &&
                                            x.DueDate.Value.Month == DateTime.Now.Month &&
                                            x.Mother.IsActive && 
                                            x.MotherId != null).ToList();

            /*select distinct anu1."FirstName" as "Mother Firstname", anu1."Surname" as "Mother Surname", vt."Description" , 
            v."PlannedVisitDate" as "Start Date", v."DueDate" as "End Date",
            case when v."Attended"  = true then 'Yes' else 'No' end as Completed
            from "Visit" v 
            inner join "VisitType" vt on vt."Id" = v."VisitTypeId" 
            inner join "Mother" m on m."Id" = v."MotherId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = m."HealthCareWorkerId" and hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            where EXTRACT('Year' FROM v."DueDate") = 2024 and EXTRACT('month' FROM v."DueDate") = 4
            order by anu1."FirstName", v."PlannedVisitDate" 
             */
        }

        private List<VisitData> GetMotherVisitData([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);
            return visitDataRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.Visit.Mother.HealthCareWorker.ClinicId) && x.Visit.Mother.IsActive && x.Visit.MotherId != null).ToList();

            /*select distinct anu1."FirstName" as "Mother Firstname", anu1."Surname" as "Mother Surname", vd."VisitName" , vd."VisitSection", vd."Question", vd."QuestionAnswer" 
            from "Visit" v 
            inner join "VisitType" vt on vt."Id" = v."VisitTypeId" 
            inner join "VisitData" vd on vd."VisitId" = v."Id" 
            inner join "Mother" m on m."Id" = v."MotherId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = m."HealthCareWorkerId" and hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            order by anu1."FirstName"
             */
        }

        private List<VisitDataStatus> GetMotherVisitAlerts([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: uId);
            return visitDataStatusRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.VisitData.Visit.Mother.HealthCareWorker.ClinicId) && 
                                                      x.VisitData.Visit.Mother.IsActive && 
                                                      x.VisitData.Visit.MotherId != null).ToList();

            /*select distinct anu1."FirstName" as "Mother Firstname", anu1."Surname" as "Mother Surname", vd."VisitName" , vd."VisitSection", vds."Comment", vds."Color", vds."Type"  
            from "Visit" v 
            inner join "VisitType" vt on vt."Id" = v."VisitTypeId" 
            inner join "VisitData" vd on vd."VisitId" = v."Id" 
            inner join "VisitDataStatus" vds on vds."VisitDataId" = vd."Id" 
            inner join "Mother" m on m."Id" = v."MotherId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = m."HealthCareWorkerId" and hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            order by anu1."FirstName"
             */
        }

        private List<Infant> GetInfants([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            return infantRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.Caregiver.HealthCareWorker.ClinicId) && x.IsActive).ToList();

            /*select distinct
            anu1."FirstName" as "Child Firstname", anu1."DateOfBirth", i."WeightAtBirth", i."LengthAtBirth", g."Description" as "Gender",
            c."FirstName" as "Caregiver Firstname", c."Surname" as "Caregiver Surname",
            anu."FirstName" as "HCW Firstname", anu."Surname" as "HCW Surname" 
            from "Infant" i 
            inner join "Gender" g on g."Id" = i."GenderId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = i."UserId" 
            inner join "Caregiver" c on c."Id" = i."CaregiverId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = c."HealthCareWorkerId" 
            inner join "AspNetUsers" anu on anu."Id" = hcw."UserId"
            where hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            --order by anu1."FirstName"
            union
            -- get all infants linked to mother linked to healthcare workers
            select distinct
            anu1."FirstName" as "Child Firstname", anu1."DateOfBirth", i."WeightAtBirth", i."LengthAtBirth", g."Description" as "Gender",
            anu2."FirstName" as "Mother Firstname", anu2."Surname" as "Mother Surname",
            anu."FirstName" as "HCW Firstname", anu."Surname" as "HCW Surname" 
            from "Infant" i 
            inner join "Gender" g on g."Id" = i."GenderId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = i."UserId" 
            inner join "Mother" m on m."Id" = i."MotherCaregiverId"
            inner join "AspNetUsers" anu2 on anu2."Id" = m."UserId"
            inner join "HealthCareWorker" hcw on hcw."Id" = m."HealthCareWorkerId" 
            inner join "AspNetUsers" anu on anu."Id" = hcw."UserId"
            where hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            order by "Child Firstname"
             * */
        }

        private List<Visit> GetInfantVisits([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            return visitRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.Infant.Caregiver.HealthCareWorker.ClinicId) &&
                                            x.DueDate.HasValue && x.DueDate.Value.Year == DateTime.Now.Year &&
                                            x.DueDate.Value.Month == DateTime.Now.Month &&
                                            x.Infant.IsActive &&
                                            x.InfantId != null).ToList();

            /*select distinct anu1."FirstName" as "Child name", vt."Description" as "Visit Name" , v."PlannedVisitDate" as "Start Date", v."DueDate" as "End Date",case when v."Attended"  = true then 'Yes' else 'No' end as Completed 
            from "Visit" v 
            inner join "VisitType" vt on vt."Id" = v."VisitTypeId" 
            inner join "Infant" m on m."Id" = v."InfantId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "Caregiver" c on c."Id" = m."CaregiverId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = c."HealthCareWorkerId" and hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            where EXTRACT('Year' FROM v."DueDate") = 2024 and EXTRACT('month' FROM v."DueDate") = 4
            order by anu1."FirstName", v."PlannedVisitDate" 
             * */
        }

        private List<VisitData> GetInfantVisitData([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);
            return visitDataRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.Visit.Infant.Caregiver.HealthCareWorker.ClinicId) && x.Visit.Infant.IsActive && x.Visit.InfantId != null).ToList();

            /*select distinct anu1."FirstName" as "Child name", vd."VisitName" , vd."VisitSection", vd."Question", 
            case when vd."Question" = 'Take a photo of page ii of the Road to Health Book.' then 'base64' else vd."QuestionAnswer" end as  QuestionAnswer
            from "Visit" v 
            inner join "VisitType" vt on vt."Id" = v."VisitTypeId" 
            inner join "VisitData" vd on vd."VisitId" = v."Id" 
            inner join "Infant" m on m."Id" = v."InfantId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "Caregiver" c on c."Id" = m."CaregiverId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = c."HealthCareWorkerId" and hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            order by anu1."FirstName"
             * */
        }

        private List<VisitDataStatus> GetInfantVisitAlerts([Service] IHttpContextAccessor contextAccessor,
                                        IGenericRepositoryFactory repoFactory,
                                        List<Guid> clinicIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: uId);
            return visitDataStatusRepo.GetAll().Where(x => clinicIds.Contains((Guid)x.VisitData.Visit.Infant.Caregiver.HealthCareWorker.ClinicId) && x.VisitData.Visit.Infant.IsActive &&
                                            x.VisitData.Visit.InfantId != null).ToList();

            /*select distinct anu1."FirstName" as "Child name", vd."VisitName" , vd."VisitSection", vds."Comment", vds."Color", vds."Type"  
            from "Visit" v 
            inner join "VisitType" vt on vt."Id" = v."VisitTypeId" 
            inner join "VisitData" vd on vd."VisitId" = v."Id" 
            inner join "VisitDataStatus" vds on vds."VisitDataId" = vd."Id" 
            inner join "Infant" m on m."Id" = v."InfantId" 
            inner join "AspNetUsers" anu1 on anu1."Id" = m."UserId" 
            inner join "Caregiver" c on c."Id" = m."CaregiverId" 
            inner join "HealthCareWorker" hcw on hcw."Id" = c."HealthCareWorkerId" and hcw."ClinicId" in (select c."Id" from "Clinic" c where "Name"  in ('Kliptown - Reg G','Tladi Local - Reg D','Protea Glen - Reg D'))
            order by anu1."FirstName"
             */
        }






    }
}
