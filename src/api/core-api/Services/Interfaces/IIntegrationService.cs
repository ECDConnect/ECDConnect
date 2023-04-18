using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Integration.MappedEntities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIntegrationService
    {
        //Task<List<IntegrationEntityMapping>> GetMappedEntities(string entityType);
        //Task<List<MappedCoach>> GetCoaches(string localFranchisorId);
        //Task<List<MappedFranchisee>> GetFranchiseesByCoach(string remoteCoachId);
        //Task<List<MappedChildCaregiver>> GetChildren(string remoteFranchiseeId);
        //Task<List<MappedChildCaregiver>> GetCareGivers(string remoteFranchiseeId);

        Task<bool> IntegrationByMappedCoach();
        //public void ReassignAbsentees();
        //public bool ReassignClassroomsFromHistory(string uId, string userId);

    }
}
