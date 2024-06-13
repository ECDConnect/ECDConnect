using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class TrainingQueryExtension
    {
        public TrainingQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<IEnumerable<UserTrainingCourse>> GetCurrentUserCompletedTrainingCourses(
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ITrainingService trainingService)
        {
            var requestingUser = httpContextAccessor.HttpContext.GetUser();
            var list = await trainingService.GetUserCompletedCourses(requestingUser.Id);
            return list.Select(x => x as UserTrainingCourse);
        }
    }
}
