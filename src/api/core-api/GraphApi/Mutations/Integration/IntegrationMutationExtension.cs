using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations.Integration
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class IntegrationMutationExtension
    {
        #region Service Calls       

        public async Task<bool> IntegrationByMappedCoach([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationByMappedCoach();
        }

        public async Task<bool> IntegrationByFranchisees([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationByFranchisees();
        }
        public async Task<bool> IntegrationClubsData([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationClubsData();
        }
        public async Task<bool> IntegrationPQAData([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationPQAData();
        }
        public async Task<bool> IntegrationStatementsData([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationStatementsData();
        }
        public async Task<bool> IntegrationAttendanceData([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationAttendanceData();
        }

        #endregion
    }
}
