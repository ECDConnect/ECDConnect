using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Abstractrions.Constants;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using System.Collections.Generic;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using System.Linq;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.Core.Extensions;
using static ECDLink.Core.SystemSettings.SettingGroups;

namespace ECDLink.Api.CoreApi.Services
{
    public class AbsenteeService : Interfaces.IAbsenteeService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private IHttpContextAccessor _contextAccessor;
        private readonly IReassignmentService _reassignmentService;
        private readonly INotificationService _notificationService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly HierarchyEngine _hierarchyEngine;
        private string _applicationUserId;
        private IGenericRepository<Absentees, Guid> _absenteeRepo;

        public AbsenteeService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] IReassignmentService reassignmentService,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _reassignmentService = reassignmentService;
            _notificationService = notificationService;
            _userManager = userManager;
            _hierarchyEngine = hierarchyEngine;
            _applicationUserId = contextAccessor.HttpContext.GetUser()?.Id;
            _absenteeRepo = repositoryFactory.CreateGenericRepository<Absentees>(userContext: _applicationUserId);
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
            Guid? practitionerRemovalHistory = null)
        {
            reason = string.IsNullOrEmpty(reason) ? "Practitioner Marked Absent" : reason;
            var absentee = new Absentees
            {
                UserId = practitionerId,
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

            if (createdAbsentee != null)
            {
                //Log to the history table for reassignment back to owner user after absentee end date
                _reassignmentService.AddReassignmentForPractitioner(practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classroomGroupId, false, absentDateEnd, isRoleAssign, absentee.Id.ToString());

                //send notifications a) Absentee, b) long leave
                var userToSend = _userManager.FindByIdAsync(practitionerId).Result;
                List<TagsReplacements> replacements = new List<TagsReplacements>();
                var parentUser = _hierarchyEngine.GetUserParentUserId(practitionerId);
                if (parentUser != null)
                {
                    var parentToSend = _userManager.FindByIdAsync(parentUser).Result;

                    replacements.Add(new TagsReplacements()
                    {
                        FindValue = "PrincipalName",
                        ReplacementValue = parentToSend.FirstName
                    });
                }
                else {
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
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.PractitionerMarkedAbsent, DateTime.Now, userToSend, "", MessageStatusConstants.Blue, replacements);
            }

            return createdAbsentee;
        }

        public Absentees EditAbsentee(
            string absenteeId,
            bool deleteAbsentee = false,
            string reassignedToPractitioner = null,
            string reason = null,
            DateTime? absentDate = null,           
            DateTime? absentDateEnd = null)
        {
            if (absenteeId != null) {
                var absentee = _absenteeRepo.GetById(Guid.Parse(absenteeId));

                if (absentee != null)
                {
                    if (deleteAbsentee)
                    {
                        absentee.IsActive = false;
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

                        if (reason != null)
                            absentee.Reason = reason;
                    }
                    _absenteeRepo.Update(absentee);
                    return absentee;
                }
            }
            return null;
        }

            public List<AbsenteeDetail> GetAbsenteeByUser(string userId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var classRoomRepo = _repositoryFactory.CreateGenericRepository<ClassroomGroup>(userContext: _applicationUserId);
            List<AbsenteeDetail> absenteeDetails = new List<AbsenteeDetail>();

            var absentees = _absenteeRepo.GetAll().Where(a => a.UserId.Equals(userId)).ToList();
            if (startDate != null)
            {
                absentees = absentees.Where(a => a.AbsentDate >= startDate).ToList();
            } else
            {
                absentees = absentees.Where(a => a.AbsentDate >= DateTime.Now.Date).ToList();
            }
            if (endDate != null)
            {
                absentees = absentees.Where(a => a.AbsentDate <= endDate).ToList();
            }

            if (absentees.Any() )
            {
                foreach (var item in absentees)
                {
                    string classRoomName = "";
                    string reassignedToPerson = "";
                    if (item.ReassignedClass!= null)
                    {
                        var classRoom = classRoomRepo.GetAll().Where(c => c.Id.ToString() == item.ReassignedClass && c.Name != "Unsure").FirstOrDefault();
                        if (classRoom != null)
                        {
                            classRoomName = classRoom.Name;
                        }
                    }
                    if (item.ReassignedToPractitioner!=null)
                    {
                        var user = _userManager.FindByIdAsync(item.ReassignedToPractitioner).Result;
                        if (user != null)
                        {
                            reassignedToPerson = user.FirstName + " " + user.Surname;
                        }
                    }

                    absenteeDetails.Add(new AbsenteeDetail() { 
                        AbsenteeId = item.Id.ToString(),
                        Reason = item.Reason, 
                        AbsentDate = item.AbsentDate,
                        AbsentDateEnd = item.AbsentDateEnd,
                        ClassName = classRoomName,
                        ReassignedToPerson = reassignedToPerson,
                        ReassignedToUserId = item.ReassignedToPractitioner
                    });
                }
            }


            return absenteeDetails;

        }

        public int GetAbsenteeCountByUser(string userId)
        {
            var startCount = DateTime.Now.GetStartOfPreviousMonth();
            var endCount = DateTime.Now.GetStartOfMonth();
            var absentees = _absenteeRepo.GetAll()
                .Where(a => a.UserId.Equals(userId))
                .Where(a => a.AbsentDate < endCount && a.AbsentDate >= startCount)
                .Where(a => a.AbsentDateEnd.HasValue == false || (a.AbsentDateEnd.HasValue && (a.AbsentDate.Date == a.AbsentDateEnd.Value.Date)))
                .ToList();

            return absentees.Count;
        }
    }
}
