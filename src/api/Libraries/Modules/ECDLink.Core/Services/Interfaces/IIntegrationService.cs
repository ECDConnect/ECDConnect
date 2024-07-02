using System.Threading.Tasks;
using System;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIntegrationService
    {
        bool Enabled { get; }
        Task<bool> IntegrationByMappedCoach(string franchiseeId = null, string coachId = null, bool incompletOnly = false);
        Task<bool> IntegrationByFranchisees();
        Task<bool> IntegrationClubsData();
        Task<bool> PullPQAData(string franchiseeId = null);
        Task<bool> PushSmartSpaceVisitsData();
        Task<bool> PushPQAData();
        Task<bool> PushReAccreditationData();
        Task<bool> IntegrationUpdates();
        Task<bool> IntegrationByTrainees();        
        Task<bool> IntegrationByNewCoach(string remoteCoachId);
        Task IntegrationLeagueData();
    }
}
