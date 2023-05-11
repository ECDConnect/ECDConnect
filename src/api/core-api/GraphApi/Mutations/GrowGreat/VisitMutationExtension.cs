using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.GraphQL.Enums;
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
using NPOI.HSSF.Record;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class VisitMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddAdditionalVisitForMother(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var motherRepo = repoFactory.CreateGenericRepository<Mother>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_mother) && x.Name == Constants.GGSettings.additional_visits).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Mother mother = motherRepo.GetAll().Where(x => x.UserId == input.MotherId.ToString()).FirstOrDefault();

            input.VisitType = visitType;
            input.Attended = false;
            input.InfantId = null;
            input.MotherId = mother.Id;
            input.LinkedVisitId = null;
            input.PractitionerId = null;

            return visitManager.AddAdditionalVisit(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddAdditionalVisitForInfant(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var infantRepo = repoFactory.CreateGenericRepository<Infant>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.GGSettings.client_child) && x.Name == Constants.GGSettings.additional_visits).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Infant infant = infantRepo.GetAll().Where(x => x.UserId == input.InfantId.ToString()).FirstOrDefault();


            input.VisitType = visitType;
            input.Attended = false;
            input.MotherId = null;
            input.InfantId = infant.Id;
            input.LinkedVisitId = null;
            input.PractitionerId = null;

            return visitManager.AddAdditionalVisit(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Visit AddSupportVisitForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            VisitModel input)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);
            VisitType visitType = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name == Constants.SSSettings.visitType_support).OrderBy(x => x.NormalizedName).FirstOrDefault();
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == input.PractitionerId.ToString()).FirstOrDefault();

            input.VisitType = visitType;
            input.Attended = false;
            input.MotherId = null;
            input.InfantId = null;
            input.LinkedVisitId = null;
            input.PractitionerId = practitioner.Id;

            return visitManager.AddAdditionalVisit(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool AddDefaultVisitsForPractitioner(
            [Service] IHttpContextAccessor httpContextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] VisitManager visitManager,
            string practitionerId)
        {
            var applicationUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var visitTypeRepo = repoFactory.CreateGenericRepository<VisitType>(userContext: applicationUserId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: applicationUserId);
            Practitioner practitioner = practitionerRepo.GetAll().Where(x => x.UserId == practitionerId).FirstOrDefault();
            List<VisitType> visitTypes = visitTypeRepo.GetAll().Where(x => x.Type.Equals(Constants.SSSettings.client_practitioner) && x.Name != Constants.SSSettings.visitType_support).OrderBy(x => x.NormalizedName).ToList();

            //TODO: dates
            // -- first visit; Deadline for first visit = { date SmartSpace licence was received + 1 month }
            // --second visit; Deadline for second visit = { date SmartSpace licence was received + 2 months }
            
            var input = new VisitModel();
            foreach (VisitType visitType in visitTypes)
            {
                input = new VisitModel();
                input.VisitType = visitType;
                input.Attended = false;
                input.MotherId = null;
                input.InfantId = null;
                input.LinkedVisitId = null;
                input.PractitionerId = input.PractitionerId;
                visitManager.AddAdditionalVisit(input);
            }

            return true;
        }
    }
}
