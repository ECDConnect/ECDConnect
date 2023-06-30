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
using static iTextSharp.text.pdf.AcroFields;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class MotherMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Mother AddMother([Service] MotherManager motherManager, MotherModel input)
        {
            return motherManager.AddMother(input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Mother UpdateMother([Service] MotherManager motherManager, string id, MotherModel input)
        {
            return motherManager.UpdateMother(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Mother UpdateMotherContactDetails([Service] MotherManager motherManager, string id, MotherModel input) {
            return motherManager.UpdateContactDetails(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Mother UpdateMotherAddress([Service] MotherManager motherManager, string id, MotherModel input)
        {
            return motherManager.UpdateMotherAddress(id, input);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Update)]
        public Mother UpdateMotherDeliveryDate([Service] MotherManager motherManager, string id, DateTime? expectedDateOfDelivery)
        {
            return motherManager.UpdateMotherDeliveryDate(id, expectedDateOfDelivery);
        }

        /* Temp function*/
        public Boolean UpdateMotherDueDates(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
             [Service] MotherManager motherManager
          )
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var visitRepo = repoFactory.CreateGenericRepository<Visit>(userContext: applicationUserId);
            var visitTypeID = "7ec10a6e-917b-11ed-a1eb-0242ac120002";

            List<Visit> visits = visitRepo.GetAll().Where(x => x.MotherId != null && x.VisitTypeId.ToString() != visitTypeID && x.DueDate == null).OrderBy(x => x.InfantId).OrderBy(y => y.PlannedVisitDate).ToList();

            foreach (var item in visits)
            {
                motherManager.UpdateDueDates(item.MotherId.ToString());
            }

            return true;
        }
    }
}
