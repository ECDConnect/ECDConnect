using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Api.CoreApi.Services;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PractitionerQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PractitionerModel GetPractitionerByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelService personnelService,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practiRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                return personnelService.GetPractitionerDetails(practitioner);
            }
            return null;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PractitionerModel GetPractitionerPermissions(
          [Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory,
          [Service] PersonnelService personnelService,
          string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practiRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                return new PractitionerModel()
                {
                    Id = practitioner.Id,
                    Permissions = practitioner.User.UserPermissions.Select(x => new UserPermissionModel(x)).ToList()
                };
            }
            return null;
        }

        public PractitionerModel GetPractitionerById(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelService personnelService,
            string id)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practiRepo.GetById(new Guid(id));
            if (practitioner != null)
            {
                return personnelService.GetPractitionerDetails(practitioner);
            }
            return null;
        }

        public PractitionerUserAndNote GetPractitionerByIdNumber(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            IGenericRepositoryFactory repoFactory,
            ApplicationUserManager userManager,
            [Service] IClassroomService classroomService,
            string idNumber)
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id;

            if (uId is null)
                throw new System.Exception("No active user found.");

            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var principal = dbRepo.GetByUserId(uId.Value);
            if (principal != null)
            {
                var practitionerUser = dbContext.Users.Where(user => (user.UserName == idNumber || user.IdNumber == idNumber) && user.TenantId == TenantExecutionContext.Tenant.Id).FirstOrDefault();

                if (practitionerUser != null)
                {
                    ApplicationUser currentUser = userManager.FindByIdAsync(practitionerUser.Id.ToString()).Result;
                    Classroom classroom = dbContext.Classrooms.Where(classroom => classroom.UserId == practitionerUser.Id).FirstOrDefault();
                    
                    var practitioner = dbRepo.GetByUserId(practitionerUser.Id);

                    if (practitioner != null)
                    {
                        practitioner.User = currentUser;
                        var hasPreschool = false;

                        if (practitioner.PrincipalHierarchy == null)
                        {

                            if (TenantExecutionContext.Tenant.TenantType == ECDLink.Tenancy.Enums.TenantType.WhiteLabel) 
                            {
                                hasPreschool = classroom != null;
                            } else 
                            {
                                var belongToOtherSchool = dbContext.ClassroomGroups.Where(x => x.UserId == practitionerUser.Id && x.IsActive == true)
                                                                        .Include(x => x.Classroom).Where(x => x.Classroom.UserId != practitionerUser.Id)
                                                                        .Select(x => x.Classroom)
                                                                        .Count() != 0;
                                var startDate = practitioner.StartDate.Value.Date;
                                var endDate = DateTime.Today;
                                var trailPeriodDays = (endDate - startDate).TotalDays;
                                var isTrialPeriod = trailPeriodDays < 31; 
                                var isDummySchool = classroom?.PreschoolCode == null;
                                hasPreschool = classroom == null ? false : !isDummySchool || belongToOtherSchool || !isTrialPeriod;
                            }

                            return new PractitionerUserAndNote() { 
                                AppUser = practitioner.User, 
                                IsRegistered = practitioner.IsRegistered, 
                                BelongsToPreschool = hasPreschool, 
                                Note = hasPreschool ? "This practitioner is linked to a different SmartStart programme" : null };
                        }
                        else
                        {
                            return new PractitionerUserAndNote() { 
                                AppUser = practitioner.User, 
                                Note = "This practitioner is linked to a different SmartStart programme", 
                                IsRegistered = classroom != null };
                        }
                    }
                    else
                    {
                        return new PractitionerUserAndNote() { 
                            AppUser = null, 
                            Note = "Not on " + TenantExecutionContext.Tenant.ApplicationName + " app", 
                            IsRegistered = false, 
                            BelongsToPreschool = false };
                    }
                }
            }
            return null;
        }

        public ApplicationUser GetPractitionerByIdNumberInternal(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            IGenericRepositoryFactory repoFactory,
            string idNumber)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerUser = dbContext.Users.Where(user => (user.UserName == idNumber || user.IdNumber == idNumber) && user.TenantId == TenantExecutionContext.Tenant.Id).FirstOrDefault();

            if (practitionerUser != null)
            {
                var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
                var practitioner = practiRepo.GetByUserId(practitionerUser.Id);
                if (practitioner != null)
                {
                    return practitioner.User;
                }
            }
            return default;
        }

        public async Task<FileModel> PractitionerExcelTemplateGenerator(
          [Service] IFileGenerationService fileService,
          IGenericRepositoryFactory repoFactory)
        {
            var languageRepo = repoFactory.CreateRepository<Language>();
            var languages = languageRepo.GetAll().ToList();

            var fieldList = new List<string>();
            var fieldDefinitionList = new Dictionary<string, string>();
            fieldDefinitionList.Add("FirstName", "Text");
            fieldDefinitionList.Add("Surname", "Text");
            fieldDefinitionList.Add("Cellphone Number", "Text");
            fieldDefinitionList.Add("ID / Passport Number", "Text");
            fieldDefinitionList.Add("Consent For Photo", "Yes / No");
            fieldDefinitionList.Add("Language Used in group", "Language Name");
            fieldDefinitionList.Add("Parent Fees", "Number");
            fieldDefinitionList.Add("StartDate", "Date Text (E.g 2019/10/23)");

            var languageList = new Dictionary<string, string>();
            languages.ForEach(x => languageList.Add(x.Locale, x.Description));

            fieldList.Add("FirstName");
            fieldList.Add("Surname");
            fieldList.Add("Cellphone Number");
            fieldList.Add("ID / Passport Number");
            fieldList.Add("Consent For Photo");
            fieldList.Add("Language Used in group");
            fieldList.Add("Parent Fees");
            fieldList.Add("StartDate");

            var reportName = $"Practitioner Template";
            return await fileService.FieldsToExcelTemplate(fieldList, fieldDefinitionList, languageList, reportName);
        }


        // This needs to be removed, data should already be available on FE
        public PractitionerReportDetails GetReportDetailsForPractitioner(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IClassroomService classroomService,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var practitioner = practitionerRepo.GetByUserId(userId);
            var classroom = classroomService.GetClassroomForUser(Guid.Parse(userId));
            var classroomGroup = classroomService.GetClassroomGroupsForUser(Guid.Parse(userId)).FirstOrDefault();

            var details = new PractitionerReportDetails()
            {
                ClassroomGroupId = classroomGroup?.Id.ToString(),
                ClassroomGroupName = classroomGroup?.Name,
                Id = classroom.Id.ToString(),
                IdNumber = practitioner.User.IdNumber,
                InsertedDate = classroom.InsertedDate,
                Name = practitioner.User.FullName,
                Phone = practitioner.User.PhoneNumber,
                PrincipalName = $"{classroom.User.FirstName} {classroom.User.Surname}",
                ProgrammeDays = "Monday to Friday",
                ProgrammeTypeName = classroomGroup?.ProgrammeType?.Description,
                ClassSiteAddress = classroom.SiteAddress != null
                    ? classroom.SiteAddress.Name + " " + classroom.SiteAddress.AddressLine1 + " " + classroom.SiteAddress.AddressLine2 + " " + classroom.SiteAddress.AddressLine3 + " " + (classroom.SiteAddress.Province != null ? classroom.SiteAddress.Province.Description : string.Empty) + " " + classroom.SiteAddress.PostalCode
                    : ""
            };

            return details;
        }

        public List<PractitionerColleagues> GetPractitionerColleagues([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var classGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            List<PractitionerColleagues> practitionerColleagues = new List<PractitionerColleagues>();
            Practitioner practi = practiRepo.GetByUserId(userId);
            // Return no classroom if the OA practitioner has not accepted any invitation for classroom
            if (TenantExecutionContext.Tenant.TenantType == ECDLink.Tenancy.Enums.TenantType.OpenAccess
                && !practi.IsPrincipalOrAdmin() && practi.PrincipalHierarchy != null && !practi.DateAccepted.HasValue) 
            {
                return null;
            }

            if (practi != null && (practi.PrincipalHierarchy.HasValue || practi.IsPrincipal == true))
            {

                List<Practitioner> practitioners = practiRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy == practi.PrincipalHierarchy : x.IsPrincipal == true ? x.UserId == Guid.Parse(userId) : x.UserId == Guid.Parse(userId)).ToList();
                //also add principal
                if (practi.IsPrincipal == true)
                {
                    Practitioner practiPrincipal = practiRepo.GetByUserId(practi.UserId.ToString());
                    if (practiPrincipal != null && practiPrincipal.UserId != practi.UserId) {
                        practitioners.Add(practiPrincipal);
                    }
                }
                if (practi.PrincipalHierarchy.HasValue)
                {
                    Practitioner practiPrincipal = practiRepo.GetByUserId(practi.PrincipalHierarchy.ToString());
                    if (practiPrincipal != null && practiPrincipal.UserId != practi.UserId) {
                        practitioners.Add(practiPrincipal);
                    }
                }

                if (practitioners.Count > 0)
                {
                    foreach (var practitioner in practitioners)
                    {
                        if (practitioner.User != null)
                        {
                            string practiProfile = practitioner.User.ProfileImageUrl;
                            string practiName = practitioner.User.FullName;
                            string practiNickName = practitioner.User.NickFullName != null ? practitioner.User.NickFullName : "";
                            string practiNumber = practitioner.User.PhoneNumber;
                            string practiClassroomNames = "";
                            string practiType = "";
                         
                            if (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal != false)
                            {
                                practiType = "Principal";
                            }
                            if (practiType == "")//if neither of the above, its a default
                            {
                                practiType = "Practitioner";
                            }
                            //get any classroomnames from user and append them
                            var classes = classGroupRepo.GetAll().Where(x => x.IsActive && x.UserId.ToString().Contains(practitioner.UserId.ToString()));
                            if (classes.Any())
                            {
                                var classNames = classes.Where(x => x.Name != "").Select(f => f.Name);
                                practiClassroomNames = string.Join(",", classNames);
                            }

                            practitionerColleagues.Add(new PractitionerColleagues() { Name = practiName, NickName = practiNickName, Title = practiType, ProfilePhoto = practiProfile, ContactNumber = practiNumber, ClassroomNames = practiClassroomNames, UserId = practitioner.User.Id.ToString() });
                        }
                    }
                }
            }
            return practitionerColleagues;
        }

        public int GetPractitionerInviteCount(
            [Service] ShortUrlManager shortUrlManager,
            string userId)
        {
            return shortUrlManager.GetMessageCountForUser(Guid.Parse(userId), TemplateTypeConstants.Invitation);
        }

        public string GetLastPractitionerInviteDate(
            [Service] ShortUrlManager shortUrlManager,
            string userId)
        {
            return shortUrlManager.GetLastMessageDateForUser(Guid.Parse(userId), TemplateTypeConstants.Invitation);
        }

        public List<System.DateTime> GetAllPractitionerInvites(
            [Service] ShortUrlManager shortUrlManager,
            string userId)
        {
            return shortUrlManager.GetAllMessageInvitesForUser(Guid.Parse(userId), TemplateTypeConstants.Invitation);
        }

        public List<Visit> GetPractitionerVisits([Service] VisitManager visitManager, string userId)
        {
            return visitManager.GetVisitsForClient(userId, Constants.SSSettings.client_practitioner);

        }
        public PractitionerTimeline GetPractitionerTimeline([Service] PersonnelService personnelService, string userId)
        {
            return personnelService.GetPractitionerTimeline(userId);
        }

        public List<PractitionerNotes> GetVisitNotesForPractitioner([Service] VisitDataManager visitDataManager, string userId)
        {
            return visitDataManager.GetVisitNotesForPractitioner(userId);
        }

        public PractitionerRemovalHistory GetRemovalDetailsForPractitioner(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            if (userId == null)
            {
                return null;
            }
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);
            var result = removalRepo.GetListByUserId(userId)
                .Where(x => x.IsActive)
                .OrderByDescending(x => x.InsertedDate)
                .FirstOrDefault();

            return result;
        }
        public List<PractitionerRemovalHistory> GetRemovalDetailsForPractitioners(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            IEnumerable<string> userIds)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var removalRepo = repoFactory.CreateGenericRepository<PractitionerRemovalHistory>(userContext: uId);
            var result = removalRepo.GetAll()
                .Where(x => x.IsActive && userIds.Contains(x.UserId.ToString()))
                .ToList();

            return result;
        }
        public List<PractitionerModel> GetAllPractitioners([Service] PersonnelService personnelService)
        {
            return personnelService.GetAllPractitioners();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalPractitionerModel> GetAllPortalPractitioners(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            CancellationToken cancellationToken,
            PagedQueryInput pagingInput = null,
            string search = null,
            List<Guid?> provinceSearch = null,
            List<string> connectUsageSearch = null,
            List<string> practitionerTypeSearch = null
            )
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var shortenUrlEntityRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: uId);
            var sixMonthsAgo = DateTime.Now.AddMonths(-6).GetStartOfMonth().Date;

            if (cancellationToken.IsCancellationRequested)
            {
                return null;
            }

            var practitionerQuery = practitionerRepo.GetAll(pagingInput).Where(x => !x.User.UserName.StartsWith("External_"));
            // General search term
            if (!string.IsNullOrWhiteSpace(search))
            {
                practitionerQuery = practitionerQuery
                    .Where(h =>
                        EF.Functions.ILike(h.User.FullName, $"%{search}%")
                        || EF.Functions.ILike(h.User.IdNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.PhoneNumber, $"%{search}%")
                        || EF.Functions.ILike(h.User.Email, $"%{search}%"));
            }

            // Province search
            if (provinceSearch != null && provinceSearch.Any())
            {
                practitionerQuery = practitionerQuery.Where(x => provinceSearch.Contains(x.SiteAddress.ProvinceId));
            }

            // Practitioner Type search
            if (practitionerTypeSearch != null && practitionerTypeSearch.Any())
            {
                if (practitionerTypeSearch.Count < 2)
                {
                    if (practitionerTypeSearch.Contains("Principal"))
                    {
                        practitionerQuery = practitionerQuery.Where(x => x.IsPrincipal.HasValue && x.IsPrincipal.Value);
                    }
                    if (practitionerTypeSearch.Contains("Practitioner"))
                    {
                        practitionerQuery = practitionerQuery.Where(x => x.IsPrincipal.HasValue && !x.IsPrincipal.Value);
                    }
                }
            }

            var userIds = practitionerQuery.Select(x => x.UserId.Value).ToList();
            var invitations = shortenUrlEntityRepo.GetAll()
                .Where(x =>
                    userIds.Contains(x.UserId.Value)
                    && (x.MessageType == TemplateTypeConstants.Invitation)
                    && x.IsActive
                    && x.Clicked == 0)
                .Select(x => new { x.UserId, x.InsertedDate, x.NotificationResult })
                .OrderByDescending(x => x.InsertedDate)
                .GroupBy(x => x.UserId);

            var invitationDates = invitations.ToDictionary(x => x.Key, x => x.Last().InsertedDate);
            var invitationNotifications = invitations.ToDictionary(x => x.Key, x => x.Last().NotificationResult);

            var practitionerModels = practitionerQuery
               .Select(item => new PortalPractitionerModel
               {
                   Id = item.Id,
                   IsRegistered = (item.IsRegistered == null ? false : (bool)item.IsRegistered),
                   UserId = item.UserId,
                   IsPrincipal = item.IsPrincipal,
                   InsertedDate = item.InsertedDate.Date,
                   User = new PortalPractitionerUserModel(item.User,
                                                          (item.IsRegistered == null ? false : (bool)item.IsRegistered),
                                                          invitationDates.ContainsKey(item.UserId) ? invitationDates[item.UserId] : null,
                                                          invitationNotifications.ContainsKey(item.UserId) ? invitationNotifications[item.UserId] : null)
               })
               .ToList();

            List<PortalPractitionerModel> filteredUsers = new List<PortalPractitionerModel>();
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_active))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_invitation_expired))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
            {
                filteredUsers.AddRange(practitionerModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date >= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_6_months))
            {
                filteredUsers.AddRange(practitionerModels.Where(x =>
                    x.IsRegistered
                    && x.User.IsActive
                    && x.User.LastSeen.Date <= sixMonthsAgo));
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => x.User.IsActive == false).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_authentication))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_connection))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_insufficient_credits))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.sms_failed_opted_out))
            {
                filteredUsers.AddRange(practitionerModels.Where(x => connectUsageSearch.Contains(x.User.ConnectUsage)).ToList());
            }

            return connectUsageSearch.Any() ? filteredUsers.DistinctBy(x => x.Id).ToList() : practitionerModels;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<FileModel> PractitionerTemplateGenerator(
          [Service] IFileGenerationService fileService,
          [Service] IHttpContextAccessor contextAccessor,
          IGenericRepositoryFactory repoFactory)
        {
            var fieldDefinitionSheet = $"Field Definition";
            var fieldDefinitionList = new List<List<string>>
            {
                new List<string> {"Column", "Type Description"},
                new List<string> {"Type of identification", "Text, (Must be: 'id' or 'passport')"},
                new List<string> {"ID number", "Number, (required if type of identification is 'id'; must be 13 digits)"},
                new List<string> {"Passport", "Text, (required if type of identification is 'passport')"},
                new List<string> {"First name", "Text, (required)"},
                new List<string> {"Surname", "Text, (required)"},
                new List<string> {"Cellphone number", "Number, (required, 9 or 10 digits)"},
            };

            var templateHeaderSheet = $"Practitioner Template";
            var templateHeaders = new List<List<string>>()
            {
                new List<string> {
                    "Type of identification",
                    "ID number",
                    "Passport",
                    "First name",
                    "Surname",
                    "Cellphone number"
                }
            };

            var spreadSheets = new Dictionary<string, List<List<string>>>() {
                { templateHeaderSheet, templateHeaders },
                { fieldDefinitionSheet, fieldDefinitionList }
            };

            if (TenantExecutionContext.Tenant.Modules.CoachRoleEnabled)
            {
                var uId = contextAccessor.HttpContext.GetUser()?.Id;
                var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);

                fieldDefinitionList.Add(new List<string>
                {
                    TenantExecutionContext.Tenant.Modules.CoachRoleName + " ID/passport number", "Text, (optional)"
                });
                templateHeaders.GetItemByIndex(0).Add(TenantExecutionContext.Tenant.Modules.CoachRoleName + " ID/passport number");

                var coachNameSheet = $"{TenantExecutionContext.Tenant.Modules.CoachRoleName}";
                var coachNames = coachRepo.GetAll().Where(c => c.IsActive).Select(c => new List<string> { c.User.IdNumber, c.User.FullName, "" }).ToList();

                spreadSheets.Add(coachNameSheet, coachNames);
            }

            var fileName = templateHeaderSheet.Replace(" ", "_");
            return await fileService.DictionaryToExcelTemplate(spreadSheets, fileName);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PractitionerStatsModel GetPractitionerStats(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] IClassroomService classroomService,
            [Service] MonthlyAttendanceReport monthlyAttendanceReport,
            Guid userId,
            DateTime startDate,
            DateTime? endDate = null)
        {
            if (endDate == null)
            {
                endDate = startDate.AddMonths(1);
            }

            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            var childProgressReportRepo = repoFactory.CreateRepository<ChildProgressReport>(userContext: uId);
            var childProgressReportPeriodRepo = repoFactory.CreateRepository<ChildProgressReportPeriod>(userContext: uId);
            var statementsRepo = repoFactory.CreateRepository<StatementsIncomeStatement>(userContext: uId);
            var practiGenericRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

            PractitionerStatsModel stats = new PractitionerStatsModel();
            var practitioner = practiGenericRepo.GetByUserId(userId);

            if (practitioner != null)
            {
                var classroom = classroomService.GetClassroomForUser(userId);
                if (classroom != null)
                {
                    stats.SchoolName = classroom.Name;
                    stats.TotalPractitionersForSchool = classroom.ClassroomGroups.Where(x => x.IsActive).Select(x => x.UserId).Distinct().Count();
                    stats.TotalChildrenForSchool = classroom.ClassroomGroups.SelectMany(x => x.Learners.Where(y => y.IsActive && !y.StoppedAttendance.HasValue)).Distinct().Count();
                    stats.TotalClassesForSchool = classroom.ClassroomGroups.Where(x => x.IsActive).Count();

                    var progressPeriodIds = new List<Guid>();
                    var totalProgressReportsNotCompleted = 0;
                    var totalProgressReportsCompleted = 0;
                    progressPeriodIds = childProgressReportPeriodRepo.GetAll()
                                                                    .Where(x => x.IsActive
                                                                        && x.ClassroomId == classroom.Id
                                                                        && ((x.StartDate.Date >= startDate.Date && x.StartDate.Date <= endDate.Value.Date)
                                                                        || (x.EndDate.Date >= startDate.Date && x.EndDate.Date <= endDate.Value.Date)))
                                                                    .Select(x => x.Id)
                                                                    .ToList();
                    foreach (var id in progressPeriodIds)
                    {
                        var progressData = childProgressReportRepo.GetAll().Where(x => x.IsActive == true && x.ChildProgressReportPeriodId == id).FirstOrDefault();
                        if (progressData == null)
                        {
                            totalProgressReportsNotCompleted++;
                        }
                        else
                        {
                            if (progressData.DateCompleted.HasValue)
                            {
                                totalProgressReportsCompleted++;
                            }
                            else
                            {
                                totalProgressReportsNotCompleted++;
                            }
                        }
                    }

                    stats.TotalProgressReportsCompleted = totalProgressReportsCompleted;
                    stats.TotalProgressReportsNotCompleted = totalProgressReportsNotCompleted;
                }

                var start = startDate.Date;
                var end = endDate.Value;
                // set end-date to end of month
                end = new DateTime(end.Year, end.Month, DateTime.DaysInMonth(end.Year, end.Month));
                var months = Enumerable.Range(0, Int32.MaxValue)
                            .Select(e => start.AddMonths(e))
                            .TakeWhile(e => e <= end)
                            .Select(e => e.Month).Distinct().ToList();
                var years = Enumerable.Range(0, Int32.MaxValue)
                            .Select(e => start.AddMonths(e))
                            .TakeWhile(e => e <= end)
                            .Select(e => e.Year).Distinct().ToList();

                var monthReports = new List<MonthlyAttendanceReportModel>();
                var attendanceStart = startDate.Date;
                foreach (var month in months)
                {
                    var monthReport = monthlyAttendanceReport.GenerateMonthlyAttendanceReport(userId.ToString(), attendanceStart.GetStartOfMonth(), attendanceStart.GetEndOfMonth()).FirstOrDefault();
                    if (monthReport != null)
                    {
                        monthReports.Add(monthReport);
                    }
                    attendanceStart = attendanceStart.AddMonths(1);
                }

                stats.TotalAttendanceRegistersCompleted = monthReports.Select(x => x.NumberOfSessions).Sum();
                stats.TotalAttendanceRegistersNotCompleted = monthReports.Select(x => x.TotalScheduledSessions).Sum();

                var statementData = statementsRepo.GetAll().Where(x => x.IsActive == true
                                                                    && x.UserId == userId
                                                                    && years.Contains(x.Year)
                                                                    && months.Contains(x.Month)).ToList();

                stats.TotalIncomeStatementsDownloaded = statementData.Where(x => x.Downloaded == true).Count();
                stats.TotalIncomeStatementsWithNoItems = statementData.Where(x => x.IncomeItems.Count == 0 || x.ExpenseItems.Count == 0).Count();

            }
            return stats;
        }

    }
}
