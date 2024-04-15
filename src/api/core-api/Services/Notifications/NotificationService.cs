using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Abstractrions.Notifications;
using ECDLink.Core.Services.Interfaces;
using ECDLink.Core.SystemSettings.SystemOptions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        private Guid _uId;
        private ApplicationUserManager _userManager;
        private ILogger<NotificationService> _logger;

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
            [Service] ApplicationUserManager userManager,
            [Service] ILogger<NotificationService> logger
            )
        {
            _contextAccessor = contextAccessor;
            _notificationProviderFactory = notificationProviderFactory;
            _options = optionAccessor;
            _repositoryFactory = repositoryFactory;
            _hierarchyEngine = hierarchyEngine;
            _uId = _contextAccessor.HttpContext != null && _contextAccessor.HttpContext.GetUser() != null ? _contextAccessor.HttpContext.GetUser().Id : _hierarchyEngine.GetAdminUserId().GetValueOrDefault();
            _templateRepo = _repositoryFactory.CreateGenericRepository<MessageTemplate>(userContext: _uId);
            _messageRepo = _repositoryFactory.CreateGenericRepository<MessageLog>(userContext: _uId);
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<List<MessageTemplate>> RetrieveTemplate(string template)
        {            
            return _templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, template) && x.IsActive == true).OrderBy(x => x.Protocol).ToList();
        }

        public async Task<bool> NotificationExists(Notification notification, bool excludeDates = false, string searchCriteria = null)
        {
            if (!excludeDates)
            {
                return _messageRepo.GetAll().Where(x =>
                    string.Equals(x.MessageProtocol, notification.MessageProtocol) &&
                    string.Equals(x.MessageTemplateType, notification.MessageTemplateType) &&
                    string.Equals(x.To, notification.To) &&
                    string.Equals(x.IsActive, true) &&
                    string.Equals(x.Action, notification.Action) &&
                    string.Equals(x.MessageProtocol, notification.MessageProtocol) &&
                    string.Equals(x.RelatedToUserId, notification.RelatedToUserId) &&
                      (!string.IsNullOrEmpty(searchCriteria) ? x.Subject.Contains(searchCriteria) || x.Message.Contains(searchCriteria) : string.Equals(x.IsActive, true)) &&
                    x.MessageDate.Value.Date == notification.MessageDate.Value.Date
                ).Any();
            } else
            {
                return _messageRepo.GetAll().Where(x =>
                    string.Equals(x.MessageProtocol, notification.MessageProtocol) &&
                    string.Equals(x.MessageTemplateType, notification.MessageTemplateType) &&
                    string.Equals(x.To, notification.To) &&
                    string.Equals(x.IsActive, true) &&
                    string.Equals(x.Action, notification.Action) &&
                    (!string.IsNullOrEmpty(searchCriteria) ? x.Subject.Contains(searchCriteria) || x.Message.Contains(searchCriteria) : string.Equals(x.IsActive, true)) &&
                    string.Equals(x.RelatedToUserId, notification.RelatedToUserId) &&
                    string.Equals(x.MessageProtocol, notification.MessageProtocol)

                ).Any();
            }
            //check if any exact templates for exact person for exact same date and protocol exists
        }

        public async Task<bool> SendNotificationAsync(
        string userType, 
        string templatetype, 
        DateTime messageDate, 
        ApplicationUser user = null, 
        string message = "", 
        string status = MessageStatusConstants.Blue, 
        List<TagsReplacements> replacements = null, 
        DateTime? messageEndDate = null, 
        bool expireOldMessagesOfType = false, 
        bool dontSendIfExists = false, 
        string searchCriteria = null, 
        string relatedToUserId = null)
        {
            try
            {                
                var templates = await RetrieveTemplate(templatetype);

                if (templates != null)
                {
                    foreach (var item in templates)
                    {
                        //expire older messages of the same type when new ones are sent
                        if (expireOldMessagesOfType && user != null) {
                            await this.ExpireNotificationsTypesForUser(user.Id.ToString(), item.TemplateType, null, item.Protocol);
                        }

                        //remap all field
                        MessageTemplateText templateItem = RemapFields(item, user, replacements);

                        Notification notification = new Notification()
                        {
                            Id = Guid.NewGuid(),
                            MessageProtocol = item.Protocol,
                            Message = !string.IsNullOrWhiteSpace(message) ? message : templateItem.Message,
                            Subject = templateItem.Subject,
                            MessageDate = messageDate.Date,
                            FromUserId = _uId,
                            MessageTemplateType = item.TemplateType,
                            MessageTemplate = item,
                            To = (user != null ? user.Id.ToString() : userType),
                            Status = status,
                            CTA = templateItem.CTA,
                            CTAText = templateItem.CTAText,
                            Action = templateItem.Action,
                            RelatedToUserId = relatedToUserId,
                        };
                        if (messageEndDate != null)
                        {
                            notification.MessageEndDate = messageEndDate.Value.AddDays(1).Date;
                        }
                        //skip if the enotification exists already for same date and person and template and protocol
                        if (!await NotificationExists(notification, dontSendIfExists, searchCriteria))
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
                                case MessageTypeConstants.PORTAL:
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
                _logger.LogError("Issue in SendNotificationAsync for template " + templatetype + " message: " + ex.Message, ex);
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
            await CommitNotification(notification, template); //commit first, entities are null after sms has been sent
            //convert str to enum
            TemplateTypeEnum templateType = (TemplateTypeEnum)Enum.Parse(typeof(TemplateTypeEnum), template.TypeCode.ToString());
            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            string firstName = user.FirstName;

            var notificationProvider = _notificationProviderFactory.Create(user);

            await notificationProvider
                .SetMessageMapped(templateType, notification.Subject, notification.Message)
                .SendMessageAsync();
        }

        private async Task SendHubMessageAsync(Notification notification, ApplicationUser user, MessageTemplate template)
        {
            await CommitNotification(notification, template);
        }

        private async Task SendPushMessageAsync(Notification notification, ApplicationUser user, MessageTemplate template)
        {
            await CommitNotification(notification, template);
        }

        public async Task<MessageLog> CommitNotification(Notification notification, MessageTemplate template)
        {
           try
            {
                if (notification.To != null)
                {
                    return _messageRepo.Insert(new MessageLog()
                    {
                        Id = Guid.NewGuid(),
                        From = notification.FromUserId.ToString(),
                        FromUserId = notification.FromUserId,
                        To = notification.To,
                        InsertedDate = DateTime.Now,
                        IsActive = true,
                        MessageProtocol = notification.MessageProtocol,
                        MessageTemplateType = notification.MessageTemplate.TemplateType,
                        Message = notification.Message,
                        Subject = notification.Subject,
                        MessageDate = notification.MessageDate.Value,
                        MessageEndDate = notification.MessageEndDate, //midnight the next day
                        Status = notification.Status,
                        SentByUserId = notification.FromUserId,
                        CTA = notification.CTA,
                        CTAText = notification.CTAText,
                        ToGroups = notification.ToGroups,
                        Action = notification.Action,
                        RelatedToUserId = notification.RelatedToUserId,
                    });
                } else return null;
           } catch (Exception ex)
           {
               throw ex;                
           }

        }

        public async Task<bool> SendGenericMessage(string to, string toGroups, string message, string subject, DateTime sendDate, MessageTemplate template, DateTime? messageEndDate = null)
        {
            Notification notification = new Notification()
            {
                To = to,
                ToGroups = toGroups,
                Message = message,
                Subject = subject,
                MessageDate = sendDate,
                MessageEndDate = messageEndDate,
                FromUserId = _uId,
                MessageTemplate = template,
                MessageProtocol = template.Protocol,
                Status = MessageStatusConstants.Blue

            };
            await CommitNotification(notification, template);
            return true;
        }

        public async Task<bool> DisableNotification(string notificationId)
        {
            if (notificationId != null)
            {
                var notification = _messageRepo.GetById(Guid.Parse(notificationId));
                notification.IsActive = false;
                notification.MessageEndDate = DateTime.Now;
                notification.UpdatedDate = DateTime.Now;
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
                notification.UpdatedDate = DateTime.Now;
                _messageRepo.Update(notification);
            }
            return true;
        }

        public async Task<bool> DeleteAllNotificationsForUser(string userId)
        {
            if (userId != null)
            {
                var notifications = _messageRepo.GetAll().Where(x => x.To.Equals(userId)).ToList();
                foreach (var notification in notifications)
                {
                    _messageRepo.Delete(notification.Id);
                }
            }
            return true;
        }

        public async Task<bool> DeleteAllNotificationsRelatedToUser(string userId)
        {
            if (userId != null)
            {
                var notifications = _messageRepo.GetAll().Where(x => x.RelatedToUserId == userId).ToList();
                foreach (var notification in notifications)
                {
                    _messageRepo.Delete(notification.Id);
                }
            }
            return true;
        }

        public async Task<bool> ExpireNotificationsTypesForUser(string userId, string templateType, string searchCriteria = null, string protocol = null, string relatedToUserId = null)
        {
            if (userId != null && templateType != null)
            {
                var notifications = _messageRepo.GetAll().Where(n => n.To == userId && n.MessageTemplateType == templateType && (searchCriteria != null ? n.Subject.Contains(searchCriteria) || n.Message.Contains(searchCriteria) : n.IsActive == true) && (relatedToUserId != null ? n.RelatedToUserId.Contains(relatedToUserId) : n.IsActive == true)).ToList();
                if (notifications.Any())
                {
                    foreach (var notification in notifications)
                    {
                        if (protocol == null || (protocol != null && notification.MessageProtocol == protocol))                        
                            await DisableNotification(notification.Id.ToString());
                    }
                }
            }
            return true;
        }

        public async Task<bool> MarkAsReadNotification(string notificationId)
        {
            if (notificationId != null)
            {
                var notification = _messageRepo.GetById(Guid.Parse(notificationId));
                notification.ReadDate = DateTime.Now;
                _messageRepo.Update(notification);
            }
            return true;
        }

        public MessageTemplateText RemapFields(MessageTemplate template, ApplicationUser user, List<TagsReplacements> replacements)
        {
            if (replacements == null)
                replacements = new List<TagsReplacements>();
            //iterate through all placeholders, figure out which one it is and replace it based on the the placeholder name in 
            //setup some basics on all messages
            string subject = template.Subject;
            string message = template.Message;
            string ctaText = (template.CTAText != null ? template.CTAText : "");
            string cta = (template.CTA != null ? template.CTA : "");
            string action = (template.Action != null ? template.Action : "") ;//for replacing state guids

            var applicationName = TenantExecutionContext.Tenant.ApplicationName;
            var organisationName = TenantExecutionContext.Tenant.OrganisationName;
            var loginLink = TenantExecutionContext.Tenant.SiteAddress ;
            if (user != null)
            {
                string firstName = user.FirstName;
                replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.FirstName, ReplacementValue = firstName });
            }

            if (replacements == null)
            {
                replacements = new List<TagsReplacements>();
            }

            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.ApplicationName, ReplacementValue = applicationName });
            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.OrganisationName, ReplacementValue = organisationName });
            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.LoginLink, ReplacementValue = loginLink + "/login" });
            replacements.Add(new TagsReplacements() { FindValue = MessageTemplateConstants.LoginLinkShort, ReplacementValue = loginLink + "/login" });
            //add all basic tags here

            foreach (var replacement in replacements)
            {
                if (subject != null)
                {
                    subject = subject.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);
                }
               
               message = message.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);
                if (ctaText != "")
                    ctaText = ctaText.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);
                if (cta != "")
                    cta = cta.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);
                //replace action and state items
               if (action!="")
                    action = action.Replace("[[" + replacement.FindValue + "]]", replacement.ReplacementValue);
            }

            return new MessageTemplateText() { Message = message, Subject = subject, CTAText = ctaText, CTA = cta, Action = action };
        }

        public MessageLogModel RetrieveToGroupItems(string toGroups)
        {
            MessageLogModel model = new MessageLogModel();

            var toGroupsItems = toGroups.Split("|");
            var provinceId = "";
            var wardName = "";
            var districtId = "";
            var roleIds = new List<string>();
            var savedRoles = "";
            var roleNames = new List<string>();

            foreach (var toGroup in toGroupsItems)
            {
                if (toGroup.IndexOf("Province:") != -1)
                {
                    provinceId = toGroup.Split(':')[1];
                }

                if (toGroup.IndexOf("Ward:") != -1)
                {
                    wardName = toGroup.Split(':')[1];
                }

                if (toGroup.IndexOf("District:") != -1)
                {
                    districtId = toGroup.Split(':')[1];
                }

                if (toGroup.IndexOf("Role:") != -1)
                {
                    savedRoles = toGroup.Split(':')[1];
                    roleIds = savedRoles.Split(",").ToList();
                    foreach (var item in roleIds)
                    {
                        if (item == "trainees")
                        {
                            roleNames.Add("Trainees");
                        }
                        if (item == "practitioners_principals")
                        {
                            roleNames.Add("Practitioners - principals");
                        }
                        if (item == "practitioners_non_principals")
                        {
                            roleNames.Add("Practitioners - non-principals");
                        }
                        if (item == "coaches")
                        {
                            roleNames.Add("Coaches");
                        }
                        if (item == "chw")
                        {
                            roleNames.Add("CHWs");
                        }
                        if (item == "team_lead")
                        {
                            roleNames.Add("Team Lead");
                        }
                    }
                }
            }
            model.ProvinceId = provinceId;
            model.WardName = wardName;
            model.DistrictId = districtId;
            model.RoleIds = roleIds;
            model.RoleNames = string.Join(", ", roleNames);

            return model;

        }

    }
}
