using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using System.Threading.Tasks;

namespace ECDLink.Core.Services
{
    public class NotificationTasksService : INotificationTasksService
    {
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;

        public NotificationTasksService(
            IGenericRepositoryFactory repositoryFactory,
            HierarchyEngine hierarchyEngine)
        {
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
        }

        public void DailyUnassignedClassesNotification()
        {
            var adminId = _hierarchyEngine.GetAdminUserId();
            //var dbRepo = _repositoryFactory.CreateGenericRepository<ClassReassignmentHistory>(userContext: adminId);
            ////get all entries that ha snot yet been reassigned back to where they should be
            //var reassignments = dbRepo.GetAll()
            //                            .Where(x => x.ReassignedBackToDate == null)
            //                            .ToList();

            //if (reassignments.Count > 0)
            //{
            //    foreach (var reassign in reassignments)
            //    {
            //        if (reassign.ReassignedToDate <= DateTime.Now.AddHours(-hrsToReassign))
            //        {
            //            ReassignClassroomsFromHistory(adminId, reassign.UserId);
            //        }
            //    }
            //}
        }

    }
}
