using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClinicQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Clinic> GetAllClinics(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var healthCareWorkerRepo = repoFactory.CreateRepository<Clinic>(userContext: uId);
            List<Clinic> clinics = healthCareWorkerRepo.GetAll().ToList();

            return clinics;
        }
    }
}
