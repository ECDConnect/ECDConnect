using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.ObjectTypes
{
    [ExtendObjectType(typeof(IGrantHolder))]
    public class GrantInterfaceExtension
    {
        [Permission(PermissionGroups.CLASSROOM, GraphActionEnum.View)]
        public IEnumerable<Grant> GetGrants(
          [Parent] IGrantHolder user,
          [Service] IDbContextFactory<AuthenticationDbContext> dbFactory)
        {
            using var context = dbFactory.CreateDbContext();

            var grants = context.UserGrants
              .Where(x => x.UserId == Guid.Parse(user.UserId))
              .Select(x => x.Grant)
              .ToList();

            return grants;
        }

        public bool UpdateGrants(
          [Parent] IGrantHolder parent,
          [Service] AuthenticationDbContext context,
          Guid[] grantIds)
        {

            var grantsToAdd = grantIds.Select(x => new UserGrant
            {
                GrantId = x,
                UserId = Guid.Parse(parent.UserId)
            });

            var existingGrants = context.UserGrants
              .Where(x => x.UserId == Guid.Parse(parent.UserId));
            // Added safety from removing items from the list should the insertion of new items fail
            try
            {
                context.UserGrants.RemoveRange(existingGrants);

                context.UserGrants.AddRange(grantsToAdd);

                context.SaveChanges();
            }
            catch (Exception)
            {
                // Error
            }

            return true;
        }

        public bool AddGrants(
  [Service] AuthenticationDbContext context,
  List<UserGrant> grants)
        {
            foreach (var grant in grants)
            {
                var existingGrants = context.UserGrants
                  .Where(x => x.UserId == grant.UserId);
                // Added safety from removing items from the list should the insertion of new items fail
                try
                {
                    context.UserGrants.RemoveRange(existingGrants);

                    context.UserGrants.AddRange(grant);

                    context.SaveChanges();
                }
                catch (Exception)
                {
                    // Error
                }
            }

            return true;
        }
    }
}
