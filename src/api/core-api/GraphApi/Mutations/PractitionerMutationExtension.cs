using DotLiquid;
using DotLiquid.Tags;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Documents;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.UriParser;
using NPOI.SS.UserModel;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;
using System.Text.RegularExpressions;
using static NPOI.HSSF.Util.HSSFColor;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PractitionerMutationExtension
    {
        // EXCEL LEGEND
        // 0 = FirstName
        // 1 = Surname
        // 2 = Cellphone Number
        // 3 = ID / Passport Number
        // 4 = Consent For Photo
        // 5 = Language Used in group
        // 6 = Parent Fees
        // 7 = StartDate
        // 8 = MaxChildren
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]        
        public bool PractitionerImport(
          //[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
          [Service] IGenericRepositoryFactory repoFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ILocaleService<Language> localeService,
          [Service] UserManager<ApplicationUser> userManager,
          string file)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);

            var workbook = WorkbookFactory.Create(fileStream);
                
            var sheet = workbook.GetSheetAt(0);

            var languages = localeService.GetAvailableLocale().ToList();
            
            List<PractitionerImportItem> practitionerImportList = new List<PractitionerImportItem>();
            var headerRow = sheet.GetRow(0);

            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow != null)
                {
                    var firstName = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                    var surename = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                    var cellphone = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                    var idNumber = ExcelHelper.GetCellValue(currentRow.GetCell(3));

                    var consentForPhoto = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    var language = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                    var parentFees = ExcelHelper.GetCellValue(currentRow.GetCell(6));
                    var startDate = ExcelHelper.GetCellValue(currentRow.GetCell(7));
                    var maxChildren = ExcelHelper.GetCellValue(currentRow.GetCell(8));
                    var dob = ExcelHelper.GetCellValue(currentRow.GetCell(9));

                    if (idNumber != null)
                    {                        
                        var languageEntity = languages.Where(x => x.Description == language).FirstOrDefault();
                        if (languageEntity == null)
                        {
                            languageEntity = languages.Where(x => x.Locale == "en-za").FirstOrDefault();
                        }
                        var currentItem = practitionerImportList.Where(x => x.IDNumber == idNumber).FirstOrDefault();

                        var startDateInt = int.Parse(startDate);
                        var dobDateInt = int.Parse(dob);
                        var item = currentItem != null ? currentItem : new PractitionerImportItem();
                        item.FirstName = firstName;
                        item.Surname = surename;
                        item.PhoneNumber = cellphone;
                        item.IDNumber = idNumber;
                        item.ConsentForPhoto = consentForPhoto == "Yes" ? true : false;
                        item.ParentFees = int.Parse(parentFees);
                        item.StartDate = startDateInt > 0 ? DateTime.FromOADate(startDateInt) : DateTime.Now;
                        item.MaxChildren = int.Parse(maxChildren);
                        item.LanguageId = languageEntity.Id;
                        item.Dob = dobDateInt > 0 ? DateTime.FromOADate(dobDateInt) : DateTime.Now;

                        if (currentItem == null) practitionerImportList.Add(item);
                    }
                }
            }

            var templist = new List<Practitioner>();

            if (practitionerImportList.Count > 0)
            {
                foreach (var practitioner in practitionerImportList)
                {
                    string userId = Guid.NewGuid().ToString();
                    var newUser = new ApplicationUser
                    {
                        Id = userId.ToString(),
                        PhoneNumber = practitioner.PhoneNumber,
                        UserName = practitioner?.IDNumber,
                        IdNumber = practitioner?.IDNumber,                        
                        IsSouthAfricanCitizen = true,
                        VerifiedByHomeAffairs = true,
                        DateOfBirth = practitioner.Dob,                                                
                        FirstName = practitioner.FirstName,
                        Surname = practitioner.Surname,
                        FullName = $"{practitioner.FirstName} {practitioner.Surname}",
                        ContactPreference = "sms",
                        IsActive = true,
                        TenantId = tenantId
                    };

                    var userCreatedResult = userManager.CreateAsync(newUser).Result;

                    templist.Add(new Practitioner
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        MaxChildren = practitioner.MaxChildren,
                        ConsentForPhoto = practitioner.ConsentForPhoto,
                        ParentFees = practitioner.ParentFees,
                        StartDate = practitioner.StartDate,
                        IsActive = true,
                        TenantId = tenantId
                    });

                    var userRole = userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER).Result;
                }
            }

            var importerUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: importerUserId);

            foreach (var prac in templist)
            {
                prac.TenantId = tenantId;
                var addedPractitioner = practitionerRepo.Insert(prac);
            }

            return true;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool ImportAll(
                    //[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
                    [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
                    [Service] InvitationNotificationManager notificationManager,
                      [Service] IGenericRepositoryFactory repoFactory,
                      [Service] IHttpContextAccessor httpContextAccessor,
                      [Service] ILocaleService<Language> localeService,
                      [Service] UserManager<ApplicationUser> userManager,
                      string file)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);

            var workbook = WorkbookFactory.Create(fileStream);

            var languages = localeService.GetAvailableLocale().ToList();

            List<ImportAllStaffItem> practitionerImportList = new List<ImportAllStaffItem>();


            //var headerRow = sheet.GetRow(0);

            //set sharedinfo needed between rows
            //bool matchWithSite = false;
            //string siteIndicator = "";
            //string parentUserId = null;

            var password = "AQAAAAEAACcQAAAAEG8HH4NQmDeD+mt5aV4WZLhKb4LnQN3HdkzGloeqmaH6qbA37HSVhysm+hPEq1NKZg==";
            var securityStamp = "NXAOZGBIVGAMGCHVNGN2WFJXPLPS67YD";
            var concurrencystamp = "d0797595-3855-4e5c-aebf-cf7300ddae02";
            string franchisorId = "";

            var uId = httpContextAccessor.HttpContext.GetUser().Id;

            var programmeTypeRepo = repoFactory.CreateGenericRepository<ProgrammeType>(userContext: uId);

            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: uId);
            var addressRepo = repoFactory.CreateGenericRepository<SiteAddress>(userContext: uId);
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

            var classroomRepo = repoFactory.CreateRepository<Classroom>(userContext: uId);
            var classroomGenericRepo = repoFactory.CreateGenericRepository<Classroom>(userContext: uId);
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var classroomGroupGenericRepo = repoFactory.CreateGenericRepository<ClassroomGroup>(userContext: uId);
            var classProgrammeRepo = repoFactory.CreateRepository<ClassProgramme>(userContext: uId);
            var classProgrammeGenericRepo = repoFactory.CreateGenericRepository<ClassProgramme>(userContext: uId);
            var learnerRepo = repoFactory.CreateRepository<Learner>(userContext: uId);
            var learnerGenericRepo = repoFactory.CreateGenericRepository<Learner>(userContext: uId);

            var childRepo = repoFactory.CreateRepository<Child>(userContext: uId);
            var childGenericRepo = repoFactory.CreateGenericRepository<Child>(userContext: uId);
            var caregiverRepo = repoFactory.CreateGenericRepository<Caregiver>(userContext: uId);

            var staticLanguageRepo = repoFactory.CreateGenericRepository<Language>(userContext: uId);
            var staticEducationRepo = repoFactory.CreateGenericRepository<Education>(userContext: uId);
            var staticRelationRepo = repoFactory.CreateGenericRepository<Relation>(userContext: uId);
            var staticGenderRepo = repoFactory.CreateGenericRepository<Gender>(userContext: uId);
            var staticGrantRepo = repoFactory.CreateGenericRepository<Grant>(userContext: uId);
            var staticConsentRepo = repoFactory.CreateGenericRepository<UserConsent>(userContext: uId);
            var staticProgrammeTypeRepo = repoFactory.CreateGenericRepository<ProgrammeType>(userContext: uId);
            var staticRaceRepo = repoFactory.CreateGenericRepository<Race>(userContext: uId);

            var staticHierarchyRepo = repoFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: uId);

            var staticWorkflowRepo = repoFactory.CreateGenericRepository<WorkflowStatus>(userContext: uId);

            //SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
            var sheet1 = workbook.GetSheetAt(0);
            for (var row = 0; row <= sheet1.LastRowNum; row++)
            {
                var currentRow = sheet1.GetRow(row);

                if (currentRow != null)
                {
                    //check the indicator of what type of staff the row is - Franchisee(practitioner)/Principal/Coach/Franchisor/FAA(FundaAppAdmin)
                    var matchWithSite = (ExcelHelper.GetCellValue(currentRow.GetCell(0)) == "YES" ? true : false);
                    
                    var siteIndicator = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                    
                    //var programme_indicator = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                    //var prograammeArr = programme_indicator.Split("_");

                    var fullname = ExcelHelper.GetCellValue(currentRow.GetCell(3)).Trim();
                    fullname = Regex.Replace(fullname, @"\s+", " ");
                    var nameArr = fullname.Split(' ');
                    var firstname = (nameArr.Count()>2 ? nameArr[0] + " " + nameArr[1] : nameArr[0]);
                    var surname = (nameArr.Count() > 2 ? nameArr[2]: nameArr[1]);

                    var idNumber = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    var cellnumber = ExcelHelper.GetCellValue(currentRow.GetCell(5));

                    var programmeTypeDesc = ExcelHelper.GetCellValue(currentRow.GetCell(7));
                    var programmeType = programmeTypeRepo.GetAll().Where(x => x.Description.Equals(programmeTypeDesc)).FirstOrDefault();

                    var siteArea = ExcelHelper.GetCellValue(currentRow.GetCell(8));
                    var siteName = ExcelHelper.GetCellValue(currentRow.GetCell(9));
                    var className = ExcelHelper.GetCellValue(currentRow.GetCell(10));

                    var coachName = ExcelHelper.GetCellValue(currentRow.GetCell(11)).Trim();
                    var coachID = ExcelHelper.GetCellValue(currentRow.GetCell(12));
                    var franchisorhName = ExcelHelper.GetCellValue(currentRow.GetCell(13));
                    var coachNumber = ExcelHelper.GetCellValue(currentRow.GetCell(14));

                    var parentUserIdNumber = ExcelHelper.GetCellValue(currentRow.GetCell(15));



                    char[] digits = idNumber.ToCharArray();//new String(idNumber.TakeWhile(Char.IsDigit).ToArray());
                    var dob = new DateTime(Int32.Parse("19" + digits[0] + digits[1]), Int32.Parse(digits[2].ToString() + digits[3].ToString()), Int32.Parse(digits[4].ToString() + digits[5].ToString()));


                    //var languageEntity = languages.Where(x => x.Description == language).FirstOrDefault();
                    //if (languageEntity == null)
                    //{
                    //    languageEntity = languages.Where(x => x.Locale == "en-za").FirstOrDefault();
                    //}
                    var currentItem = practitionerImportList.Where(x => x.IDNumber == idNumber).FirstOrDefault();
                    var item = currentItem != null ? currentItem : new ImportAllStaffItem();
                    item.MatchWithSite = matchWithSite;
                    item.SiteIndicator = siteIndicator;
                    //item.ParentUserId = (parentUserId!=null?parentUserId: null);
                    item.FirstName = firstname;
                    item.Surname = surname;
                    item.FullName = fullname;
                    item.PhoneNumber = cellnumber;
                    item.IDNumber = idNumber;
                    item.ProgrammeTypeDesc = programmeTypeDesc;
                    item.ProgrammeTypeId = programmeType.Id.ToString();
                    item.SiteArea = siteArea;
                    item.SiteName = siteName;
                    item.ClassName = className;
                    item.CoachName = coachName;
                    item.CoachID = coachID;
                    item.FranchisorhName = franchisorhName;
                    item.CoachNumber = coachNumber;
                    item.ParentUserIdNumber = (parentUserIdNumber!="0"?parentUserIdNumber:null);
                    item.Dob = dob;//dobDateInt > 0 ? DateTime.FromOADate(dobDateInt) : DateTime.Now;

                    if (currentItem == null) practitionerImportList.Add(item);
                }
            }

            //first accumulate list of COACH and create coach users
            if (practitionerImportList.Count > 0)
            {
                //get franchisor overseeing everything
                var franchisor = franchisorRepo.GetAll().Where(x => x.User.FullName == practitionerImportList.FirstOrDefault().FranchisorhName).FirstOrDefault();//all is assigned to same franchisor
                franchisorId = franchisor.UserId;

                foreach (var coach in practitionerImportList)
                {
                    string userId = Guid.NewGuid().ToString();

                    var fullname = Regex.Replace(coach.CoachName, @"\s+", " ");
                    var nameArr = fullname.Split(' ');

                    var firstname = (nameArr.Count() > 2 ? nameArr[0] + " " + nameArr[1] : nameArr[0]);
                    var surname = (nameArr.Count() > 2 ? nameArr[2] : nameArr[1]);
                    char[] coachdigits = coach.CoachID.ToCharArray();//new String(idNumber.TakeWhile(Char.IsDigit).ToArray());
                    var coachdob = new DateTime(Int32.Parse("19" + coachdigits[0] + coachdigits[1]), Int32.Parse(coachdigits[2].ToString() + coachdigits[3].ToString()), Int32.Parse(coachdigits[4].ToString() + coachdigits[5].ToString()));

                    //check user dont exist first
                    var existingUser = userManager.Users.Where(x => x.IdNumber == coach.CoachID).FirstOrDefault();

                    if (existingUser == null)
                    {
                        var newUser = new ApplicationUser
                        {
                            Id = userId.ToString(),
                            PhoneNumber = coach.CoachNumber,
                            UserName = coach?.CoachID,
                            IdNumber = coach?.CoachID,
                            IsSouthAfricanCitizen = true,
                            VerifiedByHomeAffairs = true,
                            DateOfBirth = coachdob,
                            FirstName = firstname,
                            Surname = surname,
                            FullName = fullname,//$"{practitioner.FirstName} {practitioner.Surname}",
                            ContactPreference = "sms",
                            IsActive = true,
                            //PasswordHash = password,
                            //SecurityStamp = securityStamp,
                            //ConcurrencyStamp = concurrencystamp
                            TenantId = tenantId,
                        };
                        var userCreatedResult = userManager.CreateAsync(newUser).Result;
                        var userRole = userManager.AddToRoleAsync(newUser, Roles.COACH).Result;
                        var siteaddressid = addressRepo.GetAll().Where(x => x.AddressLine1 == "Kellner St").FirstOrDefault().Id;

                        var cc = new Coach
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            SiteAddressId = siteaddressid,
                            AreaOfOperation = "Office",
                            FranchisorId = Guid.Parse(franchisorId),
                            //MaxChildren = practitioner.MaxChildren,
                            //ConsentForPhoto = practitioner.ConsentForPhoto,
                            //ParentFees = practitioner.ParentFees,
                            //StartDate = practitioner.StartDate,
                            IsActive = true
                        };
                        coachRepo.Insert(cc);

                        //    //invite to application
                        //    //invite.SendInviteToApplication(invitationManager, notificationManager, userManager, prac.UserId);
                    }
                }
            }

            //create practitioners
            if (practitionerImportList.Count > 0)
            {
                foreach (var practitioner in practitionerImportList)
                {
                    var existingUser = userManager.Users.Where(x => x.IdNumber == practitioner.IDNumber).FirstOrDefault();

                    if (existingUser == null)
                    {
                        var coachUser = userManager.Users.Where(x => x.IdNumber == practitioner.CoachID).FirstOrDefault();
                        
                        var parentUser = (practitioner.ParentUserIdNumber!=null?userManager.Users.Where(x => x.IdNumber == practitioner.ParentUserIdNumber).FirstOrDefault():null);
                        //var principalUser = userManager.Users.Where(x => x.IdNumber == practitioner.CoachID).FirstOrDefault();
                        string userId = Guid.NewGuid().ToString();
                        var newUser = new ApplicationUser
                        {
                            Id = userId.ToString(),
                            PhoneNumber = practitioner.PhoneNumber,
                            UserName = practitioner?.IDNumber,
                            IdNumber = practitioner?.IDNumber,
                            IsSouthAfricanCitizen = true,
                            VerifiedByHomeAffairs = true,
                            DateOfBirth = practitioner.Dob,
                            FirstName = practitioner.FirstName,
                            Surname = practitioner.Surname,
                            FullName = practitioner.FullName,//$"{practitioner.FirstName} {practitioner.Surname}",
                            ContactPreference = "sms",
                            IsActive = true,
                            PasswordHash = password,
                            //SecurityStamp = securityStamp,
                            //ConcurrencyStamp = concurrencystamp
                            TenantId = tenantId
                        };
                        var userCreatedResult = userManager.CreateAsync(newUser).Result;

                        var newPractitioner = new Practitioner
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            CoachHierarchy = Guid.Parse(coachUser?.Id),
                            //PrincipalHierarchy = (practitioner.ParentUserId!=null?Guid.Parse(practitioner.ParentUserId): null),
                            //MaxChildren = practitioner.MaxChildren,
                            //ConsentForPhoto = practitioner.ConsentForPhoto,
                            //ParentFees = practitioner.ParentFees,
                            //StartDate = practitioner.StartDate,
                            IsActive = true,
                            TenantId = tenantId
                            
                        };


                        if (practitioner.SiteIndicator == "Franchisee" && parentUser != null)
                        {
                            newPractitioner.PrincipalHierarchy = Guid.Parse(parentUser.Id);
                        }
                        else if (practitioner.SiteIndicator == "FAA")
                        {
                            newPractitioner.IsFundaAppAdmin = true;
                            newPractitioner.IsPrincipal = true;
                        }
                        else if (practitioner.SiteIndicator == "Principal")
                        {
                            newPractitioner.IsPrincipal = true;
                            newPractitioner.IsFundaAppAdmin = true;
                        }
                        var addedPractitioner = practitionerRepo.Insert(newPractitioner);
                        var usersHierarchy = addedPractitioner.Hierarchy;

                        //sort roles
                        if (practitioner.SiteIndicator != "Principal")
                        {
                            var userRole = userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER).Result;
                        }
                        else
                        {
                            //var userRole = userManager.AddToRoleAsync(newUser, Roles.PRINCIPAL).Result;
                            var userRole = userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER).Result;
                        }
                        //    //invite to application
                        //    //invite.SendInviteToApplication(invitationManager, notificationManager, userManager, prac.UserId);

                        //create classrooms and classroomgroups and programmes
                        Classroom pracClass = new Classroom()
                        {
                            Id = Guid.NewGuid(),
                            UserId = userId,
                            IsActive = true,
                            TenantId = tenantId,
                            Name = practitioner.SiteName,
                            IsPrinciple = true,
                            NumberPractitioners = 1,
                            Hierarchy = usersHierarchy
                        };
                        var retClass = classroomGenericRepo.Insert(pracClass);

                        /*move this to child record because only then do we know the groups*/
                        /*ClassroomGroup pracClassGroup = new ClassroomGroup()
                        {
                            Id = Guid.NewGuid(),
                            UserId = Guid.Parse(userId),
                            IsActive = true,
                            TenantId = tenantId,
                            Name = "Group A", //practitioner.SiteName,
                            ClassroomId = retClass.Id,          
                            Hierarchy = usersHierarchy
                        };
                        if (practitioner.ProgrammeTypeId != null) {
                            pracClassGroup.ProgrammeTypeId = Guid.Parse(practitioner.ProgrammeTypeId);
                        }
                        var retClassGroup = classroomGroupGenericRepo.Insert(pracClassGroup);

                        //create programme
                        for (var iidx = 1; iidx <= 5; iidx++)
                        {
                            ClassProgramme pracClassGroupProgramme = new ClassProgramme()
                            {
                                Id = Guid.NewGuid(),
                               MeetingDay = iidx,
                               IsFullDay = true,
                                IsActive = true,
                                TenantId = tenantId,
                                ProgrammeStartDate = DateTime.Now,
                                ClassroomGroupId = pracClassGroup.Id,
                                Hierarchy = usersHierarchy
                            };
                            var retClassGroupProgramme = classProgrammeGenericRepo.Insert(pracClassGroupProgramme);
                        }*/
                    }
                }
            }


            List<ImportAllChildInfoItem> childImportListItem = new List<ImportAllChildInfoItem>();

            //now do sheet 2
            var sheet2 = workbook.GetSheetAt(1);
            int idx = 1;
            for (var row = 0; row <= sheet2.LastRowNum; row++)
            {
                var currentRow = sheet2.GetRow(row);

                if (currentRow != null)
                {

                    var Fullname = ExcelHelper.GetCellValue(currentRow.GetCell(0)).Trim();
                    var FirstName = ExcelHelper.GetCellValue(currentRow.GetCell(1)).Trim();
                    var Surname = ExcelHelper.GetCellValue(currentRow.GetCell(2)).Trim();
                    var Dob = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                    var IDNumber = ExcelHelper.GetCellValue(currentRow.GetCell(4));

                    var FranchiseeType = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                    var ECDType = ExcelHelper.GetCellValue(currentRow.GetCell(6));
                    var FranchiseeName = ExcelHelper.GetCellValue(currentRow.GetCell(7));
                    var FranchiseeIDNumber = ExcelHelper.GetCellValue(currentRow.GetCell(8));

                    var EmergencyContactName = ExcelHelper.GetCellValue(currentRow.GetCell(9));
                    var EmergencyContactNo = ExcelHelper.GetCellValue(currentRow.GetCell(10));

                    var EthnicGroup = ExcelHelper.GetCellValue(currentRow.GetCell(11));
                    var Gender = ExcelHelper.GetCellValue(currentRow.GetCell(12));
                    var PlayGroup = ExcelHelper.GetCellValue(currentRow.GetCell(13));

                    var PrimaryCaregiverName = ExcelHelper.GetCellValue(currentRow.GetCell(16));
                    var GrantRecipient = ExcelHelper.GetCellValue(currentRow.GetCell(17));
                    var HomeLanguage = ExcelHelper.GetCellValue(currentRow.GetCell(18));
                    var HasAllergies = ExcelHelper.GetCellValue(currentRow.GetCell(19));
                    var HasDisabilities = ExcelHelper.GetCellValue(currentRow.GetCell(20));
                    var HasHealthIssues = ExcelHelper.GetCellValue(currentRow.GetCell(21));
                    var TypeoffAllergies = ExcelHelper.GetCellValue(currentRow.GetCell(22));
                    var TypeofDisability = ExcelHelper.GetCellValue(currentRow.GetCell(23));
                    var Education = ExcelHelper.GetCellValue(currentRow.GetCell(25));

                    var CaregiverIdNumber = ExcelHelper.GetCellValue(currentRow.GetCell(26));
                    var CaregiverLanguage = ExcelHelper.GetCellValue(currentRow.GetCell(27));
                    var CaregiverRelationship = ExcelHelper.GetCellValue(currentRow.GetCell(28));
                    var CaregiverContactNo = ExcelHelper.GetCellValue(currentRow.GetCell(29));
                    var ParentFees = ExcelHelper.GetCellValue(currentRow.GetCell(30));

                    var ConsentForPhoto = ExcelHelper.GetCellValue(currentRow.GetCell(31));
                    var ConsentFroPopia = ExcelHelper.GetCellValue(currentRow.GetCell(32));

                    string calcdob = null;
                    if (IDNumber != null) {
                        char[] childdigits = IDNumber.ToCharArray();
                        calcdob = new DateTime(Int32.Parse("20" + childdigits[0] + childdigits[1]), Int32.Parse(childdigits[2].ToString() + childdigits[3].ToString()), Int32.Parse(childdigits[4].ToString() + childdigits[5].ToString())).ToString();
                    }
                    Dob = calcdob;//(Dob != null ? Dob.Replace("/", "-") : calcdob);

                    ImportAllChildInfoItem childItem = new ImportAllChildInfoItem()
                    {
                        Fullname = Fullname,
                        FirstName = FirstName,
                        Surname = Surname,
                        Dob = (Dob != null ? Dob : "2022-01-01"),
                        IDNumber = (IDNumber != null ? IDNumber : "0000000000" + idx),
                        ProgramType = FranchiseeType,
                        ECDType = ECDType,
                        FranchiseeName = (FranchiseeName != null ? FranchiseeName.Trim() : null),
                        FranchiseeIDNumber = FranchiseeIDNumber,
                        EmergencyContactFullName = (EmergencyContactName!=null?EmergencyContactName.Trim():null),
                        EmergencyContactPhoneNumber = EmergencyContactNo,
                        EthnicGroup = EthnicGroup,
                        Gender = Gender,
                        PlayGroupGroup = PlayGroup,
                        PrimaryCaregiver = (PrimaryCaregiverName != null ? PrimaryCaregiverName.Trim() : null),
                        GrantRecipient = GrantRecipient,
                        HomeLanguage = HomeLanguage,
                        Allergies = (HasAllergies != null ? (HasAllergies == "No" ? false : true) : false),
                        Disabilities = (HasDisabilities != null ? (HasDisabilities == "No" ? false : true) : false),
                        HealthConditions = (HasHealthIssues != null ? (HasHealthIssues == "No" ? false : true) : false),
                        TypeofAllergies = TypeoffAllergies,
                        TypeofDisabilities = TypeofDisability,
                        CaregiverEducation = Education,
                        CaregiverIDNumber = CaregiverIdNumber,
                        CaregiverLanguage = CaregiverLanguage,
                        CaregiverRelationship = CaregiverRelationship,
                        CaregiverContactNo = CaregiverContactNo,
                        ParentFees = ParentFees,
                        ConsentForPhoto = (ConsentForPhoto != null ? (ConsentForPhoto == "No" ? false : true) : false),
                        ConsentForPopia = (ConsentFroPopia != null ? (ConsentFroPopia == "No" ? false : true) : false)
                    };

                    childImportListItem.Add(childItem);
                }
                idx++;
            }


            //now run child logic
            
            if (childImportListItem.Count > 0)
            {
                int idx2 = 0;
                foreach (var childItem in childImportListItem)
                {
                    var existingUser = userManager.Users.Where(x => x.IdNumber == childItem.IDNumber).FirstOrDefault();

                    if (existingUser == null)
                    {
                        var parentUser = userManager.Users.Where(x => x.IdNumber == childItem.FranchiseeIDNumber).FirstOrDefault();
                        if (parentUser != null)
                        {

                            var practiParent = practitionerRepo.GetByUserId(parentUser.Id);//(parentUser.practitionerObjectData != null ? parentUser.practitionerObjectData.Hierarchy : (parentUser.principalObjectData != null ? parentUser.principalObjectData.Hierarchy : ""));
                            string parentHierarchy = practiParent.Hierarchy;
                            var caregivefullname = Regex.Replace(childItem.PrimaryCaregiver, @"\s+", " ");
                            var nameArr = caregivefullname.Split(' ');
                            var cgfirstname = (nameArr.Count() > 2 ? nameArr[0] + " " + nameArr[1] : nameArr[0]);
                            var cgsurname = (nameArr.Count() > 2 ? nameArr[2] : nameArr[1]);

                            var emergencyfullname = "";
                            var emerfirstname = "";
                            var emersurname = "";
                            if (childItem.EmergencyContactFullName != null)
                            {
                                emergencyfullname = Regex.Replace(childItem.EmergencyContactFullName, @"\s+", " ");
                                var nameArrEmer = caregivefullname.Split(' ');
                                emerfirstname = (nameArrEmer.Count() > 2 ? nameArrEmer[0] + " " + nameArrEmer[1] : nameArrEmer[0]);
                                emersurname = (nameArrEmer.Count() > 2 ? nameArrEmer[2] : nameArrEmer[1]);
                            } else if (childItem.PrimaryCaregiver != null) {
                                emerfirstname = cgfirstname;
                                emersurname = cgsurname;
                                emergencyfullname = caregivefullname;
                            }
                            //check language
                            var languageEntity = languages.Where(x => x.Description.Contains(childItem.HomeLanguage)).FirstOrDefault();
                            if (languageEntity == null)
                            {
                                languageEntity = languages.Where(x => x.Locale == "en-za").FirstOrDefault();
                            }

                            Guid? relation = null;
                            if (childItem.CaregiverRelationship != null)
                            {
                                var sRelation = staticRelationRepo.GetAll().Where(x => x.Description.Contains(childItem.CaregiverRelationship)).FirstOrDefault();
                                if (sRelation != null)
                                    relation = sRelation.Id;
                            } else
                            {
                                var sRelation = staticRelationRepo.GetAll().Where(x => x.Description.Contains("Guardian")).FirstOrDefault();
                                if (sRelation != null)
                                    relation = sRelation.Id;
                            }

                            Guid? education = null;
                            if (childItem.CaregiverEducation != null)
                            {
                                var sEducation = staticRelationRepo.GetAll().Where(x => x.Description.Contains(childItem.CaregiverEducation)).FirstOrDefault();
                                if (sEducation != null)
                                    education = sEducation.Id;
                            } else
                            {
                                var sEducation = staticRelationRepo.GetAll().Where(x => x.Description.Contains("Matric")).FirstOrDefault();
                                if (sEducation != null)
                                    education = sEducation.Id;
                            }

                            Guid? gender = null;
                            if (childItem.Gender != null)
                            {
                                var sgender = staticGenderRepo.GetAll().Where(x => x.Description.Contains(childItem.Gender)).FirstOrDefault();
                                if (gender != null)
                                    gender = sgender.Id;
                            } else
                            {
                                var sgender = staticGenderRepo.GetAll().Where(x => x.Description.Contains("Boy")).FirstOrDefault();
                                if (gender != null)
                                    gender = sgender.Id;
                            }


                            Guid? race = null;
                            if (childItem.EthnicGroup != null)
                            {
                                var srace = staticRaceRepo.GetAll().Where(x => x.Description.Contains(childItem.EthnicGroup)).FirstOrDefault();
                                if (srace != null)
                                    race = srace.Id;
                            } else
                            {
                                var srace = staticRaceRepo.GetAll().Where(x => x.Description.Contains("Other")).FirstOrDefault();
                                if (srace != null)
                                    race = srace.Id;
                            }


                            Guid? grant = null;
                            if (childItem.GrantRecipient != null)
                            {
                                string sgrantremap = "";
                                if (childItem.GrantRecipient == "No")
                                    sgrantremap = "None";
                                else
                                    sgrantremap = "Child Support Grant";

                                var sGrant = staticGrantRepo.GetAll().Where(x => x.Description.Contains(sgrantremap)).FirstOrDefault();
                                if (sGrant != null)
                                    grant = sGrant.Id;
                            }


                            //create caregiver record
                            var newCaregiver = new Caregiver
                            {
                                Id = Guid.NewGuid(),
                                IsActive = true,
                                TenantId = tenantId,

                                IdNumber = childItem.CaregiverIDNumber,
                                FirstName = cgfirstname,
                                Surname = cgsurname,
                                FullName = caregivefullname,
                                PhoneNumber = childItem.CaregiverContactNo,
                                EmergencyContactFirstName = childItem.EmergencyContactFullName,
                                JoinReferencePanel = false,
                                Contribution = false,
                                RelationId = relation,
                                EducationId = education,
                                AdditionalFirstName = emerfirstname,
                                AdditionalSurname = emersurname

                            };
                            var addedCaregiver = caregiverRepo.Insert(newCaregiver);

                            //create child user
                            string userId = Guid.NewGuid().ToString();
                            var newUser = new ApplicationUser
                            {
                                Id = userId.ToString(),
                                PhoneNumber = childItem.CaregiverContactNo,
                                UserName = childItem?.IDNumber,
                                IdNumber = childItem?.IDNumber,
                                IsSouthAfricanCitizen = true,
                                VerifiedByHomeAffairs = true,
                                DateOfBirth = DateTime.Parse(childItem.Dob),
                                FirstName = childItem.FirstName,
                                Surname = childItem.Surname,
                                FullName = childItem.Fullname,
                                ContactPreference = "sms",
                                IsActive = true,
                                //PasswordHash = password,
                                //SecurityStamp = securityStamp,
                                //ConcurrencyStamp = concurrencystamp
                                TenantId = tenantId
                            };
                            if (gender != null) { 
                                newUser.GenderId = gender;
                            }
                            if (race != null)
                            {
                                newUser.RaceId = race;
                            }
                            var userCreatedResult = userManager.CreateAsync(newUser).Result;

                            var workflow = staticWorkflowRepo.GetAll().Where(x => x.Description == "Active").FirstOrDefault();
                            //create child record
                            var newChild = new Child
                            {
                                Id = Guid.NewGuid(),
                                UserId = userId,
                                CaregiverId = newCaregiver.Id,
                                IsActive = true,
                                TenantId = tenantId,
                                Allergies = childItem.TypeofAllergies,
                                Disabilities = childItem.TypeofDisabilities,
                                //Hierarchy = parentHierarchy,
                                //OtherHealthConditions = (childItem.HealthConditions?true:false),
                                WorkflowStatusId = workflow.Id
                            };
                            var addedChild = childRepo.Insert(newChild);
                            //add child role
                            var userRole = userManager.AddToRoleAsync(newUser, Roles.CHILD).Result;

                            //update the children hierarchy
                            string childNewHierarchy = "";                            
                            UserHierarchyEntity childHierarchy = staticHierarchyRepo.GetAll().Where(x => x.UserId.Equals(userId)).FirstOrDefault();
                            
                            if (childHierarchy != null)
                            {
                                //update NamedTypePath to not be System.Child. but System.Administrator.Practitioner.Child.
                                childHierarchy.NamedTypePath = childHierarchy.NamedTypePath.Replace("System.Child.", "System.Administrator.Practitioner.Child.");
                                //update hierarchy not be 0.466. but 0.1.455.459.
                                childNewHierarchy = childHierarchy.Hierarchy.Replace("0.", parentHierarchy);
                                childHierarchy.Hierarchy = childNewHierarchy;
                                childHierarchy.UserId = userId;
                                childHierarchy.ParentId = parentUser.Id;

                                staticHierarchyRepo.Update(childHierarchy);
                            }
                            //update child hierarchy
                            Child newChildHierarchyUpdate = childGenericRepo.GetByUserId(userId);
                            newChildHierarchyUpdate.Hierarchy = childNewHierarchy;
                            childGenericRepo.Update(newChildHierarchyUpdate);

                            /*
                                        //now add the kids to classrooms and playgroups
                                        var fullListGroups = classroomGroupGenericRepo.GetAll();//.Where(x => x.UserId.Equals(parentUser.Id)).ToList(); //classroomGroupGenericRepo.GetAll().ToList();//.Where(x => x.UserId.Equals(parentUser.Id)).ToList();//GetListByUserId(parentUser.Id).ToList();
                                        List < ClassroomGroup > parentClassroomGroups = new List<ClassroomGroup>();
                                        foreach (ClassroomGroup group in fullListGroups)
                                        {
                                            if (group.UserId.ToString() == parentUser.Id)
                                            {
                                                parentClassroomGroups.Add(group);
                                            }
                                        }
                                        //parentClassroomGroups = parentClassroomGroups.Where(x => x.UserId.).ToList();
                                        //check if the playgroup/classroomgroup exists for the parent, if not create it from teh child record, assigning heirarchy
                                        string playGroupId = null;
                                        if (parentClassroomGroups.Any())
                                        {
                                            //check if this playgroup exists already and assign  the learner to it
                                            ClassroomGroup classMapped = parentClassroomGroups.Where(x => x.Name.Contains(childItem.PlayGroupGroup)).FirstOrDefault();
                                            if (classMapped != null)
                                            {
                                                playGroupId = classMapped.Id.ToString();
                                            } else
                                            {
                                                //get the cassroomid from teh poarent classroom that exists
                                                var existingClassGroup = parentClassroomGroups.FirstOrDefault();
                                                Guid pgId = Guid.NewGuid();
                                                //create the playgroup
                                                ClassroomGroup newGroup = new ClassroomGroup()
                                                {
                                                    Name = childItem.PlayGroupGroup,
                                                    UserId = Guid.Parse(parentUser.Id),
                                                    ClassroomId = existingClassGroup.Id,
                                                    ProgrammeTypeId = existingClassGroup.ProgrammeTypeId,
                                                    Hierarchy = parentHierarchy,//existingClassGroup.Hierarchy,
                                                    Id = pgId,
                                                    TenantId = tenantId
                                                };
                                                var retNewGroup = classroomGroupGenericRepo.Insert(newGroup);
                                                playGroupId = pgId.ToString();

                                            }
                                            Learner newLearner = new Learner()
                                            {
                                                UserId = userId,
                                                ClassroomGroupId = Guid.Parse(playGroupId),
                                                StartedAttendance = DateTime.Now,
                                                Hierarchy = parentHierarchy
                                            };
                                            var newLearnerRet = learnerGenericRepo.Insert(newLearner);
                                        }
                            */

                            /*moved this from practitioner record to here because only then do we know the groups*/
                            //get the classroom
                            Classroom existingClassroom = classroomGenericRepo.GetAll().Where(x => x.UserId.Equals(parentUser.Id)).FirstOrDefault();
                            if (existingClassroom != null)
                            {
                                var programmeType = programmeTypeRepo.GetAll().Where(x => x.Description.Equals(childItem.ECDType)).FirstOrDefault();

                                //check if this specific group exists already
                                var fullListGroups = classroomGroupGenericRepo.GetAll();//.Where(x => x.UserId.Equals(parentUser.Id)).ToList(); //classroomGroupGenericRepo.GetAll().ToList();//.Where(x => x.UserId.Equals(parentUser.Id)).ToList();//GetListByUserId(parentUser.Id).ToList();
                                List<ClassroomGroup> parentClassroomGroups = new List<ClassroomGroup>();
                                foreach (ClassroomGroup group in fullListGroups)
                                {
                                    if (group.UserId.ToString() == parentUser.Id)
                                    {
                                        parentClassroomGroups.Add(group);
                                    }
                                }
                                var existingGroup = parentClassroomGroups.Where(x => x.Name.Equals(childItem.PlayGroupGroup)).FirstOrDefault();
                                string programmeGroupId = null;
                                if (existingGroup == null)
                                {
                                    //if the group doesnt exist yet, create it
                                    ClassroomGroup pracClassGroup = new ClassroomGroup()
                                    {
                                        Id = Guid.NewGuid(),
                                        UserId = Guid.Parse(parentUser.Id),
                                        IsActive = true,
                                        TenantId = tenantId,
                                        Name = childItem.PlayGroupGroup, //practitioner.SiteName,
                                        ClassroomId = existingClassroom.Id,
                                        Hierarchy = parentHierarchy,
                                        ProgrammeTypeId = programmeType.Id
                                    };
                                    var retClassGroup = classroomGroupGenericRepo.Insert(pracClassGroup);

                                    for (var iidx = 1; iidx <= 5; iidx++)
                                    {
                                        ClassProgramme pracClassGroupProgramme = new ClassProgramme()
                                        {
                                            Id = Guid.NewGuid(),
                                            MeetingDay = iidx,
                                            IsFullDay = true,
                                            IsActive = true,
                                            TenantId = tenantId,
                                            ProgrammeStartDate = DateTime.Now,
                                            ClassroomGroupId = pracClassGroup.Id,
                                            Hierarchy = parentHierarchy
                                        };
                                        var retClassGroupProgramme = classProgrammeGenericRepo.Insert(pracClassGroupProgramme);
                                    }
                                    programmeGroupId = pracClassGroup.Id.ToString();
                                } else
                                {
                                    //if the group exist already, only use that group id to create learnetr4
                                    programmeGroupId = existingGroup.Id.ToString();
                                }
                                //create programme
                               
                                //now create the learner and tie them to the playgroup
                                Learner newLearner = new Learner()
                                {
                                    UserId = userId,
                                    ClassroomGroupId = Guid.Parse(programmeGroupId),
                                    StartedAttendance = DateTime.Now,
                                    Hierarchy = parentHierarchy
                                };
                                var newLearnerRet = learnerGenericRepo.Insert(newLearner);

                            }

                            //then assign the learner to it

                            //get the classrooom

                        }
                    }
                    idx2++;
                } 
            }



                        return true;
        }

        public bool UpdatePractitionerShareInfo([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            bool bReturn = false;
  
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId)).FirstOrDefault();
            {
                if (practitioner != null)
                {
                    practitioner.ShareInfo = true;
                    var updateResult = practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return bReturn;
        }

        public bool UpdatePractitionerRegistered([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, bool status = false)

        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId)).FirstOrDefault();
            {
                if (practitioner != null)
                {
                    practitioner.IsRegistered = status;
                    var updateResult = practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return status;
        }

        public bool UpdatePractitionerIsFundaAppAdmin([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId)
        {
            bool bReturn = false;
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId)).FirstOrDefault();
            {
                if (practitioner != null)
                {
                    practitioner.IsFundaAppAdmin = true;
                    var updateResult = practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return bReturn;
        }

        public decimal UpdatePractitionerProgress([Service] IHttpContextAccessor contextAccessor,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, decimal progress)

        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = practitionerRepo.GetByUserId(practitionerId);
            {
                if (practitioner != null)
                {
                    practitioner.Progress = progress;
                    var updateResult = practitionerRepo.Update(practitioner);
                    return practitioner.Progress;
                }
            }

            return 0;
        }

    }
}
