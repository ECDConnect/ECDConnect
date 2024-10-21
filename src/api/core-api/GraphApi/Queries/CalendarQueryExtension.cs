using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
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

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class CalendarQueryExtension
    {
        public CalendarQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<CalendarEvent> GetUserCalendarEvents(
          IGenericRepositoryFactory repoFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          DateTime? start)
        {
            var requestingUser = httpContextAccessor.HttpContext.GetUser();
            var userId = requestingUser.Id;

            var eventRepo = repoFactory.CreateGenericRepository<CalendarEvent>();
            var eventParticipantRepo = repoFactory.CreateGenericRepository<CalendarEventParticipant>();

            var ownEvents = eventRepo.GetAll()
                .Where(e => e.UserId == userId
                    && e.IsActive
                    && e.Start >= start)
                .Include(e => e.Participants)
                .Include(e => e.Visit)
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
                .Include(e => e.Visit)
                .ToList();

            var list = new List<CalendarEvent>();
            list.AddRange(ownEvents);
            list.AddRange(otherEvents);
            return list;
        }


    }
}
