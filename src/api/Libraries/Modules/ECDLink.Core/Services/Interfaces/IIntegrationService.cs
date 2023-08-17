using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces;
    public interface IIntegrationService
    {
        Task<bool> IntegrationByMappedCoach(string franchiseeId = null);
        Task<bool> IntegrationByFranchisees();
        Task<bool> IntegrationClubsData();
        Task<bool> IntegrationPQASmartSpaceVisitsData();
        Task<bool> IntegrationStatementsData();
        Task<bool> IntegrationAttendanceData();
        Task<bool> IntegrationUpdates();
        Task<bool> IntegrationByTrainees();
        Task<bool> AutoSubmitStatements();

    
}
