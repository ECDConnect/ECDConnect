using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserFlagQueryExtension
    {
        /// <summary>
        /// Every flag set for the calling user. The user is taken from the
        /// token, never from an argument, so one user cannot read another's.
        /// </summary>
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.View)]
        public List<UserFlag> UserFlags(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var userId = contextAccessor.HttpContext.GetUser().Id;
            var flagRepo = repoFactory.CreateRepository<UserFlag>();

            return flagRepo.GetAll()
                .Where(x => x.UserId == userId && x.IsActive)
                .ToList();
        }
    }
}
