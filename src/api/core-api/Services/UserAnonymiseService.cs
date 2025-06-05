using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using HotChocolate;
using Microsoft.Extensions.Logging;
using System;

namespace EcdLink.Api.CoreApi.Services
{
    public class UserAnonymiseService
    {
        private readonly HierarchyEngine _hierarchyEngine;
        private ILogger<UserAnonymiseService> _logger;
        
        public UserAnonymiseService(
            IGenericRepositoryFactory repositoryFactory,
            IDocumentManagementService documentManagementService,
            HierarchyEngine hierarchyEngine,
            [Service] ApplicationUserManager userManager,
            ILogger<UserAnonymiseService> logger,
            [Service] INotificationService notificationService,
            [Service] AuthenticationDbContext context)
        {
            _hierarchyEngine = hierarchyEngine;
            _logger = logger;
        }

        public void AnonymiseUser(Guid userId, string userType)
        {
            var adminId = _hierarchyEngine.GetAdminUserId();

            try
            {
               
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AnonymiseUser Failed for Id: {0} on {1}", userId, ex.Message);
            }
        }

    }
}
