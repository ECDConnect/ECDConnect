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
using EcdLink.Api.CoreApi.Services;
using ECDLink.Tenancy.Context;
using ECDLink.Core.Services.Interfaces;

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
    [Service] INotificationService notificationService,
    IGenericRepositoryFactory repoFactory,
    string userId, bool inApp = true, string protocol = "")
        {
            List<Notification> notifications = new List<Notification>();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<MessageLog>(userContext: uId);
            var templateRepo = repoFactory.CreateGenericRepository<MessageTemplate>(userContext: uId);
            List<MessageLog> logs = new List<MessageLog>();

            ApplicationUser user = userManager.FindByIdAsync(userId).Result;
            //even if there are no logs for the user specifically there might be notifications for the usertype
            if (user != null)
            {
                List<MessageLog> typeLogs = new List<MessageLog>();
                if (user?.franchisorObjectData != null)
                {
                    typeLogs.AddRange(dbRepo.GetAll().Where(x => x.ToGroups.Contains("Franchisor")).ToList());
                }
                if (user?.coachObjectData != null)
                {
                    typeLogs.AddRange(dbRepo.GetAll().Where(x => x.ToGroups.Contains("Coach")).ToList());
                }
               if (user?.principalObjectData != null)
                {
                    typeLogs.AddRange(dbRepo.GetAll().Where(x => x.ToGroups.Contains("Principal")).ToList());
                }
               if (user?.practitionerObjectData != null)
                {
                    typeLogs.AddRange(dbRepo.GetAll().Where(x =>  x.ToGroups.Contains("Practitioner")).ToList());
                }
                if (user?.traineeObjectData != null)
                {
                    typeLogs.AddRange(dbRepo.GetAll().Where(x =>x.ToGroups.Contains("Trainee")).ToList());
                }
                 if (user?.traineeObjectData != null) //todo - fix this correctly and team leads, this is a placeholder
                {
                    typeLogs.AddRange(dbRepo.GetAll().Where(x => x.ToGroups.Contains("CHW")).ToList());
                }
                 //catch all
                typeLogs.AddRange(dbRepo.GetAll().Where(x => x.ToGroups.Contains("AllUsers")).ToList());
                //TODO: check regions and provinces etc as well
                
                //altertypelogs first by repllacing tags
                List<TagsReplacements> replacements = new List<TagsReplacements>();                
                foreach (var item in typeLogs)
                {

                    //replace any mapped values in the message that is addressed to the group. -  applicationName ,organisationName, firstName are the basics that gets replaced automatically
                    MessageTemplateText templateItem = notificationService.RemapFields(item.MessageTemplate, user, replacements);
                    item.Message = templateItem.Message;
                    item.Subject = templateItem.Subject;
                    item.CTAText = templateItem.CTAText;

                    logs.Add(item);
                }
            }

            logs.AddRange(dbRepo.GetAll().Where(x => string.Equals(x.To, userId) && x.IsActive == true).ToList());//&& (x.MessageEndDate >= DateTime.Now.Date || x.MessageEndDate == null) --FE needs to make teh decision to not show, because user might have been offline for a long time and the emssages are still relevant
            //only send in the relevcant prototcol types
            if (inApp)
            {
                logs = logs.Where(y => y.MessageProtocol.ToLower() == "push" || y.MessageProtocol.ToLower() == "hub").ToList();
            }
            if (!string.IsNullOrWhiteSpace(protocol))
            {
                logs = logs.Where(y => y.MessageProtocol.ToLower() == protocol).ToList();
            }

            foreach (var item in logs)
            {
                var template = templateRepo.GetAll().Where(x => string.Equals(x.TemplateType, item.MessageTemplateType)).FirstOrDefault();
                string toGroups = "";
                if (item.ToGroups != null)
                {
                    toGroups = item.ToGroups.Replace("Region:", "").Replace("Province:", "").Replace("Role:", ""); //Clean out group text for display
                }
                notifications.Add(new Notification() { From = item.From, FromUserId = item.FromUserId, Id = item.Id, Message = item.Message, MessageProtocol = item.MessageProtocol, To = item.To, SentByUserId = item.SentByUserId, Subject = item.Subject, MessageTemplateType = item.MessageTemplateType, MessageTemplate = template, CTA = item.CTA, CTAText = item.CTAText, MessageDate = item.MessageDate, MessageEndDate = item.MessageEndDate, Status = item.Status, ToGroups = item.ToGroups, ReadDate = item.ReadDate, Ordering = template.Ordering  });

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


        public List<string> GetAllRegions(
[Service] IHttpContextAccessor contextAccessor,
IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<SiteAddress>(userContext: uId);
            return dbRepo.GetAll().Where(x => x.Ward != null).Select(x => x.Ward).Distinct().ToList();
        }

    }
}
