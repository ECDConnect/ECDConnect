using ECDLink.Abstractrions.Files;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Abstractrions.Services;
using ECDLink.ContentManagement.Entities;
using ECDLink.ContentManagement.Repositories;
using ECDLink.Core.Models.ContentManagement;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.Enums;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Documents;
using EcdLink.Api.CoreApi.GraphApi.Models;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PractitionerQueryExtension
    {
        public PractitionerQueryExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]

        public Practitioner GetPractitionerByUserId([Service] IHttpContextAccessor contextAccessor,
        [Service] IGenericRepositoryFactory repoFactory,
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
            [Service] IGenericRepositoryFactory repoFactory,
            string idNumber)
        {
            //this is the fucntion called from FE to search for practitioners to add practitioners to a principal - so limit to coach lines and non principals only and not practitioners added to any other principals
            var uId = contextAccessor.HttpContext.GetUser().Id;

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
                        } else
                        {
                            return new PractitionerUserAndNote() { AppUser = practitioner.User, Note = "This practitioner is linked to a different SmartStart programme" };
                        }
                    } else
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
    [Service] IGenericRepositoryFactory repoFactory,
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
            return default(ApplicationUser);
        }

        public List<Child> GetAllChildrenForPractitioner([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory,
string userId)
        {
            var childRepo = repoFactory.CreateRepository<Child>(userContext: userId);

            var dbRepo = repoFactory.CreateRepository<Practitioner>(userContext: userId);
            Practitioner practitioner = dbRepo.GetByUserId(userId);

            List<Child> children = childRepo.GetAll().Where(x => x.Hierarchy.Contains(practitioner.Hierarchy)).ToList();
            return children;
        }

        public List<Classroom> GetAllClassroomsForPractitioner([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory,
string userId)
        {
            var classRepo = repoFactory.CreateRepository<Classroom>(userContext: userId);

            return classRepo.GetListByUserId(userId);
        }

        public List<ClassroomGroup> GetAllClassroomGroupsForPractitioner([Service] IHttpContextAccessor contextAccessor,
[Service] IGenericRepositoryFactory repoFactory,
string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: userId);

            return classRepo.GetAll().Where(x => x.UserId.Equals(userId)).ToList();
        }

        public async Task<FileModel> PractitionerExcelTemplateGenerator(
          [Service] IFileGenerationService fileService,
          [Service] IGenericRepositoryFactory repoFactory)
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

        public Classroom GetAllClassroomsForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, string principalId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);

            Classroom classroom = classroomRepo.GetAll().Where(x => x.UserId.Equals(principalId)).FirstOrDefault();
            List<ClassroomGroup> classroomGroups = classroomGroupRepo.GetAll().Where(x => x.ClassroomId.Equals(classroom.Id)).Where(y => y.UserId.Equals(practitionerId)).ToList();
            classroom.ClassroomGroups = classroomGroups; //filter the data for practitioner specific

            return classroom;
        }

        public PrincipalClassroom GetClassroomDetailsForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId); //BYPASS USERHIERARCHY TO SEE UP THE CHAIN
            PrincipalClassroom principalClassroom = new PrincipalClassroom();
            var practitioner = practitionerRepo.GetByUserId(userId);
            if (practitioner != null)
            {
                var principal = practitionerRepo.GetByUserId(practitioner.PrincipalHierarchy.ToString());
                if (principal != null)
                {
                    principalClassroom.PrincipalName = (string.IsNullOrWhiteSpace(principal.User.FullName) ? principal.User.FullName : principal.User.FullName);
                    ClassroomGroup classroomGroup = classroomGroupRepo.GetByUserId(userId);
                    Classroom classroom = null;

                    if (classroomGroup != null)
                    {
                        classroom = classroomRepo.GetById(classroomGroup.ClassroomId);
                        principalClassroom.ClassroomGroupName = classroomGroup.Name;
                    }
                    else
                    {
                        //if no classroomgroup is available to look at, use the classroom for principal
                        classroom = classroomRepo.GetByUserId(principal.UserId);
                    }
                    principalClassroom.ClassroomName = classroom.Name;                    
                }
            }
            return principalClassroom;
        }

        public List<ClassroomGroup> GetClassroomGroupClassroomsForPractitioner([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            //return this.GetAllClassroomGroupsForPractitioner(contextAccessor, repoFactory, userId);
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            List<ClassroomGroup> classroomGroup = classroomGroupRepo.GetListByUserId(userId);
            if (classroomGroup != null)
            {
                return classroomGroup;
            }
            return null;
        }

        public List<PractitionerClassroomName> GetClassroomNamesForPractitioner([Service] IHttpContextAccessor contextAccessor,
    [Service] IGenericRepositoryFactory repoFactory,
    string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var classroomGroupRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classroomRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: uId);
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            List<PractitionerClassroomName> classrooms = new List<PractitionerClassroomName>();
            List<ClassroomGroup> classroomGroup = classroomGroupRepo.GetListByUserId(userId);
            if (classroomGroup.Count>0)
            {
                foreach (var group in classroomGroup)
                {
                    string coachName = null;
                    var practitioner = practiRepo.GetByUserId(userId);
                    if (practitioner != null) {
                        if (practitioner.CoachHierarchy != null) {
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


        public List<Child> GetAllChildrenByRole([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] RoleManager<IdentityRole> roleManager,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId)
        {
            string role = new RoleQueryTypeExtension().GetRoleForUser(contextAccessor, userManager,repoFactory,roleManager, userId);            
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
                        children = this.GetAllChildrenForPractitioner(contextAccessor,repoFactory, userId);
                            break;
                    default:
                        break;
                }
            }
            return children;
        }

        public Dictionary<string,string> GetPractitionerColleagues([Service] IHttpContextAccessor contextAccessor,
    [Service] IGenericRepositoryFactory repoFactory,
    string userId)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Dictionary<string, string> practitionerColleagues = new Dictionary<string, string>();
            Practitioner practi = practiRepo.GetByUserId(userId);
            if (practi.PrincipalHierarchy.HasValue || practi.IsPrincipal == true)
            {
                List<Practitioner> practitioners = practiRepo.GetAll().Where(x => (x.PrincipalHierarchy.HasValue ? x.PrincipalHierarchy.Equals(practi.PrincipalHierarchy) : (x.IsPrincipal == true ? x.UserId.Equals(userId) : x.UserId.Equals(userId)))).ToList();
                //also add principal
                //if (practi.IsPrincipal == true) {
                //    Practitioner practiPrincipal = practiRepo.GetByUserId(practi.UserId.ToString());
                //    if (practiPrincipal != null) practitioners.Add(practiPrincipal);
                //}

                if (practitioners.Count > 0)
                {
                    foreach (var practitioner in practitioners)
                    {
                        if (practitioner.User != null)
                        {
                            string practiName = (practitioner.User.NickFullName != null ? practitioner.User.NickFullName : practitioner.User.FullName);
                            string practiType = "";
                            if (practitioner.IsPrincipal.HasValue && practitioner.IsPrincipal != false)
                            {
                                practiType = "Principal";
                            }
                            else if (practitioner.IsFundaAppAdmin.HasValue && practitioner.IsFundaAppAdmin != false)
                            {
                                practiType = "Funda App Admin";
                            }
                            else
                            {
                                practiType = "Practitioner";
                            }

                            practitionerColleagues.Add(practiName, practiType);
                        }
                    }
                }
            }
            return practitionerColleagues;
        }

    }

    }
