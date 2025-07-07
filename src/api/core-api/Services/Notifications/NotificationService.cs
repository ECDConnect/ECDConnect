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

        public async Task<List<MessageTemplate>> RetrieveTemplate(string template, string protocol)
        {            
            if (protocol != "") {
                return _templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, template) && x.IsActive == true && x.Protocol == protocol).OrderBy(x => x.Protocol).ToList();
            }
            return _templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, template) && x.IsActive == true).OrderBy(x => x.Protocol).ToList();
        }

        public async Task<bool> NotificationExists(Notification notification, bool excludeDates = false, string searchCriteria = null)
        {
            var relatedEntityIds = notification.RelatedEntities != null 
                ? notification.RelatedEntities.Select(x => x.RelatedToEntityId).ToList()
                : new List<Guid>();

            var query = _messageRepo.GetAll()
                .Where(x =>
                    x.MessageProtocol == notification.MessageProtocol
                    && x.MessageTemplateType == notification.MessageTemplateType
                    && x.To == notification.To
                    && x.IsActive
                    && x.Action == notification.Action
                    && (string.IsNullOrEmpty(searchCriteria) || x.Subject.Contains(searchCriteria) || x.Message.Contains(searchCriteria)));

            if (!excludeDates)
            {
                query = query.Where(x => x.MessageDate.Value.Date == notification.MessageDate.Value.Date);
            }

            var matchingMessages = query.ToList();

            if (!matchingMessages.Any())
            {
                return false;
            }

            // Check related entities
            var anyWithMatchingEntities = matchingMessages.Any(x =>
                    x.MessageLogRelatedTos.All(y => relatedEntityIds.Contains(y.RelatedEntityId))
                    && relatedEntityIds.All(y => x.MessageLogRelatedTos.Any(z => z.RelatedEntityId == y)));

            return anyWithMatchingEntities;

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
            List<RelatedEntity> relatedEntities = null,
            Guid? groupingId = null,
            string protocol = "")
        {
            try
            {                
                var templates = await RetrieveTemplate(templatetype, protocol);

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
                            RelatedEntities = relatedEntities ?? new List<RelatedEntity>(),
                            GroupingId = groupingId,
                        };
                        if (messageEndDate != null)
                        {
                            notification.MessageEndDate = messageEndDate.Value.AddDays(1).Date;
                        }
                        //skip if the enotification exists already for same date and person and template and protocol
                        var isAvailable = await NotificationExists(notification, dontSendIfExists, searchCriteria);

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
            if (notification.To == null)
            {
                return null;
            }
                
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
                MessageLogRelatedTos = notification.RelatedEntities != null ? notification.RelatedEntities.Select(x => new MessageLogRelatedTo
                {
                    RelatedEntityId = x.RelatedToEntityId,
                    EntityType = x.EntityType,
                }).ToList()
                : new List<MessageLogRelatedTo>(),
                GroupingId = notification.GroupingId,
            });
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

        public async Task<bool> DeleteAllNotificationsForTypeAndDate(string userId, string templatetype, DateTime? messageDate)
        {
            if (userId != null)
            {
                var notifications = _messageRepo.GetAll().Where(x => x.To.Equals(userId) && 
                                                                x.MessageTemplateType == templatetype &&
                                                                x.MessageDate.HasValue && x.MessageDate.Value.Date == messageDate.Value.Date).ToArray();
                foreach (var notification in notifications)
                {
                    _messageRepo.Delete(notification.Id);
                }
            }
            return true;
        }

        public async Task<bool> DeleteAllNotificationsRelatedToEntity(Guid entityId)
        {
            var notifications = _messageRepo.GetAll().Where(x => x.MessageLogRelatedTos.Any(x => x.RelatedEntityId == entityId)).ToList();
            foreach (var notification in notifications)
            {
               notification.MessageEndDate = DateTime.Now;
               notification.UpdatedDate = DateTime.Now;
               notification.IsActive = false;
               _messageRepo.Update(notification);
            }
            return true;
        }

        public void DeleteGroupNotifications(Guid groupingId)
        {
            var notifications = _messageRepo.GetAll().Where(x => x.GroupingId.HasValue && x.GroupingId.Value == groupingId).ToList();
            foreach (var notification in notifications)
            {
                _messageRepo.Delete(notification.Id);
            }
        }

        public void DeleteGroupNotifications(string templateType, Guid relatedToEntityId)
        {
            var notifications = _messageRepo.GetAll()
                .Where(x => 
                    x.MessageTemplateType == templateType 
                    && x.MessageLogRelatedTos.Any(x => x.RelatedEntityId == relatedToEntityId))
                .ToList();

            foreach (var notification in notifications)
            {
                _messageRepo.Delete(notification.Id);
            }
        }

        public async Task<bool> ExpireNotificationsTypesForUser(string userId, string templateType, string searchCriteria = null, string protocol = null, Guid? relatedToUserId = null)
        {
            if (userId != null && templateType != null)
            {
                var notifications = _messageRepo.GetAll()
                    .Where(n => 
                        n.To == userId 
                        && n.MessageTemplateType == templateType 
                        && (string.IsNullOrWhiteSpace(searchCriteria) || n.Subject.Contains(searchCriteria) || n.Message.Contains(searchCriteria) || n.Action.Contains(searchCriteria)) 
                        && (!relatedToUserId.HasValue || n.MessageLogRelatedTos.Any(x => x.RelatedEntityId == relatedToUserId) ))
                    .ToList();
                
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

        public async Task<bool> DisableNotficationsWithEndDateAsToday()
        {
            var today = DateTime.Now.Date;
            var notifications = _messageRepo.GetAll().Where(x => x.IsActive && x.MessageEndDate.Value.Date < today).ToArray();

            foreach (var notification in notifications)
            {
                await DisableNotification(notification.Id.ToString());
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
                        if (item == "practitioners_principals")
                        {
                            roleNames.Add("Principal");
                        }
                        if (item == "practitioners_non_principals")
                        {
                            roleNames.Add("Practitioner");
                        }
                        if (item == "coaches")
                        {
                            roleNames.Add("Coach");
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

        public List<MessageLog> GetMessages(string templateType, Guid relatedEntityId)
        {
            var messages = _messageRepo.GetAll()
                   .Where(n =>
                       n.MessageTemplateType == templateType
                       && n.IsActive == true
                       && n.ReadDate.HasValue == false
                       &&  n.MessageLogRelatedTos.Any(x => x.RelatedEntityId == relatedEntityId))
                   .ToList();

            return messages;
        }

        public List<MessageLog> GetMessagesForUser(string userId, string templateType, Guid relatedEntityId)
        {
            var messages = _messageRepo.GetAll()
                   .Where(n =>
                       n.MessageTemplateType == templateType
                       && n.To == userId
                       &&  n.MessageLogRelatedTos.Any(x => x.RelatedEntityId == relatedEntityId))
                   .ToList();

            return messages;
        }
    }
}
