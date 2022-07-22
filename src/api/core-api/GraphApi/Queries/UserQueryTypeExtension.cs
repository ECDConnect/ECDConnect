using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;

using Microsoft.EntityFrameworkCore;
using ECDLink.DataAccessLayer.Context;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {
        private readonly IServiceProvider serviceProvider;
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<ApplicationUser> GetUsers([Service] UserManager<ApplicationUser> userManager)
        {
            return userManager.Users;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ApplicationUser GetUserById([Service] UserManager<ApplicationUser> userManager, [Service] RoleManager<IdentityRole> roleManager, [Service] IHttpContextAccessor contextAccessor, [Service] IDbContextFactory<AuthenticationDbContext> dbFactory, [Service] IGenericRepositoryFactory repoFactory, string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;

            //Franchisor
            
            user.franchisorObjectData = new FranchisorQueryExtension().GetFranchisorByUserId(contextAccessor, dbFactory,repoFactory, userId);
            //Coach
            user.coachObjectData = new CoachQueryExtension().GetCoachByUserId(contextAccessor, dbFactory, repoFactory, userId);
            //Principal            
            user.principalObjectData = new PrincipalQueryExtension().GetPrincipalByUserId(contextAccessor, dbFactory, repoFactory, userId);
            //Practitioner
            user.practitionerObjectData = new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, dbFactory, repoFactory, userId);
            //Child
            user.childObjectData = new ChildQueryExtension().GetChildByUserId(contextAccessor, dbFactory, repoFactory, userId);

            return user.IsActive ? user : default(ApplicationUser);
        }
    }
}
