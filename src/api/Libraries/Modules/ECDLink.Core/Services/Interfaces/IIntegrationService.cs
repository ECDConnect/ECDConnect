using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IIntegrationService
    {
        bool Enabled { get; }
        Task<bool> IntegrationByMappedCoach(string franchiseeId = null, string coachId = null, bool incompletOnly = false);
        Task<bool> IntegrationByFranchisees();
        Task<bool> IntegrationClubsData();
        Task<bool> PullPQAData(string franchiseeId = null);
        Task<bool> PullSmartSpaceVisitsData();
        Task IntegrationStatementsData();
        Task IntegrationAttendanceByDueData();
        Task PushMonthlyAttendancePdf();
        Task<bool> IntegrationUpdates();
        Task<bool> IntegrationByTrainees();
        Task AutoSubmitStatements();
        Task<bool> IntegrationByNewCoach(string remoteCoachId);
    }
}
