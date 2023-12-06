using DotLiquid;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Notifications.NoSms;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using HotChocolate.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

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


        public List<WardModel> GetAllWards(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<SiteAddress>(userContext: uId);
            return dbRepo.GetAll().Where(x => x.Ward != null && x.Ward != "").Select(x => new WardModel() { ProvinceId = x.Ward, Ward = x.Ward}).Distinct().OrderBy(x => x.Ward).ToList();
        }


        public List<MessageLogModel> GetAllMessageLogsForAdmin(
            [Service] IDbContextFactory<AuthenticationDbContext> dbContextFactory,
            [Service] INotificationService notificationService,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId,
            List<string> roleIds,
            string status,
            DateTime? startDate,
            DateTime? endDate)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<MessageLog>(userContext: uId);
            AuthenticationDbContext context = dbContextFactory.CreateDbContext();

            List<MessageLogModel> messages = new List<MessageLogModel>();
            List<MessageLog> messageRecords = new List<MessageLog>();

            if (roleIds.Count != 0)
            {
                var isTrainee = roleIds.FindIndex(x => x == "trainees") != -1;
                var isPrincipal = roleIds.FindIndex(x => x == "practitioners_principals") != -1;
                var isNonPractitioner = roleIds.FindIndex(x => x == "practitioners_non_principals") != -1;
                var isCoach = roleIds.FindIndex(x => x == "coaches") != -1;
                var isCHW = roleIds.FindIndex(x => x == "chw") != -1;
                var isTeamLead = roleIds.FindIndex(x => x == "team_lead") != -1;

                // SS roles
                if (isTrainee)
                {
                    messageRecords.AddRange(
                        (from message in context.MessageLogs.Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                            join practitioner in context.Practitioners.Where(x => x.IsTrainee == true && x.IsActive == true) on message.To equals practitioner.UserId
                            select new MessageLog() { Id = message.Id, Message = message.Message, Subject = message.Subject, ToGroups = message.ToGroups, MessageDate = message.MessageDate, Status = message.Status })
                            .OrderByDescending(x => x.MessageDate).Distinct().ToList()
                        );
                }
                if (isPrincipal)
                {
                    messageRecords.AddRange(
                        (from message in context.MessageLogs.Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                            join practitioner in context.Practitioners.Where(x => (x.IsPrincipal == true || x.IsFundaAppAdmin == true) && x.IsActive == true) on message.To equals practitioner.UserId
                            select new MessageLog() { Id = message.Id, Message = message.Message, Subject = message.Subject, ToGroups = message.ToGroups, MessageDate = message.MessageDate, Status = message.Status })
                            .OrderByDescending(x => x.MessageDate).Distinct().ToList()
                        );
                }
                if (isNonPractitioner)
                {
                    messageRecords.AddRange(
                        (from message in context.MessageLogs.Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                            join practitioner in context.Practitioners.Where(x => (x.IsPrincipal == false && x.IsFundaAppAdmin == false) && x.IsActive == true) on message.To equals practitioner.UserId
                            select new MessageLog() { Id = message.Id, Message = message.Message, Subject = message.Subject, ToGroups = message.ToGroups, MessageDate = message.MessageDate, Status = message.Status })
                            .OrderByDescending(x => x.MessageDate).Distinct().ToList()
                        );
                }
                if (isCoach)
                {
                    messageRecords.AddRange(
                        (from message in context.MessageLogs.Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                            join coach in context.Coaches.Where(x => x.IsActive == true) on message.To equals coach.UserId
                            select new MessageLog() { Id = message.Id, Message = message.Message, Subject = message.Subject, ToGroups = message.ToGroups, MessageDate = message.MessageDate, Status = message.Status })
                            .OrderByDescending(x => x.MessageDate).Distinct().ToList()
                        );
                }

                // GG roles
                if (isCHW)
                {
                    messageRecords.AddRange(
                        (from message in context.MessageLogs.Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                            join chw in context.HealthCareWorkers.Where(x => x.IsActive == true) on message.To equals chw.UserId
                            select new MessageLog() { Id = message.Id, Message = message.Message, Subject = message.Subject, ToGroups = message.ToGroups, MessageDate = message.MessageDate, Status = message.Status })
                            .OrderByDescending(x => x.MessageDate).Distinct().ToList()
                        );
                }
                if (isTeamLead)
                {
                    messageRecords.AddRange(
                        (from message in context.MessageLogs.Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                         join teamLead in context.TeamLead.Where(x => x.IsActive == true) on message.To equals teamLead.UserId
                         select new MessageLog() { Id = message.Id, Message = message.Message, Subject = message.Subject, ToGroups = message.ToGroups, MessageDate = message.MessageDate, Status = message.Status })
                            .OrderByDescending(x => x.MessageDate).Distinct().ToList()
                        );
                }
            }
            else
            {
                messageRecords = dbRepo.GetAll()
                                       .Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive == true)
                                       .Select(x => new MessageLog() { Id = x.Id, Message = x.Message, Subject = x.Subject, ToGroups = x.ToGroups, MessageDate = x.MessageDate, Status = x.Status })
                                       .Distinct().ToList();
            }
               
            if (status != "")
            {
                messageRecords = (status == "scheduled" ? messageRecords.Where(x => x.MessageDate >= DateTime.Now).ToList() : messageRecords.Where(x => x.MessageDate <= DateTime.Now).OrderByDescending(x => x.MessageDate).Distinct().ToList());
            } 
            if (startDate != null) 
            {
                messageRecords = messageRecords.Where(x => x.MessageDate >= startDate.Value).OrderByDescending(x => x.MessageDate).Distinct().ToList();
            } 
            if (endDate != null)
            {
                messageRecords = messageRecords.Where(x => x.MessageDate <= endDate.Value).OrderByDescending(x => x.MessageDate).Distinct().ToList();
            }
            var filteredMessages = messageRecords.Select(x => new { x.Message, x.Subject, x.ToGroups, x.MessageDate, x.Status }).OrderByDescending(x => x.MessageDate).Distinct().ToList();
            
            MessageLogModel toGroupsItems = new MessageLogModel();
            foreach (var item in filteredMessages)
            {
                toGroupsItems = notificationService.RetrieveToGroupItems(item.ToGroups);                
                messages.Add(new MessageLogModel()
                {
                    Message = item.Message,
                    Subject = item.Subject,
                    MessageDate = (System.DateTime)item.MessageDate,
                    ToGroups = item.ToGroups,
                    Status = item.Status,
                    ProvinceId = toGroupsItems.ProvinceId,
                    WardName = toGroupsItems.WardName,
                    DistrictId = toGroupsItems.DistrictId,
                    RoleIds = toGroupsItems.RoleIds,
                    RoleNames = toGroupsItems.RoleNames,
                    MessageLogIds = messageRecords.Where(x => x.Message == item.Message &&
                                                            x.Subject == item.Subject &&
                                                            x.MessageDate == (System.DateTime)item.MessageDate &&
                                                            x.ToGroups == item.ToGroups).Select(x => x.Id).ToList()
                });
            }
            return messages;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetUserCountForMessageCriteria([Service] IDbContextFactory<AuthenticationDbContext> dbContextFactory,
                                                  [Service] IHttpContextAccessor contextAccessor,
                                                  IGenericRepositoryFactory repoFactory,
                                                  string provinceId,
                                                  string districtId,
                                                  string wardName,
                                                  List<string> roleIds)
        {
            var count = 0;
            var tenantId = TenantExecutionContext.Tenant.Id;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var teamLeadRepo = repoFactory.CreateGenericRepository<TeamLead>(userContext: uId);
            var hcwRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: uId);

            List<string> userIds = new List<string>();
            List<Practitioner> practitioners = new List<Practitioner>();
            List<Coach> coaches = new List<Coach>();
            List<string> messageUserIds = new List<string>();

            if (roleIds.Count == 0)
            {
                return count;
            }

            var isTrainee = roleIds.FindIndex(x => x == "trainees") != -1;
            var isPrincipal = roleIds.FindIndex(x => x == "practitioners_principals") != -1;
            var isNonPractitioner = roleIds.FindIndex(x => x == "practitioners_non_principals") != -1;
            var isCoach = roleIds.FindIndex(x => x == "coaches") != -1;
            var isCHW = roleIds.FindIndex(x => x == "chw") != -1;
            var isTeamLead = roleIds.FindIndex(x => x == "team_lead") != -1;

            if (isTrainee || isPrincipal || isNonPractitioner)
            {
                practitioners = practitionerRepo.GetAll().Where(x => x.IsActive == true).ToList();
            }

            // SS roles
            if (isTrainee)
            {
                userIds.AddRange(practitioners.Where(x => x.IsActive == true && x.IsTrainee == true).Select(x => x.UserId).Distinct().ToList());
            }
            if (isPrincipal)
            {
                userIds.AddRange(practitioners.Where(x => x.IsActive == true && (x.IsPrincipal == true || x.IsFundaAppAdmin == true)).Select(x => x.UserId).Distinct().ToList());
            }
            if (isNonPractitioner)
            {
                userIds.AddRange(practitioners.Where(x => x.IsActive == true && (x.IsPrincipal == false && x.IsFundaAppAdmin == false)).Select(x => x.UserId).Distinct().ToList());
            }
            if (isCoach)
            {
                coaches = coachRepo.GetAll().Where(x => x.IsActive == true).ToList();
                userIds.AddRange(coaches.Select(x => x.UserId).Distinct().ToList());
            }
            // GG roles
            if (isCHW)
            {
                userIds.AddRange(hcwRepo.GetAll().Where(x => x.IsActive == true).Select(x => x.UserId).Distinct().ToList());
            }
            if (isTeamLead)
            {
                userIds.AddRange(teamLeadRepo.GetAll().Where(x => x.IsActive == true).Select(x => x.UserId).Distinct().ToList());
            }


            // Currently we don't have districts in the system, but this will change after the development in December 23
            if (provinceId != "" || wardName != "")
            {

                if (isTrainee || isPrincipal || isNonPractitioner)
                {
                    if (provinceId != "" && wardName == "")
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId?.ToString() == provinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (provinceId == "" && wardName != "")
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.Ward == wardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(practitioners
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == provinceId && x.SiteAddress?.Ward == wardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                if (isCoach)
                {
                    if (provinceId != "" && wardName == "")
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == provinceId)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else if (provinceId == "" && wardName != "")
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.Ward == wardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                    else
                    {
                        messageUserIds.AddRange(coaches
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress?.ProvinceId.ToString() == provinceId && x.SiteAddress?.Ward == wardName)
                            .Select(x => x.UserId)
                            .Distinct().ToList());
                    }
                }
                count = messageUserIds.Count();
            }
            else
            {
                count = userIds.Count();
            }
            return count;
        }
    }
}
