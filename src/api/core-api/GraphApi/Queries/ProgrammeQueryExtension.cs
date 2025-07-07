using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
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
          ApplicationUserManager userManager,
          [Service] IHttpContextAccessor httpContextAccessor)
        {
            var requestingUser = httpContextAccessor.HttpContext.GetUser().Id;

            var user = await userManager.FindByIdAsync(requestingUser.ToString());
            var roles = await userManager.GetRolesAsync(user);

            var programmes = new List<Programme>();

            if (roles.Contains("Coach"))
            {
                return programmes;
            }

            var requestingUserHierarchy = hierarchyEngine.GetUserHierarchy(requestingUser);

            // Get `Practitioner`
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: requestingUser);
            var targetPractitioner = practitionerRepo.GetByUserId(requestingUser);

            if (targetPractitioner is null)
            {
                throw new ArgumentException("Practitioner not found");
            }

            var programmeRepo = repoFactory.CreateGenericRepository<Programme>(userContext: requestingUser);

            // If principal return all programmes for the classroom
            if (targetPractitioner.IsPrincipal.HasValue && targetPractitioner.IsPrincipal.Value)
            {
                return programmeRepo
                .GetAll()
                .Where(p => p.IsActive
                    && p.ClassroomGroupId != null
                    && p.ClassroomGroup.Classroom.UserId == targetPractitioner.UserId)
                .Include(c => c.DailyProgrammes)
                .Include(p => p.ClassroomGroup)
                .OrderBy(c => c.StartDate)
                .ToList();
            }

            // If practitioner just return programmes for their classroomGroups
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
