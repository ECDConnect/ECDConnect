using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
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

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: uId);
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: uId);

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

    }
}
