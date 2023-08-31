using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System.Threading.Tasks;
using EcdLink.Api.CoreApi.Services;

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
        public async Task<bool> IntegrationPQASmartSpaceVisitsData([Service] IIntegrationService integrationService)
        {
            return await integrationService.PullPQAData();
        }
        public async Task<bool> IntegrationStatementsData([Service] IIntegrationService integrationService)//IIntegrationService
        {
            return await integrationService.IntegrationStatementsData();
        }
        public async Task<bool> IntegrationAttendanceData([Service] IIntegrationService integrationService)//IIntegrationService
        {
            return await integrationService.IntegrationAttendanceData();
        }
        public async Task<bool> IntegrationUpdates([Service] IIntegrationService integrationService)
         {
            return await integrationService.IntegrationUpdates();
        }
        public async Task<bool> IntegrationByTrainees([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationByTrainees();
        }
        public async Task<bool> AutoSubmitStatements([Service] IIntegrationService integrationService)
        {
            return await integrationService.AutoSubmitStatements();
        }

        #endregion
    }
}
