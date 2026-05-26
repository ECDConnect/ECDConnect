using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace EcdLink.Api.CoreApi.Services
{
    public class AutomatedProcessService : IAutomatedProcessService
    {
        private IGenericRepository<PractitionerRemovalHistory, Guid> _removalRepo;
        private IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private IGenericRepository<ClassroomGroup, Guid> _classroomGroupRepo;
        private IGenericRepository<ClassProgramme, Guid> _classroomProgrammeRepo;
        private IGenericRepository<Absentees, Guid> _absenteeRepo;
        private IGenericRepository<ClassReassignmentHistory, Guid> _reassignmentsRepo;
        private ILogger<AutomatedProcessService> _logger;

        private string _adminUserId;
        private ApplicationUserManager _userManager;
        private AuthenticationDbContext _dbContext;
        INotificationService _notificationService;
        private IReassignmentService _reassignmentService;

        public AutomatedProcessService(
            IGenericRepositoryFactory repoFactory,
            HierarchyEngine hierarchyEngine,
            ApplicationUserManager userManager,
            AuthenticationDbContext dbContext,
            INotificationService notificationService,
            IReassignmentService reassignmentService
            )
        {
            _adminUserId = hierarchyEngine.GetAdminUserId()?.ToString();
            _removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: _adminUserId);
            _practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: _adminUserId);
            _classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: _adminUserId);
            _classroomProgrammeRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: _adminUserId);
            _absenteeRepo = repoFactory.CreateGenericRepository<Absentees>(userContext: _adminUserId);
            _reassignmentsRepo = repoFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: _adminUserId);

            _userManager = userManager;
            _dbContext = dbContext;
            _notificationService = notificationService;
            _reassignmentService = reassignmentService;
        }

        public void ProcessPractitionerRemovals()
        {
            var today = DateTime.Now.Date;
            DateTime tomorrow = today.AddDays(1);

            var removals = _removalRepo.GetAll()
                .Where(x => x.IsActive && x.DateOfRemoval < tomorrow)
                .ToList();

            foreach (var removal in removals)
            {
                var practitioner = _practitionerRepo.GetByUserId(removal.UserId.ToString());
                var user = _userManager.FindByIdAsync(removal.UserId.ToString()).Result;

                var absenteesDueToAssign = _absenteeRepo.GetAll()
                            .Where(x => x.AbsentDate.Date <= DateTime.Now.Date && x.IsActive == true) //less than now because of backdating leave
                            .Where(x => x.CompletedDate == null && x.AssignedDate == null)
                            .Where(x => x.UserId == practitioner.UserId)
                            .ToList();
                if (absenteesDueToAssign.Any())
                {
                    foreach (var item in absenteesDueToAssign)
                    {
                        try
                        {
                            var reassignmentsStart = _reassignmentsRepo.GetAll()
                            .Where(x => x.ReassignedBackToDate == null)
                            .Where(x => x.AbsenteeId.Equals(item.Id)).FirstOrDefault();
                            if (reassignmentsStart != null)
                            {
                                _reassignmentService.ProcessReassignments(reassignmentsStart.Id, false);
                                item.AssignedDate = DateTime.Now; //mark that the assignment process has started and is excluded from reruns which reset the dates
                                item.UpdatedDate = DateTime.Now;
                                item.UpdatedBy = _adminUserId;
                                item.CompletedDate = DateTime.Now;
                                _absenteeRepo.Update(item);
                                // remove linked notifications
                                _notificationService.ExpireNotificationsTypesForUser(removal.UserId.ToString(), TemplateTypeConstants.ProgrammeInvitation);
                                _notificationService.ExpireNotificationsTypesForUser(removal.UserId.ToString(), TemplateTypeConstants.ReassignedToNewClass);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "ProcessPractitionerRemovals: reassignClasses: {id} {ex}", item.Id, ex.Message);
                        }
                    }
                }

                var classroomGroups = _classroomGroupRepo.GetAll().Where(x => x.IsActive && x.UserId == removal.UserId && x.ClassroomId == removal.ClassroomId).ToList();
                var classroomGroupIds = classroomGroups.Select(x => x.Id).ToList();
                var classroomProgrammes = _classroomProgrammeRepo.GetAll().Where(x => classroomGroupIds.Contains((Guid)x.ClassroomGroupId)).ToList();

                if (practitioner != null && user != null)
                {
                    //practitioner.CoachHierarchy = null;
                    practitioner.PrincipalHierarchy = null;
                    practitioner.DateToBeRemoved = DateTime.Now;
                    practitioner.IsLeaving = true;
                    practitioner.UpdatedBy = _adminUserId;
                    practitioner.UpdatedDate = DateTime.Now;
                    _practitionerRepo.Update(practitioner);

                    removal.IsActive = false;
                    removal.UpdatedBy = _adminUserId;
                    _removalRepo.Update(removal);

                    // remove linked classes && programmes
                    if (classroomGroups.Any())
                    {
                        _dbContext.ClassProgrammes.RemoveRange(classroomProgrammes);
                        _dbContext.ClassroomGroups.RemoveRange(classroomGroups);
                    }

                    // remove linked notifications 
                    _notificationService.ExpireNotificationsTypesForUser(removal.UserId.ToString(), TemplateTypeConstants.ProgrammeInvitation);
                    _notificationService.ExpireNotificationsTypesForUser(removal.UserId.ToString(), TemplateTypeConstants.ReassignedToNewClass);
                }

            }
        }
    }
}

