using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers.Users;
using EcdLink.Api.CoreApi.Managers.Users.SmartStart;
using EcdLink.Api.CoreApi.Managers.Visits;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.UrlShortner.Managers;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.SmartStart
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PractitionerQueryExtension
    {
        public PractitionerQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]

        public Practitioner GetPractitionerByUserId(
            [Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practiRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                return practitioner;
            }

            return null;
        }

        public PractitionerUserAndNote GetPractitionerByIdNumber(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            string idNumber)
        {
            var uId = contextAccessor.HttpContext.GetUser()?.Id;
            
            if (uId is null)
                throw new System.Exception("No active user found.");

            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            //retrieve principal, check that the coach lines match, that the user to be searched for is not a principal or an FAA

            var principal = dbRepo.GetByUserId(uId);
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
            [Service] UserManager<ApplicationUser> userManager,
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

        public List<Child> GetAllChildrenForPractitioner(
           [Service] PersonnelService practiManager,
            string userId)
        {
            return practiManager.GetAllChildrenForPractitioner(userId);
        }

        public List<Classroom> GetAllClassroomsForPractitioner([Service] IHttpContextAccessor contextAccessor,
           [Service] PersonnelService practiManager,
            string userId)
        {
            return practiManager.GetAllClassroomsForPractitioner(userId);
        }

        public List<ClassroomGroup> GetAllClassroomGroupsForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] PersonnelService practiManager,
            string userId)
        {
            return practiManager.GetAllClassroomGroupsForPractitioner(userId);
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

        public PrincipalClassroom GetClassroomDetailsForPractitioner([Service] PersonnelService practiManager,
            string userId)
        {
            return practiManager.GetClassroomDetailsForPractitioner(userId);
        }

        public List<ClassroomGroup> GetClassroomGroupClassroomsForPractitioner([Service] PersonnelService practiManager,
            string userId)
        {
            return practiManager.GetAllClassroomGroupsForPractitioner(userId);
        }

        public PractitionerReportDetails GetReportDetailsForPractitioner([Service] IHttpContextAccessor contextAccessor, [Service] PersonnelService practiManager, IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practi = practiRepo.GetByUserId(userId);
            PrincipalClassroom classDetails = practiManager.GetClassroomDetailsForPractitioner(userId);
            PractitionerReportDetails details = new PractitionerReportDetails() { 
                ClassroomGroupId = classDetails.ClassroomGroupId, 
                ClassroomGroupName = classDetails.ClassroomGroupName, 
                Id = classDetails.Id, 
                IdNumber = practi.User.IdNumber, 
                InsertedDate = classDetails.InsertedDate, 
                Name = practi.User.FullName, 
                Phone = practi.User.PhoneNumber, 
                PrincipalName = classDetails.PrincipalName, 
                ProgrammeDays = "Monday to Friday", 
                ProgrammeTypeName = classDetails.ProgrammeTypeName,
                ClassSiteAddress = classDetails.ClassSiteAddress
            };
            return details;
        }

        public List<PractitionerClassroomName> GetClassroomNamesForPractitioner([Service] IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelService practiManager,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            List<PractitionerClassroomName> classrooms = new List<PractitionerClassroomName>();
            List<ClassroomGroup> classroomGroup = practiManager.GetAllClassroomGroupsForPractitioner(userId);
            if (classroomGroup.Count > 0)
            {
                foreach (var group in classroomGroup)
                {
                    string coachName = null;
                    var practitioner = practiRepo.GetByUserId(userId);
                    if (practitioner != null)
                    {
                        if (practitioner.CoachHierarchy != null)
                        {
                            var coach = coachRepo.GetByUserId(practitioner.CoachHierarchy.ToString());
                            if (coach != null)
                            {
                                coachName = coach.User.FullName;
                            }
                        }
                    }
                    Classroom classroom = classroomRepo.GetById(group.ClassroomId);
                    if (classroom != null)
                    {
                        var pcn = new PractitionerClassroomName() { ClassroomGroupId = group.Id, ClassRoomId = classroom.Id, ClassroomName = classroom.Name, CoachName = coachName };
                        classrooms.Add(pcn);
                    }
                }
            }

            return classrooms;
        }

        public async Task<List<Child>> GetAllChildrenByRole([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] RoleManager<IdentityRole> roleManager,
            IGenericRepositoryFactory repoFactory,
            [Service] PersonnelService practiManager,
            string userId)
        {
            string role = await (new RoleQueryTypeExtension()).GetRoleForUser(contextAccessor, userManager, repoFactory, roleManager, userId);
            List<Child> children = new List<Child>();
            if (role != null)
            {
                switch (role)
                {
                    case "Franchisor":
                        children = new FranchisorQueryExtension().GetAllChildrenForFranchisor(contextAccessor, repoFactory, userId);
                        break;
                    case "Coach":
                        children = new CoachQueryExtension().GetAllChildrenForCoach(contextAccessor, repoFactory, userId);
                        break;
                    case "Principal":
                        children = new PrincipalQueryExtension().GetAllChildrenUnderPrincipal(contextAccessor, repoFactory, userId);
                        break;
                    case "Practitioner":
                        children = practiManager.GetAllChildrenForPractitioner(userId);
                        break;
                    default:
                        break;
                }
            }
            return children;
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
                List<Practitioner> practitioners = practiRepo.GetAll().Where(x => x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy.Equals(practi.PrincipalHierarchy) : x.IsPrincipal == true ? x.UserId.Equals(userId) : x.UserId.Equals(userId)).ToList();
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
            return shortUrlManager.GetMessageCountForUser(userId, TemplateTypeConstants.Invitation);
        }

        public string GetLastPractitionerInviteDate(
            [Service] ShortUrlManager shortUrlManager,
            string userId)
        {
            return shortUrlManager.GetLastMessageDateForUser(userId, TemplateTypeConstants.Invitation);
        }

        public List<System.DateTime> GetAllPractitionerInvites(
            [Service] ShortUrlManager shortUrlManager,
            string userId)
        {
            return shortUrlManager.GetAllMessageInvitesForUser(userId, TemplateTypeConstants.Invitation);
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
                .Where(x => x.IsActive && userIds.Contains(x.UserId))
                .ToList();

            return result;
        }

        public List<PractitionerModel> GetAllPractitioners([Service] PersonnelService personnelService)
        {
            return personnelService.GetAllPractitioners();
        }
    }
}
