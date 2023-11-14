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
            var userId = Guid.Parse(requestingUser.Id);

            if (string.IsNullOrWhiteSpace(requestingUser?.Id))
                return Enumerable.Empty<CalendarEvent>();

            var eventRepo = repoFactory.CreateGenericRepository<CalendarEvent>();
            var eventParticipantRepo = repoFactory.CreateGenericRepository<CalendarEventParticipant>();

            var ownEvents = eventRepo.GetAll()
                .Where(e => e.UserId == userId
                    && e.IsActive
                    && e.Start >= start)
                .Include(e => e.Participants)
                .ToList();

            var otherEventIds = eventParticipantRepo.GetAll()
                .Where(e => e.ParticipantUserId == userId)
                .Where(e => e.CalendarEvent.IsActive && e.CalendarEvent.Start >= start)
                .Select(e => e.CalendarEventId)
                .ToList();
            var otherEvents = eventRepo.GetAll()
                .Where(e => otherEventIds.Contains(e.Id))
                .Where(e => e.IsActive && e.Start >= start)
                .Include(e => e.Participants)
                .ToList();

            var list = new List<CalendarEvent>();
            list.AddRange(ownEvents);
            list.AddRange(otherEvents);
            return list.OrderBy(e => e.Start);
        }


    }
}
