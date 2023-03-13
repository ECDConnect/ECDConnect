using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart {
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ProgrammeQueryExtension
    {
        public ProgrammeQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public IEnumerable<Programme> GetUserProgrammes(
          IGenericRepositoryFactory repoFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          string overrideUserId)
        {
            var requestingUser = httpContextAccessor.HttpContext.GetUser();
            
            if (string.IsNullOrWhiteSpace(requestingUser.Id))
                return Enumerable.Empty<Programme>();

            // Get `Practitioner`
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: requestingUser.Id);
            var practitioner = practitionerRepo.GetByUserId(requestingUser.Id);
            
            
            var targetUserId = requestingUser.Id;
            Practitioner targetPractitioner = null;

            if (!string.IsNullOrWhiteSpace(overrideUserId) && overrideUserId != requestingUser.Id)
                targetPractitioner = practitionerRepo.GetByUserId(overrideUserId);
            else
                targetPractitioner = practitioner;

            List<Programme> programmes = new List<Programme>();

            if (targetPractitioner != null) {

                if (practitioner?.IsPrincipal == true)
                {
                    var programmeRepo = repoFactory.CreateGenericRepository<Programme>(userContext: requestingUser.Id);
                    programmes = programmeRepo
                        .GetAll()
                        .Where(c => c.Classroom.UserId == targetPractitioner.UserId)
                        .Include(c => c.DailyProgrammes)
                        .ToList();
                }
                else
                {
                    var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: requestingUser.Id);
                    var classroomIds = classroomGroupRepo.GetAll().Where(c => c.UserId == Guid.ParseExact(targetPractitioner.UserId, "D")).Select(c => c.ClassroomId).ToList();

                    var programmeRepo = repoFactory.CreateGenericRepository<Programme>(userContext: requestingUser.Id);
                    programmes = programmeRepo
                        .GetAll()
                        .Where(c => classroomIds.Contains(c.ClassroomId))
                        .Include(c => c.DailyProgrammes)
                        .ToList();
                }
            }

            return programmes;
        }
    }
}
