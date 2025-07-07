using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
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

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class CalendarEventMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]

        public CalendarEvent UpdateCalendarEvent(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            ApplicationUserManager userManager,
            Guid? id,
            CalendarEventModel input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var repoCalendarEvent = repoFactory.CreateGenericRepository<CalendarEvent>();
            var repoCalendarEventParticipant = repoFactory.CreateGenericRepository<CalendarEventParticipant>();

            if (id == null) id = new Guid(input.Id);

            CalendarEvent calendarEvent = repoCalendarEvent.GetById((Guid)id);
            if (calendarEvent == null)
            {
                calendarEvent = new CalendarEvent();
                calendarEvent.Id = id.Value;
                calendarEvent.Name = input.Name;
                calendarEvent.EventType = input.EventType;
                calendarEvent.Start = input.Start;
                calendarEvent.End = input.End;
                calendarEvent.Description = input.Description;
                calendarEvent.IsActive = true;
                calendarEvent.Action = input.Action;
                calendarEvent.UserId = uId;
                calendarEvent.AllDay = input.AllDay;
                repoCalendarEvent.Insert(calendarEvent);

                if (input.Participants != null && input.Participants.Count > 0)
                {
                    var participants = new List<CalendarEventParticipant>();
                    foreach (var inputParticipant in input.Participants)
                    {
                        var calendarEventParticipant = new CalendarEventParticipant();
                        calendarEventParticipant.Id = new Guid(inputParticipant.Id);
                        calendarEventParticipant.CalendarEvent = calendarEvent;
                        calendarEventParticipant.IsActive = true;
                        calendarEventParticipant.ParticipantUserId = inputParticipant.ParticipantUserId;
                        calendarEventParticipant.UserId = uId;
                        repoCalendarEventParticipant.Insert(calendarEventParticipant);
                        participants.Add(calendarEventParticipant);
                    }
                    calendarEvent.Participants = participants;
                    NotifyUsers(notificationService, userManager, calendarEvent);
                }
            }
            else
            {
                var existingParticipants = calendarEvent.Participants.ToList();
                calendarEvent.Name = input.Name;
                calendarEvent.EventType = input.EventType;
                calendarEvent.Start = input.Start;
                calendarEvent.End = input.End;
                calendarEvent.Description = input.Description;
                calendarEvent.IsActive = true;
                calendarEvent.Action = input.Action;
                calendarEvent.AllDay = input.AllDay;
                repoCalendarEvent.Update(calendarEvent);

                var inputParticipants = input.Participants;
                if (inputParticipants == null) inputParticipants = new List<CalendarEventParticipantModel>();
                foreach (var participant in existingParticipants)
                {
                    var inputParticipant = inputParticipants.Where(x => new Guid(x.Id) == participant.Id).FirstOrDefault();
                    if (inputParticipant == null)
                    {
                        repoCalendarEventParticipant.Delete(new Guid(inputParticipant.Id));
                    }
                    else
                    {
                        if (participant.ParticipantUserId != inputParticipant.ParticipantUserId)
                        {
                            var calendarEventParticipant = repoCalendarEventParticipant.GetById(new Guid(inputParticipant.Id));
                            calendarEventParticipant.ParticipantUserId = inputParticipant.ParticipantUserId;
                            repoCalendarEventParticipant.Update(calendarEventParticipant);
                        }
                    }
                }
                foreach (var inputParticipant in input.Participants)
                {
                    if (!existingParticipants.Exists(x => x.Id == new Guid(inputParticipant.Id)))
                    {
                        var calendarEventParticipant = new CalendarEventParticipant();
                        calendarEventParticipant.Id = new Guid(inputParticipant.Id);
                        calendarEventParticipant.CalendarEvent = calendarEvent;
                        calendarEventParticipant.IsActive = true;
                        calendarEventParticipant.ParticipantUserId = inputParticipant.ParticipantUserId;
                        repoCalendarEventParticipant.Insert(calendarEventParticipant);
                    }
                }
            }

            return calendarEvent;
        }

        public CalendarEvent CancelCalendarEvent(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            Guid id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var repoCalendarEvent = repoFactory.CreateGenericRepository<CalendarEvent>();

            CalendarEvent calendarEvent = repoCalendarEvent.GetById(id);
            calendarEvent.IsActive = false;
            calendarEvent.UpdatedDate = DateTime.Now;
            calendarEvent.UpdatedBy = uId.ToString();
            return repoCalendarEvent.Update(calendarEvent);
        }

        private void NotifyUsers(
            [Service] INotificationService notificationService,
            ApplicationUserManager userManager,
            CalendarEvent calendarEvent)
        {
            ApplicationUser currentUser = userManager.FindByIdAsync(calendarEvent.UserId.ToString()).Result;
            // Principal & Practitioner
            var isInRole = userManager.IsInRoleAsync(currentUser, Roles.PRACTITIONER).Result || userManager.IsInRoleAsync(currentUser, Roles.PRINCIPAL).Result;
            if (isInRole)
            {
                var replacements = new List<TagsReplacements>
                {
                    new TagsReplacements()
                    {
                        FindValue = "FirstName",
                        ReplacementValue = currentUser.FirstName
                    },
                    new TagsReplacements()
                    {
                        FindValue = "CalendarEventId",
                        ReplacementValue = calendarEvent.Id.ToString()
                    }
                };
                if (calendarEvent.Participants.Any())
                {
                    foreach (var participant in calendarEvent.Participants) 
                    { 
                        if (participant.ParticipantUserId != calendarEvent.UserId)
                        {
                            var participantUser = userManager.FindByIdAsync(participant.ParticipantUserId).Result;
                                notificationService.SendNotificationAsync(null, TemplateTypeConstants.CalendarInvitation, DateTime.Now.Date, participantUser, "", MessageStatusConstants.Blue, replacements, calendarEvent.End,
                                                                                            relatedEntities: new List<RelatedEntity> { new RelatedEntity(calendarEvent.Id, "CalendarEvent") });
                        }
                    }
                }
            }
        }

    }
}

