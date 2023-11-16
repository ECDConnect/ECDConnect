using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ProgrammeQueryExtension
    {
        public ProgrammeQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<IEnumerable<Programme>> GetUserProgrammes(
          IGenericRepositoryFactory repoFactory,
          HierarchyEngine hierarchyEngine,
          UserManager<ApplicationUser> userManager,
          [Service] IHttpContextAccessor httpContextAccessor)
        {
            var requestingUser = httpContextAccessor.HttpContext.GetUser().Id;

            //if (string.IsNullOrWhiteSpace(requestingUser?.Id))
            //    return Enumerable.Empty<Programme>();

            var user = await userManager.FindByIdAsync(requestingUser.ToString());
            var roles = await userManager.GetRolesAsync(user);

            var programmes = new List<Programme>();

            // Coach and Franchisor do not use app.
            if (roles.Contains("Coach") || roles.Contains("Franchisor"))
            {
                return programmes;
            }

            var requestingUserHierarchy = hierarchyEngine.GetUserHierarchy(requestingUser);

            // Get `Practitioner`
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: requestingUser);
            var targetPractitioner = practitionerRepo.GetByUserId(requestingUser);

            if (targetPractitioner is null)
                return programmes;

            var programmeRepo = repoFactory.CreateGenericRepository<Programme>(userContext: requestingUser);

            return programmeRepo
                .GetAll()
                .Where(p => p.IsActive
                    && p.ClassroomGroupId != null
                    && p.ClassroomGroup.UserId == targetPractitioner.UserId)
                .Include(c => c.DailyProgrammes)
                .Include(p => p.ClassroomGroup)
                .OrderBy(c => c.StartDate)
                .ToList();
        }


    }
}
