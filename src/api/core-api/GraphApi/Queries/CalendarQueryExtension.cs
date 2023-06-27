using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CalendarQueryExtension
    {
        public CalendarQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<IEnumerable<CalendarEvent>> GetUserCalendarEvents(
          IGenericRepositoryFactory repoFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          DateTime? start)
        {
            var requestingUser = httpContextAccessor.HttpContext.GetUser();

            if (string.IsNullOrWhiteSpace(requestingUser?.Id))
                return Enumerable.Empty<CalendarEvent>();

            var eventRepo = repoFactory.CreateGenericRepository<CalendarEvent>(userContext: requestingUser.Id);

            return eventRepo
                .GetAll()
                .Where(p => p.IsActive
                    && p.Start >= start)
                .Include(c => c.Participants)
                .OrderBy(c => c.Start)
                .ToList();
        }


    }
}
