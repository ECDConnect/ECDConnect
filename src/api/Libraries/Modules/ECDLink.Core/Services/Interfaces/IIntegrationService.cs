using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIntegrationService
    {
        Task<bool> IntegrationByMappedCoach(string franchiseeId = null, string coachId = null);
        Task<bool> IntegrationByFranchisees();
        Task<bool> IntegrationClubsData();
        Task<bool> PullPQAData(string franchiseeId = null);
        Task<bool> PullSmartSpaceVisitsData();
        Task<bool> IntegrationStatementsData();
        Task<bool> IntegrationAttendanceByDueData();
        Task<bool> IntegrationUpdates();
        Task<bool> IntegrationByTrainees();
        Task<bool> AutoSubmitStatements();
        Task<bool> IntegrationByNewCoach(string remoteCoachId);
    }
}
