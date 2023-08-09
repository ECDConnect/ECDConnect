using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using System;
using ECDLink.DataAccessLayer.Entities.Users;

namespace ECDLink.Api.CoreApi.Services
{
    public class AbsenteeService : Interfaces.IAbsenteeService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly IReassignmentService _reassignmentService;

        public AbsenteeService(
            IGenericRepositoryFactory repositoryFactory,
            [Service] IReassignmentService reassignmentService)
        {
            _repositoryFactory = repositoryFactory;
            _reassignmentService = reassignmentService;
        }

        public Absentees AddAbsenteeForPractitioner(
            string uId,
            string practitionerId,
            string reassignedToPractitioner,
            string reason,
            DateTime absentDate,
            string loggedByUser,
            string classroomGroupId = null,
            Guid? practitionerRemovalHistory = null)
        {
            var absenteeRepo = _repositoryFactory.CreateRepository<Absentees>(userContext: uId);
            var updated = new Absentees();
            if (classroomGroupId != null)
            {
                reason = string.IsNullOrEmpty(reason) ? "Practitioner Marked Absent" : reason;
                var absent = new Absentees
                {
                    UserId = practitionerId,
                    Reason = reason,
                    AbsentDate = absentDate,
                    LoggedBy = loggedByUser,
                    ReassignedClass = classroomGroupId,
                    ReassignedToPractitioner = reassignedToPractitioner,
                    UpdatedBy = loggedByUser,
                    UpdatedDate = DateTime.Now,
                    PractitionerRemovalHistoryId = practitionerRemovalHistory
                };
                updated = absenteeRepo.Insert(absent);

                //Log to the history table for reassignment back to owner user
                _reassignmentService.AddReassignmentForPractitioner(uId, practitionerId, reassignedToPractitioner, reason, absentDate, loggedByUser, classroomGroupId, false);
            }

            //Save the history so it can be reassigned
            return updated;
        }
    }
}
