using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class NotificationQueryExtension
    {
        public NotificationQueryExtension()
        {
        }

        [UseSorting]        
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<Notification> GetAllNotifications(
    [Service] IHttpContextAccessor contextAccessor,
    [Service] UserManager<ApplicationUser> userManager,
    IGenericRepositoryFactory repoFactory,
    string userId, bool inApp = true, string protocol = "")
        {
            List<Notification> notifications = new List<Notification>();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<MessageLog>(userContext: uId);
            var templateRepo = repoFactory.CreateGenericRepository<MessageTemplate>(userContext: uId);
            List<MessageLog> logs = dbRepo.GetAll().Where(x => string.Equals(x.To, userId) && x.IsActive==true && (x.MessageEndDate >= DateTime.Now.Date || x.MessageEndDate == null)).ToList();
            if (inApp)
            {
                logs = logs.Where(y => y.MessageProtocol.ToLower() == "push"  || y.MessageProtocol.ToLower() == "hub").ToList();
            }
            if (!string.IsNullOrWhiteSpace(protocol))
            {
                logs = logs.Where(y => y.MessageProtocol.ToLower() == protocol).ToList();
            }

            ApplicationUser user = userManager.FindByIdAsync(userId).Result;
            //even if there are no logs for the user specifically there might be notifications for the usertype
            if (user != null)
            {
                List<MessageLog> typeLogs = new List<MessageLog>();
                if (user?.franchisorObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Franchisor")).ToList();
                }
                else if (user?.coachObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Coach")).ToList();
                }
                else if (user?.principalObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Principal")).ToList();
                }
                else if (user?.practitionerObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Practitioner")).ToList();
                }
                else if (user?.traineeObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Trainee")).ToList();
                }
                else if (user?.traineeObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "CHW")).ToList();
                }
                else
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "AllUsers")).ToList();
                }
                logs.AddRange(typeLogs);
            }

            foreach (var item in logs)
            {
                var template = templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, item.MessageTemplateType)).FirstOrDefault();
                notifications.Add(new Notification() { From = item.From, FromUserId = item.FromUserId, Id = item.Id, Message = item.Message, MessageProtocol = item.MessageProtocol, To = item.To, SentByUserId = item.SentByUserId, Subject = item.Subject, MessageTemplateType = item.MessageTemplateType, MessageTemplate = template, CTA = item.CTA, CTAText = item.CTAText, MessageDate = item.MessageDate, MessageEndDate = item.MessageEndDate, Status = item.Status  });

            }

            return notifications;
        }

        public List<MessageTemplate> GetAllTemplates(
[Service] IHttpContextAccessor contextAccessor,
IGenericRepositoryFactory repoFactory, string templateId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<MessageTemplate>(userContext: uId);
            List<MessageTemplate> templates = dbRepo.GetAll().ToList();
            if (templateId != null)
                templates.Where(x => string.Equals(x.Id, templateId));
            return templates;
        }

    }
}
