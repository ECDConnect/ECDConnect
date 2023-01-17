using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIntegrationService
    {
        Task<List<MappedCoach>> GetCoaches(string localFranchisorId);
        Task<List<MappedFranchisee>> GetFranchisees(string remoteCoachId);
        Task<List<MappedChildCaregiver>> GetChildren(string remoteFranchiseeId);
        //public void ReassignAbsentees();
        //public bool ReassignClassroomsFromHistory(string uId, string userId);

    }
}
