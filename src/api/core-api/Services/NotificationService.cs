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
using ECDLink.Abstractrions.Enums;

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

        public async Task<bool> NotificationExists(Notification notification)
        {
            return _messageRepo.GetAll().Where(x => 
                string.Equals(x.MessageProtocol, notification.MessageProtocol) && 
                string.Equals(x.MessageTemplateType, notification.MessageTemplateType) && 
                string.Equals(x.To, notification.To) && 
                string.Equals(x.MessageProtocol, notification.MessageProtocol) &&
                x.MessageDate.Value.Date == notification.MessageDate.Value.Date
            ).Any();
            //check if any exact templates for exact person for exact same date and protocol exists
        }

        public async Task<bool> SendNotificationAsync(string userType, string templatetype, DateTime messageDate, ApplicationUser user = null, string message = "", string status = MessageStatusConstants.Blue, List<TagsReplacements> replacements = null, DateTime? messageEndDate = null)
        {
            try
            {

                bool bNeedsMapping = false;
                var templates = await RetrieveTemplate(templatetype);

                if (templates != null)
                {
                    foreach (var item in templates)
                    {
                        //remap all field
                        MessageTemplateText templateItem = RemapFields(item, user, replacements);

                        Notification notification = new Notification()
                        {
                            Id = Guid.NewGuid(),
                            MessageProtocol = item.Protocol,
                            Message = !string.IsNullOrWhiteSpace(message) ? message : templateItem.Message,
                            MessageDate = messageDate,
                            FromUserId = Guid.Parse(_uId),
                            MessageTemplateType = item.TemplateType,
                            MessageTemplate = item,
                            To = (user != null ? user.Id : userType),
                            Status = status
                        };
                        if (messageEndDate != null)
                        {
                            notification.MessageEndDate = messageEndDate;
                        }
                        //skip if the enotification exists already for same date and person and template and protocol
                        if (!await NotificationExists(notification))
                        {
                            switch (item.Protocol)
                            {
                                case MessageTypeConstants.SMS:
                                    await SendSMSAsync(notification, user, item);
                                    break;
                                case MessageTypeConstants.EMAIL:
                                    await SendEmailAsync(notification, user, item);
                                    break;
                                case MessageTypeConstants.HUB:
                                case MessageTypeConstants.PUSH:
                                    await SendHubMessageAsync(notification, user, item);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            } catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        private async Task SendEmailAsync(Notification notification, ApplicationUser user, MessageTemplate template)
        {
            //convert str to enum
            TemplateTypeEnum templateType = (TemplateTypeEnum)Enum.Parse(typeof(TemplateTypeEnum), template.TypeCode.ToString());
            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
                .SetMessageMapped(templateType, notification.Subject, notification.Message)
                .SendMessageAsync();
            await CommitNotification(notification, template);
        }

        private async Task SendSMSAsync(Notification notification, ApplicationUser user,  MessageTemplate template)
        {
            //convert str to enum
            TemplateTypeEnum templateType = (TemplateTypeEnum)Enum.Parse(typeof(TemplateTypeEnum), template.TypeCode.ToString());
            var notificationProvider = _notificationProviderFactory.Create(user);
            await notificationProvider
              .SetMessageMapped(templateType, notification.Subject, notification.Message)
              .SendMessageAsync();
            await CommitNotification(notification, template);
        }

        private async Task SendHubMessageAsync(Notification notification, ApplicationUser user, MessageTemplate template)
        {
            await CommitNotification(notification, template);
        }

        private async Task SendPushMessageAsync(Notification notification, ApplicationUser user, MessageTemplate template)
        {
            await CommitNotification(notification, template);
        }

        public async Task CommitNotification(Notification notification, MessageTemplate template)
        {
            try
            {                
               _messageRepo.Insert(new MessageLog() { Id = Guid.NewGuid(), FromUserId = notification.FromUserId, To = notification.To, InsertedDate =DateTime.Now, IsActive = true, MessageProtocol = notification.MessageProtocol, MessageTemplateType = notification.MessageTemplate.TemplateType, Message = notification.Message, Subject = notification.Subject, MessageDate = notification.MessageDate, MessageEndDate = notification.MessageEndDate, Status = notification.Status, SentByUserId = notification.FromUserId });
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
        public async Task<bool> ExpireNotification(string notificationId)
        {
            if (notificationId != null)
            {
                var notification = _messageRepo.GetById(Guid.Parse(notificationId));
                notification.MessageEndDate = DateTime.Now;
                _messageRepo.Update(notification);
            }
            return true;
        }

        private MessageTemplateText RemapFields(MessageTemplate template, ApplicationUser user, List<TagsReplacements> replacements)
        {
            //iterate through all placeholders, figure out which one it is and replace it based on the the placeholder name in 
            //setup some basics on all messages
            string subject = template.Subject;
            string message = template.Message;

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            if (replacements == null)
            {
                replacements = new List<TagsReplacements>();
            }

            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.FirstName, ReplacementValue = firstName });
            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.ApplicationName, ReplacementValue = applicationName });
            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.OrganisationName, ReplacementValue = organisationName });
            //add all basic tags here

            foreach (var replacement in replacements)
            {
               subject = subject.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);
               message = message.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);

            }

            return new MessageTemplateText() { Message = message, Subject = subject };
        }

    }
}
