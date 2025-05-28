using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Abstractrions.Constants;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;

namespace ECDLink.Api.CoreApi.Services
{
    public class AbsenteeService : Interfaces.IAbsenteeService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly IReassignmentService _reassignmentService;
        private readonly INotificationService _notificationService;
        private readonly ApplicationUserManager _userManager;
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly Guid _applicationUserId;
        private readonly AuthenticationDbContext _dbContext;
        private IGenericRepository<Absentees, Guid> _absenteeRepo;
        private readonly IHolidayService<Holiday> _holidayService;
        private IGenericRepository<Practitioner, Guid> _practiGenericRepo;

        public AbsenteeService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] IReassignmentService reassignmentService,
            [Service] INotificationService notificationService,
            [Service] ApplicationUserManager userManager,
            IHolidayService<Holiday> holidayService,
            [Service] AuthenticationDbContext dbContext,
            HierarchyEngine hierarchyEngine)
        {
            _dbContext = dbContext;
            _repositoryFactory = repositoryFactory;
            _reassignmentService = reassignmentService;
            _notificationService = notificationService;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = contextAccessor.HttpContext != null && contextAccessor.HttpContext.GetUser() != null ? contextAccessor.HttpContext.GetUser().Id : hierarchyEngine.GetAdminUserId().GetValueOrDefault();
            _absenteeRepo = repositoryFactory.CreateGenericRepository<Absentees>(userContext: _applicationUserId);
            _practiGenericRepo = repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _holidayService = holidayService;
        }

        public Absentees AddAbsenteeForPractitioner(
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classroomGroupId = null,
            DateTime? absentDateEnd = null,
            bool isRoleAssign = false,
            string fromRole = null,
            string toRole = null,
            string roleAssignedToUser = null,
            Guid? practitionerRemovalHistory = null)
        {
            reason = string.IsNullOrEmpty(reason) ? "Practitioner Marked Absent" : reason;
            var absentee = new Absentees
            {
                UserId = Guid.Parse(practitionerId),
                Reason = reason,
                AbsentDate = absentDate,
                AbsentDateEnd = absentDateEnd,
                LoggedBy = loggedByUser,
                ReassignedClass = classroomGroupId,
                ReassignedToPractitioner = reassignedToPractitioner,
                UpdatedBy = loggedByUser,
                UpdatedDate = DateTime.Now,
                IsRoleAssign = isRoleAssign,
                PractitionerRemovalHistoryId = practitionerRemovalHistory
            };

            if (classroomGroupId != null)
            {
                absentee.ReassignedClass = classroomGroupId;
            }
            if (reassignedToPractitioner != null)
            {
                absentee.ReassignedToPractitioner = reassignedToPractitioner;
            }
            if (absentDateEnd != null)
            {
                if (absentDateEnd.HasValue && absentDateEnd >= absentDate)
                {
                    absentee.AbsentDateEnd = absentDateEnd.Value;
                }
                else
                {
                    absentee.AbsentDateEnd = absentDate.Date;
                }
            }
            else
            {
                absentee.AbsentDateEnd = absentDate.Date;
            }

            var createdAbsentee = _absenteeRepo.Insert(absentee);

            if (createdAbsentee.Id != Guid.Empty)
            {
                //Log to the history table for reassignment back to owner user after absentee end date and pass on the role selectiosn to for future use with assigned absenteeid
                _reassignmentService.AddReassignmentForPractitioner(practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classroomGroupId, false, absentDateEnd, isRoleAssign, fromRole, toRole, roleAssignedToUser, absentee.Id.ToString());

                //send notifications a) Absentee, b) long leave // dont send if user is removed completely, the logic is shared here for complete removal and absentees
                if (reason != "Practitioner removed from programme")
                {
                    var userToSend = _userManager.FindByIdAsync(practitionerId).Result;
                    List<TagsReplacements> replacements = new List<TagsReplacements>();
                    string parentUserId = absentee.LoggedBy;

                    if (userToSend.practitionerObjectData != null && userToSend.practitionerObjectData.PrincipalHierarchy.HasValue)
                    {
                        parentUserId = userToSend.practitionerObjectData.PrincipalHierarchy.Value.ToString();
                    }
                    var parentUser = _userManager.FindByIdAsync(parentUserId).Result;
                    if (parentUser != null)
                    {
                        var parentToSend = _userManager.FindByIdAsync(parentUser.Id).Result;

                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "PrincipalName",
                            ReplacementValue = parentToSend.FirstName
                        });
                    }
                    else
                    {
                        replacements.Add(new TagsReplacements()
                        {
                            FindValue = "PrincipalName",
                            ReplacementValue = "Principal"
                        });
                    }
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "AbsentStartDate",
                        ReplacementValue = absentDate.ToLongDateString(),
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "AbsentEndDate",
                        ReplacementValue = (absentDateEnd.HasValue ? absentDateEnd.Value.ToLongDateString() : absentDate.AddDays(1).ToLongDateString()),
                    });
                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "PractitionerUserId",
                        ReplacementValue = parentUser.Id.ToString()
                    });

                    var practitioner = _practiGenericRepo.GetByUserId(userToSend.Id);
                    if (!practitioner.IsPrincipalOrAdmin())
                    {
                        // practitioner-marked-onleave 
                        // show while on leave
                        _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedOnLeave, absentDate, userToSend, "", MessageStatusConstants.Amber, replacements, absentDateEnd, false, false, null,
                         relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(practitionerId), "ApplicationUser") });

                        // marked-onleave
                        // show until day before leave starts
                        var beforeAbsentDayStarts = absentDate.AddDays(-1);
                        var startDate = DateTime.Now.Date < beforeAbsentDayStarts.Date ? DateTime.Now.Date : beforeAbsentDayStarts.Date;
                        _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PrincipalMarkedOnLeave, startDate, userToSend, "", MessageStatusConstants.Amber, replacements, absentDate.AddDays(-1), false, false, null,
                         relatedEntities: new List<RelatedEntity> { new RelatedEntity(Guid.Parse(practitionerId), "ApplicationUser") });
                    }
                }
            }

            return createdAbsentee;
        }

        public Absentees EditAbsentee(
            string absenteeId,
            bool deleteAbsentee = false,
            string reassignedToPractitioner = null,
            string reason = null,
            DateTime? absentDate = null,
            DateTime? absentDateEnd = null,
            bool isRoleAssign = false,
            string roleAssignedToUser = null)
        {
            if (absenteeId != null)
            {
                var absentee = _absenteeRepo.GetById(Guid.Parse(absenteeId));

                var userId = _userManager.FindByIdAsync(absentee.UserId.ToString()).Result?.Id.ToString();

                if (string.IsNullOrEmpty(userId))
                {
                    var practitioner = _dbContext.Practitioners.FirstOrDefault(u => u.Id == absentee.UserId);
                    userId = practitioner?.Id.ToString() ?? absentee.UserId.ToString();
                }

                if (absentee != null)
                {
                    if (deleteAbsentee)
                    {
                        absentee.IsActive = false;
                        // remove notifications for leave
                        _notificationService.DeleteAllNotificationsForTypeAndDate(userId, TemplateTypeConstants.PrincipalMarkedOnLeave, absentDate);
                        _notificationService.DeleteAllNotificationsForTypeAndDate(userId, TemplateTypeConstants.PractitionerMarkedOnLeave, absentDate);
                    }
                    else
                    {
                        absentee.IsActive = true;
                        //FE is preventinmg the possibility of passed leave being edited
                        if (reassignedToPractitioner != null)
                        {
                            if (absentee.ReassignedToPractitioner != reassignedToPractitioner)
                            {
                                absentee.ReassignedToPractitioner = reassignedToPractitioner;
                            }
                        }
                        if (absentDate != null)
                        {
                            if (absentee.AbsentDate != absentDate)
                            {
                                absentee.AbsentDate = (DateTime)absentDate;
                            }
                        }
                        if (absentDateEnd != null)
                        {
                            if (absentee.AbsentDateEnd != null && absentee.AbsentDateEnd != absentDateEnd)
                            {
                                absentee.AbsentDateEnd = (DateTime)absentDateEnd;
                            }
                        }
                        if (isRoleAssign && roleAssignedToUser != null)
                        {
                            absentee.IsRoleAssign = isRoleAssign;
                        }

                        if (reason != null)
                            absentee.Reason = reason;
                    }
                    _absenteeRepo.Update(absentee);
                    if (reassignedToPractitioner != null)
                    {
                        var practitionerUserId = _userManager.FindByIdAsync(reassignedToPractitioner).Result?.Id.ToString();

                        if (string.IsNullOrEmpty(practitionerUserId))
                        {
                            var practitioner = _dbContext.Practitioners.FirstOrDefault(u => u.Id == Guid.Parse(reassignedToPractitioner));
                            practitionerUserId = practitioner?.UserId.ToString() ?? reassignedToPractitioner;
                        }

                        _reassignmentService.EditReassignment(userId, practitionerUserId, reason != null ? reason : absentee.Reason, (DateTime)(absentDate != null ? absentDate : absentee.AbsentDate), isRoleAssign, roleAssignedToUser, absentee.Id.ToString(), deleteAbsentee);

                        // Reassign classroom group to the practitioner that took attendance  
                        if (!string.IsNullOrEmpty(absentee.ReassignedClass))
                        {
                            var classroomGroup = _dbContext.ClassroomGroups.FirstOrDefault(u => u.Id == Guid.Parse(absentee.ReassignedClass));
                            if (classroomGroup != null)
                            {
                                classroomGroup.UserId = Guid.Parse(userId);
                                _dbContext.SaveChanges();
                            }
                        }
                    }

                    return absentee;
                }
            }
            return null;
        }


        public List<AbsenteeDetail> GetAbsenteeByUser(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var classRoomRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            List<AbsenteeDetail> absenteeDetails = new List<AbsenteeDetail>();

            var absentees = _absenteeRepo.GetAll().Where(a => a.UserId.ToString() == userId && a.IsActive == true).ToList();
            if (startDate != null)
            {
                absentees = absentees.Where(a => a.AbsentDate >= startDate).ToList();
            }
            else
            {
                absentees = absentees.Where(a => a.AbsentDate >= DateTime.Now.Date).ToList();
            }
            if (endDate != null)
            {
                absentees = absentees.Where(a => a.AbsentDate <= endDate).ToList();
            }

            if (absentees.Any())
            {
                foreach (var item in absentees)
                {
                    string classRoomName = "";
                    string reassignedToPerson = "";
                    string loggedByPerson = "";
                    if (item.ReassignedClass != null)
                    {
                        var classRoom = classRoomRepo.GetAll().Where(c => c.Id.ToString() == item.ReassignedClass && c.Name != "Unsure").FirstOrDefault();
                        if (classRoom != null)
                        {
                            classRoomName = classRoom.Name;
                        }
                    }
                    if (item.ReassignedToPractitioner != null)
                    {
                        var user = _userManager.FindByIdAsync(item.ReassignedToPractitioner).Result;
                        if (user != null)
                        {
                            reassignedToPerson = user.FirstName + " " + user.Surname;
                        }
                    }
                    //get logged by details
                    if (item.LoggedBy != null)
                    {
                        var loggedUser = _userManager.FindByIdAsync(item.LoggedBy).Result;
                        if (loggedUser != null)
                        {
                            loggedByPerson = loggedUser.FirstName + " " + loggedUser.Surname;
                        }
                    }

                    absenteeDetails.Add(new AbsenteeDetail()
                    {
                        AbsenteeId = item.Id.ToString(),
                        Reason = item.Reason,
                        AbsentDate = item.AbsentDate,
                        AbsentDateEnd = item.AbsentDateEnd,
                        ClassName = classRoomName,
                        ReassignedToPerson = reassignedToPerson,
                        ReassignedToUserId = item.ReassignedToPractitioner,
                        LoggedByUserId = item.LoggedBy,
                        LoggedByPerson = loggedByPerson,
                    });
                }
            }

            return absenteeDetails;

        }

        public int GetAbsentDayCountForUser(Guid userId, DateTime startDate, DateTime endDate)
        {
            var absentees = _absenteeRepo.GetAll()
                .Where(a =>
                    a.UserId == userId
                    && a.AbsentDate < endDate
                    && (!a.AbsentDateEnd.HasValue || (a.AbsentDateEnd >= startDate)))
                .ToList();

            var daysAbsent = new List<DateTime>();

            foreach (var absense in absentees)
            {
                var leaveStart = absense.AbsentDate < startDate ? startDate : absense.AbsentDate; // Ignore absense days before our start
                var leaveEnd = !absense.AbsentDateEnd.HasValue
                    ? absense.AbsentDate // Only one days leave
                    : absense.AbsentDateEnd.Value > endDate
                        ? endDate : absense.AbsentDateEnd.Value; // Ignore leave days after our end date

                daysAbsent.AddRange(leaveStart.DaysBetween(leaveEnd));
            }

            // Remove holidays
            var holidays = _holidayService.GetHolidays(startDate, endDate, "en-za").Select(x => x.Day).ToList();
            daysAbsent.Except(holidays);

            var count = daysAbsent
                .Where(x => x.DayOfWeek != DayOfWeek.Saturday && x.DayOfWeek != DayOfWeek.Sunday) // Remove weekends
                .Distinct() // Ensure unique days (could be overlapping leave logged)
                .Count();

            return count;
        }
    }
}
