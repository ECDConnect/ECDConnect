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

        #endregion
    }
}
