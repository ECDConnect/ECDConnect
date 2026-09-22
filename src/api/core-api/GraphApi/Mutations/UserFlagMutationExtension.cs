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
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserFlagMutationExtension
    {
        /// <summary>
        /// Sets a flag for the calling user, or updates it if already set. The
        /// user is taken from the token, never from an argument.
        ///
        /// Setting a flag twice is not an error: the app queues these while
        /// offline and may replay one, and a second "you finished the
        /// walkthrough" means the same as the first.
        /// </summary>
        [Permission(PermissionGroups.GENERAL, GraphActionEnum.Update)]
        public bool SetUserFlag(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string key,
            string value = null)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return false;
            }

            var userId = contextAccessor.HttpContext.GetUser().Id;
            var flagRepo = repoFactory.CreateRepository<UserFlag>();

            var existing = flagRepo.GetAll()
                .FirstOrDefault(x => x.UserId == userId && x.FlagKey == key);

            if (existing != null)
            {
                existing.FlagValue = value;
                existing.IsActive = true;
                existing.UpdatedBy = userId.ToString();
                existing.UpdatedDate = DateTime.Now;
                flagRepo.Update(existing);

                return true;
            }

            flagRepo.Insert(new UserFlag
            {
                UserId = userId,
                FlagKey = key,
                FlagValue = value,
                UpdatedBy = userId.ToString(),
            });

            return true;
        }
    }
}
