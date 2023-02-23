using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
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
    public class VisitDataStatusMutationExtension
    {
        
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Boolean UpdateVisitDataStatus(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            List<VisitDataStatusModel> input)
        {
            var applicationUserId = contextAccessor.HttpContext.GetUser().Id;
            var visitDataStatusRepo = repoFactory.CreateGenericRepository<VisitDataStatus>(userContext: applicationUserId);

            foreach (VisitDataStatusModel inputItem in input)
            {
                var entityToUpdate = visitDataStatusRepo.GetAll().Where(x => x.Id.ToString() == inputItem.Id).FirstOrDefault();
                entityToUpdate.UpdatedDate = DateTime.Now;
                entityToUpdate.UpdatedBy = applicationUserId;
                entityToUpdate.IsCompleted = (Boolean)inputItem.IsCompleted;
                visitDataStatusRepo.Update(entityToUpdate);
            }
           
            return true;
        }
    }
}
