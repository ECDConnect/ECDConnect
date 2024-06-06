using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.GraphApi.Models.Portal;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.Core.Extensions;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
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
using static ECDLink.Core.SystemSettings.SettingGroups.CallBacks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
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
            [Service] ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory,
            string idNumber)
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            
            if (uId is null)
                throw new System.Exception("No active user found.");

            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            //retrieve principal, check that the coach lines match, that the user to be searched for is not a principal or an FAA

            var principal = dbRepo.GetByUserId(uId.Value);
            if (principal != null)
            {
                var practionerUser = userManager.FindByNameAsync(idNumber).Result;

                if (practionerUser != null)
                {
                    var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
                    var practitioner = practiRepo.GetByUserId(practionerUser.Id);
                    if (practitioner != null)
                    {
                        if (practitioner.PrincipalHierarchy == null && practitioner.CoachHierarchy == principal.CoachHierarchy) // only allow practitioners assigned to same coach and where they are not assigned to any otehr practitioners
                        {
                            return new PractitionerUserAndNote() { AppUser = practitioner.User };
                        }
                        else
                        {
                            if (practitioner.CoachHierarchy == null || practitioner.CoachHierarchy != principal.CoachHierarchy) 
                            {
                                return new PractitionerUserAndNote() { AppUser = practitioner.User, Note = "Oh no! You can't add this practitioner to your programme. They don't have the same coach that you have. If you need more help, please contact the SmartStart call centre."};
                            }
                            return new PractitionerUserAndNote() { AppUser = practitioner.User, Note = "This practitioner is linked to a different SmartStart programme" };
                        }
                    }
                    else
                    {
                        return new PractitionerUserAndNote() { AppUser = null, Note = "Not on Funda App" };
                    }
                }
            }
            return null;
        }

        public ApplicationUser GetPractitionerByIdNumberInternal(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] ApplicationUserManager userManager,
            IGenericRepositoryFactory repoFactory,
            string idNumber)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practionerUser = userManager.FindByNameAsync(idNumber).Result;
            if (practionerUser != null)
            {
                var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
                var practitioner = practiRepo.GetByUserId(practionerUser.Id);
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
            fieldDefinitionList.Add("MaxChildren", "Number");

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
            fieldList.Add("MaxChildren");

            var reportName = $"Practitioner Template";
            return await fileService.FieldsToExcelTemplate(fieldList, fieldDefinitionList, languageList, reportName);
        }

        public PractitionerReportDetails GetReportDetailsForPractitioner(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IClassroomService classroomService,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            var practitioner = practitionerRepo.GetByUserId(userId);
            var classDetails = classroomService.GetClassroomDetailsForPractitioner(userId);

            var details = new PractitionerReportDetails() { 
                ClassroomGroupId = classDetails.ClassroomGroupId, 
                ClassroomGroupName = classDetails.ClassroomGroupName, 
                Id = classDetails.Id, 
                IdNumber = practitioner.User.IdNumber, 
                InsertedDate = classDetails.InsertedDate, 
                Name = practitioner.User.FullName, 
                Phone = practitioner.User.PhoneNumber, 
                PrincipalName = classDetails.PrincipalName, 
                ProgrammeDays = "Monday to Friday", 
                ProgrammeTypeName = classDetails.ProgrammeTypeName,
                ClassSiteAddress = classDetails.ClassSiteAddress
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
            if (practi.PrincipalHierarchy.HasValue || practi.IsPrincipal == true)
            {
                List<Practitioner> practitioners = practiRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy == practi.PrincipalHierarchy : x.IsPrincipal == true ? x.UserId == Guid.Parse(userId) : x.UserId == Guid.Parse(userId)).ToList();
                //also add principal
                if (practi.IsPrincipal == true)
                {
                    Practitioner practiPrincipal = practiRepo.GetByUserId(practi.UserId.ToString());
                    if (practiPrincipal != null) practitioners.Add(practiPrincipal);
                }
                if (practi.PrincipalHierarchy.HasValue)
                {
                    Practitioner practiPrincipal = practiRepo.GetByUserId(practi.PrincipalHierarchy.ToString());
                    if (practiPrincipal != null) practitioners.Add(practiPrincipal);
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
                            if (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin != false)
                            {
                                practiType = "Funda App Admin";
                            }
                            if (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal != false)
                            {
                                practiType = "Principal/Owner";
                            }
                            if (practiType == "")//if neither of the above, its a default
                            {
                                practiType = "Practitioner";
                            }
                            //get any classroomnames from user and append them
                            var classes = classGroupRepo.GetAll().Where(x => x.UserId.ToString().Contains(practitioner.UserId.ToString()));
                            if (classes.Any())
                            {
                                var classNames = classes.Where(x => x.Name != "").Select(f => f.Name);
                                practiClassroomNames = string.Join(",", classNames);
                            }

                            practitionerColleagues.Add(new PractitionerColleagues() { Name = practiName, NickName = practiNickName, Title = practiType, ProfilePhoto = practiProfile, ContactNumber = practiNumber, ClassroomNames = practiClassroomNames });
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

        public Trainee GetTraineeByUserId(
            [Service] PersonnelService practiManager,
            [Service] UserLicenseManager userLicenseManager,
            string userId)
        {
            return practiManager.GetTraineeByUserId(userLicenseManager, userId);
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

            var practitionerQuery = practitionerRepo.GetAll(pagingInput);
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
                if (practitionerTypeSearch.Contains("Practitioner"))
                {
                    practitionerQuery = practitionerQuery.Where(x => x.IsPrincipal.HasValue && !x.IsPrincipal.Value);
                }
                if (practitionerTypeSearch.Contains("Principal"))
                {
                    practitionerQuery = practitionerQuery.Where(x => x.IsPrincipal.HasValue && x.IsPrincipal.Value);
                }
            }

            // Some connect status search items
            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_removed))
            {
                practitionerQuery = practitionerQuery.Where(x => x.User.IsActive == false);
            }

            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_past_6_months))
            {
                practitionerQuery = practitionerQuery.Where(x =>
                    x.IsRegistered.HasValue && x.IsRegistered.Value
                    && x.User.IsActive
                    && x.User.InsertedDate.HasValue
                    && x.User.LastSeen.Date != x.User.InsertedDate.Value.Date
                    && x.User.LastSeen.Date >= sixMonthsAgo);
            }

            if (connectUsageSearch != null && connectUsageSearch.Contains(Constants.PortalSettings.usage_last_online_over_6_months))
            {
                practitionerQuery = practitionerQuery.Where(x =>
                    x.IsRegistered.HasValue && x.IsRegistered.Value
                    && x.User.IsActive
                    && x.User.InsertedDate.HasValue
                    && x.User.LastSeen.Date != x.User.InsertedDate.Value.Date
                    && x.User.LastSeen.Date <= sixMonthsAgo);
            }

            var userIds = practitionerQuery.Select(x => x.UserId.Value).ToList();
            var invitations = shortenUrlEntityRepo.GetAll()
                .Where(x =>
                    userIds.Contains(x.UserId.Value)
                    && (x.MessageType == TemplateTypeConstants.Invitation || x.MessageType == TemplateTypeConstants.WLInvitation)
                    && x.IsActive
                    && x.Clicked == 0)
                .Select(x => new { x.UserId, x.InsertedDate })
                .OrderByDescending(x => x.InsertedDate)
                .GroupBy(x => x.UserId)
                .ToDictionary(x => x.Key, x => x.First().InsertedDate);

            var practitionerModels = practitionerQuery
                .Select(item => new PortalPractitionerModel
                {
                    Id = item.Id,
                    IsRegistered = (item.IsRegistered == null ? false: (bool)item.IsRegistered),
                    UserId = item.UserId,
                    IsPrincipal = item.IsPrincipal,
                    IsFundaAppAdmin = item.IsFundaAppAdmin,
                    InsertedDate = item.InsertedDate,
                    User = new PortalPractitionerUserModel(item.User, (item.IsRegistered == null ? false : (bool)item.IsRegistered), invitations.ContainsKey(item.UserId) ? invitations[item.UserId] : null)
                })
                .ToList();

            return practitionerModels;
        }
    }
}
