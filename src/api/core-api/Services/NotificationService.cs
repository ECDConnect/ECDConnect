using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System.Threading.Tasks;
using System;
using ECDLink.DataAccessLayer.Entities.Notifications;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;
using System.Linq;
using System.Collections.Generic;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Identity;

namespace EcdLink.Api.CoreApi.Services
{
    public class NotificationService : INotificationService
    {
        private INotificationProviderFactory<ApplicationUser> _notificationProviderFactory;
        private ISystemSetting<InvitationOptions> _options;
        private readonly IGenericRepositoryFactory _repositoryFactory;
        private readonly HierarchyEngine _hierarchyEngine;
        private IGenericRepository<MessageLog, Guid> _messageRepo;
        private IGenericRepository<MessageTemplate, Guid> _templateRepo;
        private IHttpContextAccessor _contextAccessor;
        private string _uId;
        private UserManager<ApplicationUser> _userManager;

        /*
         1 - function is invoked and called with a template type, the template type defines the protocol, singular or multiple
        2 - a messaglog entry is set with the protocols an dthe templates called
        3 - if its a hub or a push message - signalr is invoked
        4 - the TO can be a user or a role like practitioners/coach/principal etc
         
         */


        public NotificationService(INotificationProviderFactory<ApplicationUser> notificationProviderFactory, 
            ISystemSetting<InvitationOptions> optionAccessor, 
            IHttpContextAccessor contextAccessor, 
            IGenericRepositoryFactory repositoryFactory, 
            HierarchyEngine hierarchyEngine, 
            
            [Service] UserManager<ApplicationUser> userManager)
        {
            _contextAccessor = contextAccessor;
            _notificationProviderFactory = notificationProviderFactory;
            _options = optionAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _uId = _contextAccessor.HttpContext != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId();
            _templateRepo = _repositoryFactory.CreateGenericRepository<MessageTemplate>(userContext: _uId);
            _messageRepo = _repositoryFactory.CreateGenericRepository<MessageLog>(userContext: _uId);
            _userManager = userManager;
        }

        public async Task<List<MessageTemplate>> RetrieveTemplate(string template)
        {
            return _templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, template)).ToList();
        }

        public async Task<bool> SendNotificationAsync(string userType, string templatetype, ApplicationUser user = null, string message = "")
        {
            bool bNeedsMapping = false;
            var template = await RetrieveTemplate(templatetype);

            if (template != null)
            {
                foreach (var item in template)
                {
                    if (item.Message.Contains("[[") || item.Subject.Contains("[["))
                    {
                        bNeedsMapping = true; 
                    }

                    switch (item.Protocol)
                    {
                        case MessageTypeConstants.SMS:
                            await SendSMSAsync(user, userType, item);
                            break;
                        case MessageTypeConstants.EMAIL:
                            await SendEmailAsync(user, userType, item);
                            break;
                        case MessageTypeConstants.HUB:
                            await SendHubMessageAsync(user, userType, item, message);
                            break;
                        case MessageTypeConstants.PUSH:
                            await SendHubMessageAsync(user, userType, item, message);
                            break;
                        default:
                            break;
                    }
                }
            }
            return true;
        }

        private async Task SendEmailAsync(ApplicationUser user, string group, MessageTemplate template)
        {
            //var encodedToken = TokenHelper.EncodeToken(token);

            //var invitationUrl = $"{_options.Value.AdminSignup}/{encodedToken}";
            //var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            //var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            //string firstName = user.FirstName;

            //var notificationProvider = _notificationProviderFactory.Create(user);

            //await notificationProvider
            //  .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
            //  .SendMessageAsync();
            await CommitNotification(user.Id, template, template.Subject, template.Message);
        }

        private async Task SendSMSAsync(ApplicationUser user, string group, MessageTemplate template)
        {
            //var encodedToken = TokenHelper.EncodeToken(token);

            //var invitationUrl = $"{_options.Value.AdminSignup}/{encodedToken}";
            //var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            //var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            //string firstName = user.FirstName;

            //var notificationProvider = _notificationProviderFactory.Create(user);

            //await notificationProvider
            //  .SetMessageTemplate(TemplateTypeEnum.AdminPortalInvitation)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.InvitationLink, invitationUrl)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.FirstName, firstName)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.ApplicationName, applicationName)
            //  .AddOrUpdateFieldReplacement(MessageTemplateConstants.OrganisationName, organisationName)
            //  .SendMessageAsync();
            await CommitNotification(user.Id, template, template.Subject, template.Message);
        }

        private async Task SendHubMessageAsync(ApplicationUser user, string group, MessageTemplate template, string message)
        {
            await CommitNotification(user != null ? user.Id : group, template, template.Subject, message);
        }

        private async Task SendPushMessageAsync(ApplicationUser user, string group, MessageTemplate template, string message)
        {
            await CommitNotification(user.Id, template, template.Subject, message);
        }

        private async Task CommitNotification(string toRecipient, MessageTemplate notification, string subject, string message)
        {
            try
            {
                _messageRepo.Insert(new MessageLog() { Id = Guid.NewGuid(), FromUserId = Guid.Parse(_uId), To = toRecipient, InsertedDate = DateTime.Now, IsActive = true, MessageProtocol = notification.Protocol, MessageTemplateType = notification.TemplateType, Message = message, Subject = subject  });
            } catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<bool> DisableNotification(string notificationId)
        {
            if (notificationId != null)
            {
                var notification = _messageRepo.GetById(Guid.Parse(notificationId));
                notification.IsActive = false;
                _messageRepo.Update(notification);
            }
            return true;
        }

    }
}
