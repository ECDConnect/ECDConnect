using ECDLink.Core.Services.Interfaces;
using HotChocolate;
using HotChocolate.Types;
using System;
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
        public async Task<bool> IntegrationPQASmartSpaceVisitsData([Service] IIntegrationService integrationService)
        {
            return await integrationService.PullPQAData();
        }
        public async Task<bool> IntegrationStatementsData([Service] IIntegrationService integrationService)
        {
            await integrationService.IntegrationStatementsData();
            return true;
        }
        public async Task<bool> IntegrationAttendanceByDueData([Service] IIntegrationService integrationService)
        {
            await integrationService.IntegrationAttendanceByDueData();
            return true;
        }

        public async Task<bool> IntegrationMonthlyAttendancePdf([Service] IIntegrationService integrationService)
        {
            await integrationService.PushMonthlyAttendancePdf();
            return true;
        }

        public async Task<bool> IntegrationUpdates([Service] IIntegrationService integrationService)
         {
            return await integrationService.IntegrationUpdates();
        }
        public async Task<bool> IntegrationByTrainees([Service] IIntegrationService integrationService)
        {
            return await integrationService.IntegrationByTrainees();
        }
        public async Task AutoSubmitStatements([Service] IIntegrationService integrationService)
        {
            await integrationService.AutoSubmitStatements();
        }

        public async Task<bool> IntegrationByNewCoach([Service] IIntegrationService integrationService, string remoteCoachId)
        {
            return await integrationService.IntegrationByNewCoach(remoteCoachId);
        }

        public async Task<bool> IntegrationLeagueData([Service] IIntegrationService integrationService)
        {
            await integrationService.IntegrationLeagueData();
            return true;
        }

        #endregion
    }
}
