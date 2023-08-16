using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Helpers;
using ECDLink.Tenancy.Context;
using System.Threading.Tasks;
using System;
using ECDLink.DataAccessLayer.Entities.Notifications;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using System.Linq;

namespace EcdLink.Api.CoreApi.Managers.Notifications
{
    public class NotificationManager
    {
        private INotificationProviderFactory<ApplicationUser> _notificationProviderFactory;
        private ISystemSetting<InvitationOptions> _options;
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private IGenericRepository<MessageLog, Guid> _messageRepo;
        private IGenericRepository<MessageTemplate, Guid> _templateRepo;
        private IHttpContextAccessor _contextAccessor;
        private string _uId;



        public NotificationManager(INotificationProviderFactory<ApplicationUser> notificationProviderFactory, ISystemSetting<InvitationOptions> optionAccessor, IHttpContextAccessor contextAccessor, IGenericRepositoryFactory repositoryFactory, HierarchyEngine hierarchyEngine)
        {
            _contextAccessor = contextAccessor;
            _notificationProviderFactory = notificationProviderFactory;
            _options = optionAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _uId = (_contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId());
            _templateRepo = _repositoryFactory.CreateGenericRepository<MessageTemplate>(userContext: _uId);
        }

        public MessageTemplate RetrieveTemplate(string template)
        {
            return _templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, template)).FirstOrDefault();
        }

        public async Task SendNotificationAsync(ApplicationUser user, string templatetype)
        {
            var template = RetrieveTemplate(templatetype);

            //string firstName = user.FirstName;

            //var notificationProvider = _notificationProviderFactory.Create(user);


            //await notificationProvider
            //  .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
            //  .SendMessageAsync();
        }

        public async Task SendEmailAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var invitationUrl = $"{_options.Value.AdminSignup}/{encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }

        public async Task SendSMSAsync(ApplicationUser user, string token)
        {
            var encodedToken = TokenHelper.EncodeToken(token);

            var invitationUrl = $"{_options.Value.AdminSignup}/{encodedToken}";
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
              .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
              .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
              .SendMessageAsync();
        }
        
        public bool CommitNotification(string toRecipient,  MessageTemplate notification, string message)
        {
            _messageRepo.Insert(new MessageLog() { FromUserId = Guid.Parse(_uId), To = toRecipient, InsertedDate = DateTime.Now, IsActive = true, MessageProtocol = notification.Protocol, MessageTemplateType = notification.TemplateType });
            return true;
        }

    }
}
