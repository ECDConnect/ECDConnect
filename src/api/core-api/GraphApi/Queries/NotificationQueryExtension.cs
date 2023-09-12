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
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Franchisor") || x.ToGroups.Contains("Franchisor")).ToList();
                }
                else if (user?.coachObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Coach") || x.ToGroups.Contains("Coach")).ToList();
                }
                else if (user?.principalObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Principal") || x.ToGroups.Contains("Principal")).ToList();
                }
                else if (user?.practitionerObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Practitioner") || x.ToGroups.Contains("Practitioner")).ToList();
                }
                else if (user?.traineeObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "Trainee") || x.ToGroups.Contains("Trainee")).ToList();
                }
                else if (user?.traineeObjectData != null)
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "CHW") || x.ToGroups.Contains("CHW")).ToList();
                }
                else
                {
                    typeLogs = dbRepo.GetAll().Where(x => string.Equals(x.To, "AllUsers") || x.ToGroups.Contains("AllUsers")).ToList();
                }
                logs.AddRange(typeLogs);
            }

            foreach (var item in logs)
            {
                var template = templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, item.MessageTemplateType)).FirstOrDefault();
                string toGroups = item.ToGroups.Replace("Region:", "").Replace("Province:", "").Replace("Role:", ""); //Clean out group text for display
                notifications.Add(new Notification() { From = item.From, FromUserId = item.FromUserId, Id = item.Id, Message = item.Message, MessageProtocol = item.MessageProtocol, To = item.To, SentByUserId = item.SentByUserId, Subject = item.Subject, MessageTemplateType = item.MessageTemplateType, MessageTemplate = template, CTA = item.CTA, CTAText = item.CTAText, MessageDate = item.MessageDate, MessageEndDate = item.MessageEndDate, Status = item.Status, ToGroups = item.ToGroups, ReadDate = item.ReadDate  });

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
