using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using EcdLink.Api.CoreApi.Managers.Users.GrowGreat;
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
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class InfantMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Infant AddInfant([Service] InfantManager infantManager, InfantModel input)
        {
            return infantManager.AddInfant(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfant(
            [Service] InfantManager infantManager,
            string id,
            InfantModel input)
        {
            return infantManager.UpdateInfant(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfantCaregiverContactDetails([Service] InfantManager infantManager, string id, InfantModel input)
        {
            return infantManager.UpdateInfantCaregiverContactDetails(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfantCaregiverAddress([Service] InfantManager infantManager, string id, InfantModel input)
        {
            return infantManager.UpdateInfantCaregiverAddress(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Infant UpdateInfantCaregiver([Service] InfantManager infantManager, string infantId, InfantModel input)
        {
            return infantManager.UpdateInfantCaregiver(infantId, input);
        }

        /* Temp function*/
        public Boolean UpdateInfantDueDates(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
             [Service] InfantManager infantManager
          )
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeID = "1b6513aa-9187-11ed-a1eb-0242ac120002";

            List<Visit> visits = visitRepo.GetAll().Where(x => x.InfantId != null && x.VisitTypeId.ToString() != visitTypeID && x.DueDate == null).OrderBy(x => x.InfantId).OrderBy(y => y.PlannedVisitDate).ToList();

            foreach (var item in visits)
            {
                infantManager.UpdateDueDates(item.InfantId.ToString());
            }

            return true;
        }
    }
}
