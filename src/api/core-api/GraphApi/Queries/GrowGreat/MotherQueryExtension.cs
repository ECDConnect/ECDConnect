using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using NPOI.POIFS.Properties;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class MotherQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothers(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().ToList();

            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Mother> GetAllMothersForHealthCareWorker(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] MotherManager motherManager,
            string id,
            string visitType = Constants.GrowGreatSettings.visitType_all) // visitType can be all / overdue / due
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> allMothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId.Equals(id) && x.IsActive.Equals(true)).ToList();
            List<Mother> mothers = new List<Mother>();

            if (visitType == Constants.GrowGreatSettings.visitType_due)
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother.Id, true);
                    mother.NextVisitDate = motherManager.GetClientsNextVisitDate(mother.Id);
                    if (mother.StatusInfo.Color == MetricsIconEnum.Warning.ToString() && mother.StatusInfo.Subject.Contains(" due "))
                    {
                        mothers.Add(mother);
                    }
                }
            } else if (visitType == Constants.GrowGreatSettings.visitType_overdue)
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother.Id, true);
                    mother.NextVisitDate = motherManager.GetClientsNextVisitDate(mother.Id);
                    if (mother.StatusInfo.Color == MetricsIconEnum.Error.ToString() && mother.StatusInfo.Subject.Contains(" overdue "))
                    {
                        mothers.Add(mother);
                    }
                }
            } else
            {
                foreach (var mother in allMothers)
                {
                    mother.StatusInfo = motherManager.GetStatusInfo(mother.Id, false);
                    mother.NextVisitDate = motherManager.GetClientsNextVisitDate(mother.Id);
                    mothers.Add(mother);
                }
            }
            return mothers;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public Mother GetMotherById(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            Mother mother = motherRepo.GetAll().Where(x => x.Id.Equals(Guid.Parse(id))).FirstOrDefault();

            return mother;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetMotherCountForHealthCareWorkerForMonth(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string id)
        {
            DateTime today = DateTime.Today;

            var uId = contextAccessor.HttpContext.GetUser().Id;
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: uId);
            List<Mother> mothers = motherRepo.GetAll().Where(x => x.HealthCareWorker.UserId == id &&
                                                                  x.IsActive.Equals(true) && 
                                                                  x.InsertedDate.Month == today.Month &&
                                                                  x.InsertedDate.Year == today.Year).ToList();

            return mothers.Count;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Visit> GetMotherVisits(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: uId);

            List<Visit> motherVisits = new List<Visit>();
            motherVisits = (
                from visit in visitRepo.GetAll().Where(x => x.Mother.UserId == id).OrderBy(x => x.PlannedVisitDate)
                join visitType in visitTypeRepo.GetAll().Where(y => y.Type == Constants.GrowGreatSettings.client_mother) on visit.VisitTypeId equals visitType.Id
                select visit
            ).ToList();

            return motherVisits;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<CMSVisit> GetAntenatalVisitDataForMother(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] VisitDataManager visitDataManager,
            IGenericRepositoryFactory repoFactory,
            string visitId,
            string localeId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: uId);
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: uId);
            var visitDataRepo = repoFactory.CreateGenericRepository<VisitData>(userContext: uId);
            var _visitId = new Guid(visitId);

            // get visit details for visitId
            Visit motherVisit = (
                from visit in visitRepo.GetAll().Where(x => x.Id == _visitId)
                join visitType in visitTypeRepo.GetAll().Where(y => y.Type == Constants.GrowGreatSettings.client_mother) on visit.VisitTypeId equals visitType.Id
                select visit
            ).FirstOrDefault();

            //
            // RULES:
            //

            // First visit - Show the 3 sections to complete: Healthcare, Nutrition, Pregnancy care
            // If this is Visit 2, 3, 4 or "Other visit" after the first, show 4 sections: Healthcare, Nutrition, Pregnancy care, Danger signs

            var names = "";
            if (motherVisit.VisitType.Name == Constants.GrowGreatSettings.visit1)
            {
                names = Constants.GrowGreatSettings.antenatal_healthcare + " " + 
                        Constants.GrowGreatSettings.antenatal_nutrition + " " + 
                        Constants.GrowGreatSettings.antenatal_pregnancy_care;
            } else
            {
                names = Constants.GrowGreatSettings.antenatal_healthcare + " " + 
                        Constants.GrowGreatSettings.antenatal_nutrition + " " + 
                        Constants.GrowGreatSettings.antenatal_pregnancy_care + " " + 
                        Constants.GrowGreatSettings.antenatal_danger_sings;
            }

            return visitDataManager.GetAllAntenatalVisits(_visitId, Constants.GrowGreatSettings.visit_antenatal_id, localeId, names);
        }


    }
}
