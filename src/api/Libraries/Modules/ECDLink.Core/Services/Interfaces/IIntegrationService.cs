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
        Task<bool> PullSmartSpaceVisitsData();
        Task<bool> PushSmartSpaceVisitsData(Guid visitId, Guid traineeId, string traineeUserId, string coachUserId);
        Task IntegrationStatementsData();
        Task IntegrationAttendanceByDueData();
        Task PushMonthlyAttendancePdf();
        Task<bool> IntegrationUpdates();
        Task<bool> IntegrationByTrainees();
        Task AutoSubmitStatements();
        Task<bool> IntegrationByNewCoach(string remoteCoachId);
        Task IntegrationLeagueData();
    }
}
