using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Threading.Tasks;


namespace EcdLink.Api.CoreApi.Services.Notifications.Portal
{
    public class CreateChildrenBirthdaysTask : INotificationTask
    {

        private IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repoFactory;
        private Guid _applicationUserId;
        private HierarchyEngine _hierarchyEngine;

        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<CalendarEvent, Guid> _calendarEventRepo;
        private IGenericRepository<CalendarEventParticipant, Guid> _calendarEventParticipant;
        private IGenericRepository<Child, Guid> _childRepo;

        public CreateChildrenBirthdaysTask(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] INotificationService notificationService,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repoFactory = repoFactory;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = (_contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().Value);

            _practitionerRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _calendarEventRepo = _repoFactory.CreateGenericRepository<CalendarEvent>(userContext: _applicationUserId);
            _childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: _applicationUserId);
            _calendarEventParticipant = repoFactory.CreateGenericRepository<CalendarEventParticipant>(userContext: _applicationUserId);
        }

        public bool ShouldRunToday()
        {
            var firstOfFeb = new DateTime(DateTime.Now.Year, 02, 01);
            return DateTime.Now.Date == firstOfFeb.Date;
        }
        public async Task SendNotifications()
        {
            var today = DateTime.Now;

            var practitioners = _practitionerRepo.GetAll().Where(x => x.IsActive == true && x.IsRegistered == true).Select(x => new { UserId = x.UserId, Hierarchy = x.Hierarchy }).ToList();
            foreach (var practitioner in practitioners)
            {
                var practitionerChildren = _childRepo.GetAll().Where(x => x.IsActive == true && x.Hierarchy.Contains(practitioner.Hierarchy))
                    .Select(x => new { ChildName = x.User.FirstName + " " + x.User.Surname, ChildUserId = x.User.Id, ChildDateOfBirth = x.User.DateOfBirth }).ToList();

                if (practitionerChildren.Any())
                {
                    foreach (var child in practitionerChildren)
                    {
                        var birthDate = new DateTime(today.Year, child.ChildDateOfBirth.Month, child.ChildDateOfBirth.Day);

                        var calendarEvent = new CalendarEvent();
                        calendarEvent.Id = Guid.NewGuid();
                        calendarEvent.Name = child.ChildName + "'s Birthday";
                        calendarEvent.EventType = "Birthday";
                        calendarEvent.Start = birthDate.Date;
                        calendarEvent.End = birthDate.Date;
                        calendarEvent.Description = "";
                        calendarEvent.IsActive = true;
                        calendarEvent.Action = null;
                        calendarEvent.UserId = practitioner.UserId;
                        calendarEvent.AllDay = true;

                        _calendarEventRepo.Insert(calendarEvent);

                        var calendarEventParticipant = new CalendarEventParticipant();
                        calendarEventParticipant.Id = Guid.NewGuid();
                        calendarEventParticipant.CalendarEvent = calendarEvent;
                        calendarEventParticipant.IsActive = true;
                        calendarEventParticipant.ParticipantUserId = child.ChildUserId;
                        calendarEventParticipant.UserId = practitioner.UserId;
                        _calendarEventParticipant.Insert(calendarEventParticipant);
                    }
                }
            }

        }
    }
}
