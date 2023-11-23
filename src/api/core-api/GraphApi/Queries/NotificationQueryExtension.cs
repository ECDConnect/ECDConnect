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
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using FileSignatures.Formats;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
            return dbRepo.GetAll().Where(x => x.Ward != null && x.Ward != "").Select(x => new WardModel() { ProvinceId = x.ProvinceId, Ward = x.Ward}).Distinct().OrderBy(x => x.Ward).ToList();
        }


        public List<MessageLogModel> GetAllMessageLogsForAdmin(
            [Service] INotificationService notificationService,
            [Service] RoleManager<ApplicationIdentityRole> roleManager,
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var tenantId = TenantExecutionContext.Tenant.Id;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<MessageLog>(userContext: uId);
            List<MessageLogModel> messages = new List<MessageLogModel>();
            var roles = roleManager.Roles.Where(x => x.TenantId == null || x.TenantId == tenantId).ToList();

            var messageRecords = dbRepo.GetAll()
                .Where(x => x.SentByUserId.ToString() == userId && x.MessageProtocol == "push" && x.MessageTemplateType == "generic-message" && x.IsActive)
                .Select(x => new { x.Message, x.Subject, x.ToGroups, x.MessageDate, x.Status})
                .Distinct().ToList();

            MessageLogModel toGroupsItem = new MessageLogModel();
            foreach (var item in messageRecords)
            {
                toGroupsItem = notificationService.RetrieveToGroupItems(item.ToGroups);

                messages.Add(new MessageLogModel()
                {
                    Message = item.Message,
                    Subject = item.Subject,
                    MessageDate = (System.DateTime)item.MessageDate,
                    ToGroups = item.ToGroups,
                    Status = item.Status,
                    ProvinceId = toGroupsItem.ProvinceId,
                    WardName = toGroupsItem.WardName,
                    DistrictId = toGroupsItem.DistrictId,
                    RoleIds = toGroupsItem.RoleIds,
                    RoleNames = string.Join(", ", roles.Where(x => toGroupsItem.RoleIds.Contains(x.Id)).Select(x => x.Name).ToList())   
                });
            }
            return messages;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public int GetUserCountForMessageCriteria([Service] IDbContextFactory<AuthenticationDbContext> dbContextFactory,
                                                  [Service] RoleManager<ApplicationIdentityRole> roleManager,
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
            var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);

            if (roleIds.Count == 0)
            {
                return count;
            }

            AuthenticationDbContext context = dbContextFactory.CreateDbContext();
            var roles = roleManager.Roles.Where(x => roleIds.Contains(x.Id) && (x.TenantId == null || x.TenantId == tenantId)).ToList();

            // role ids are mandatory
            List<string> userIds = (from user in context.Users.Where(x => x.IsActive == true)
                                    join userRoles in context.UserRoles on user.Id equals userRoles.UserId
                                    join role in context.Roles.Where(x => roleIds.Contains(x.Id)) on userRoles.RoleId equals role.Id
                                    select user.Id).ToList();

            // Currently we don't have districts in the system, but this will change after the development in December 23
            if (provinceId != "" || wardName != "")
            {
                var practitionerCount = roles.Where(x => x.Name == Roles.PRACTITIONER).Count();
                var coachCount = roles.Where(x => x.Name == Roles.COACH).Count();
                var principalCount = roles.Where(x => x.Name == Roles.PRINCIPAL).Count();
                var franchisorCount = roles.Where(x => x.Name == Roles.FRANCHISOR).Count();

                if (practitionerCount > 0)
                {
                    if (provinceId != "" && wardName == "")
                    {
                        count += practitionerRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == provinceId)
                        .Distinct().Count();
                    } else if (provinceId == "" && wardName != "")
                    {
                        count += practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.Ward == wardName)
                            .Distinct().Count();
                    } else
                    {
                        count += practitionerRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == provinceId && x.SiteAddress.Ward == wardName)
                            .Distinct().Count();
                    }
                }
                if (coachCount > 0)
                {
                    if (provinceId != "" && wardName == "")
                    {
                        count += coachRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == provinceId)
                            .Distinct().Count();
                    }
                    else if (provinceId == "" && wardName != "")
                    {
                        count += coachRepo.GetAll()
                            .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.Ward == wardName)
                            .Distinct().Count();
                    }
                    else
                    {
                        count += coachRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == provinceId && x.SiteAddress.Ward == wardName)
                        .Distinct().Count();
                    }
                }
                if (principalCount > 0)
                {
                    if (provinceId != "" && wardName == "")
                    {
                        count += practitionerRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.IsPrincipal == true && x.SiteAddress.ProvinceId.ToString() == provinceId)
                        .Distinct().Count();
                    }
                    else if (provinceId == "" && wardName != "")
                    {
                        count += practitionerRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.IsPrincipal == true && x.SiteAddress.Ward == wardName)
                        .Distinct().Count();
                    }
                    else
                    {
                        count += practitionerRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.IsPrincipal == true && x.SiteAddress.ProvinceId.ToString() == provinceId && x.SiteAddress.Ward == wardName)
                        .Distinct().Count();
                    }
                }
                if (franchisorCount > 0)
                {
                    if (provinceId != "" && wardName == "")
                    {
                        count += franchisorRepo.GetAll()
                                .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == provinceId)
                                .Distinct().Count();
                    }
                    else if (provinceId == "" && wardName != "")
                    {
                        count += franchisorRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.Ward == wardName)
                        .Distinct().Count();
                    }
                    else
                    {
                        count += franchisorRepo.GetAll()
                        .Where(x => userIds.Contains(x.UserId) && x.IsActive == true && x.SiteAddress.ProvinceId.ToString() == provinceId && x.SiteAddress.Ward == wardName)
                        .Distinct().Count();
                    }
                }
            }
            else
            {
                count = userIds.Count;
            }
            return count;
        }
    }
}
