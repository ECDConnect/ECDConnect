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
using ECDLink.DataAccessLayer.Entities.DataIngestion;
using System.Reflection;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PractitionerMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public Practitioner UpdatePractitioner([Service] IHttpContextAccessor contextAccessor,
          [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
          [Service] IGenericRepositoryFactory repoFactory,
          Guid? id,
          Practitioner input)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var dbRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: uId);

            if (id == null) id = input.Id;

            Practitioner practitioner = dbRepo.GetById((Guid)id);
            {
                if (practitioner != null)
                {
                    //Type t = practitioner.GetType(); //practitioner
                    //Type i = input.GetType(); //input
                    //foreach (PropertyInfo prop in i.GetProperties())
                    //{
                    //    if (t.GetProperty(prop.Name)!=null && prop.Name!="Id") { //do not attempt to update the PK
                    //        PropertyInfo pinfo = t.GetProperty(prop.Name);
                    //        pinfo.SetValue(t, prop.GetValue(input, null));
                    //        //t.GetProperty(prop.Name).SetValue(prop.Name, prop.GetValue(practitioner, null));
                    //    }
                    //}
                    //practitioner = input; //update the entity

                    if (input.CoachHierarchy != null) practitioner.CoachHierarchy = input.CoachHierarchy;
                    practitioner.IsActive = input.IsActive;
                    if (input.AttendanceRegisterLink != null) practitioner.AttendanceRegisterLink = input.AttendanceRegisterLink;
                    if (input.MaxChildren != null) practitioner.MaxChildren = input.MaxChildren;
                    if (input.IsPrincipal != null) practitioner.IsPrincipal = input.IsPrincipal;
                    if (input.IsFundaAppAdmin != null) practitioner.IsFundaAppAdmin = input.IsFundaAppAdmin;
                    if (input.PrincipalHierarchy != null) practitioner.PrincipalHierarchy = input.PrincipalHierarchy;
                    if (input.IsTrainee != null) practitioner.IsTrainee = input.IsTrainee;
                    if (input.SigningSignature != null) practitioner.SigningSignature = input.SigningSignature;
                    if (input.StartDate != null) practitioner.StartDate = input.StartDate;

                    if (input.SiteAddressId != null)
                    {
                        var addressRepo = repoFactory.CreateRepository<SiteAddress>(userContext: uId);
                        SiteAddress address = (SiteAddress)addressRepo.GetAll().Where(x => x.Id.Equals(input.SiteAddressId)).FirstOrDefault();
                        if (input.SiteAddress.Ward != null)
                            address.Ward = input.SiteAddress.Ward;
                        if (input.SiteAddress.AddressLine1 != null)
                            address.AddressLine1 = input.SiteAddress.AddressLine1;
                        if (input.SiteAddress.AddressLine2 != null)
                            address.AddressLine2 = input.SiteAddress.AddressLine2;
                        if (input.SiteAddress.AddressLine3 != null)
                            address.AddressLine3 = input.SiteAddress.AddressLine3;
                        if (input.SiteAddress.PostalCode != null)
                            address.PostalCode = input.SiteAddress.PostalCode;
                        if (input.SiteAddress.ProvinceId != null)
                            address.ProvinceId = input.SiteAddress.ProvinceId;
                        var updateAddressResult = addressRepo.Update(address);
                        //TODO: create address if not exists, but it really should
                    }
                    if (input.SiteAddress != null && input.SiteAddressId == null)
                    {
                        //create siteaddress
                        var addressRepo = repoFactory.CreateRepository<SiteAddress>(userContext: uId);
                        SiteAddress address = new SiteAddress();
                        if (input.SiteAddress.Ward != null)
                            address.Ward = input.SiteAddress.Ward;
                        if (input.SiteAddress.AddressLine1 != null)
                            address.AddressLine1 = input.SiteAddress.AddressLine1;
                        if (input.SiteAddress.AddressLine2 != null)
                            address.AddressLine2 = input.SiteAddress.AddressLine2;
                        if (input.SiteAddress.AddressLine3 != null)
                            address.AddressLine3 = input.SiteAddress.AddressLine3;
                        if (input.SiteAddress.PostalCode != null)
                            address.PostalCode = input.SiteAddress.PostalCode;
                        if (input.SiteAddress.ProvinceId != null)
                            address.ProvinceId = input.SiteAddress.ProvinceId;
                        var updateAddressResult = addressRepo.Insert(address);
                        if (updateAddressResult != null)
                            practitioner.SiteAddressId = updateAddressResult.Id;
                    }
                    Practitioner updateResult = dbRepo.Update(practitioner);
                    return updateResult;
                }
                return practitioner;
            }
        }


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
            try
            {
                var bytes = Convert.FromBase64String(file);
                using MemoryStream fileStream = new MemoryStream(bytes);

                var workbook = WorkbookFactory.Create(fileStream);

                var uId = httpContextAccessor.HttpContext.GetUser().Id;
                var dbRepo = repoFactory.CreateRepository<SL_Ingestion_User>(userContext: uId);

                //SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
                var sheet1 = workbook.GetSheetAt(0);
                for (var row = 1; row <= sheet1.LastRowNum; row++)
                {
                    var currentRow = sheet1.GetRow(row);

                    if (currentRow != null)
                    {
                        SL_Ingestion_User siu = new SL_Ingestion_User();

                        var FullName = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                        if (!string.IsNullOrEmpty(FullName))
                        {
                            //check the indicator of what type of staff the row is - Franchisee(practitioner)/Principal/Coach/Franchisor/FAA(FundaAppAdmin)
                            siu.SameSite = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                            siu.Indicator = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                            siu.FullName = FullName.Trim();
                            siu.IDNumber = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                            siu.PersonalNumber = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                            siu.FranchiseTypeOfProgramme = ExcelHelper.GetCellValue(currentRow.GetCell(6));
                            siu.ECDType = ExcelHelper.GetCellValue(currentRow.GetCell(7));                            
                            siu.SiteArea = ExcelHelper.GetCellValue(currentRow.GetCell(8));
                            siu.SiteName = ExcelHelper.GetCellValue(currentRow.GetCell(9));
                            siu.ClassName = ExcelHelper.GetCellValue(currentRow.GetCell(10));
                            siu.ParentId = ExcelHelper.GetCellValue(currentRow.GetCell(11));
                            siu.CoachName = ExcelHelper.GetCellValue(currentRow.GetCell(12)).Trim();
                            siu.CoachId = ExcelHelper.GetCellValue(currentRow.GetCell(13));
                            siu.FranchisorName = ExcelHelper.GetCellValue(currentRow.GetCell(14));
                            siu.CoachContactNumber = ExcelHelper.GetCellValue(currentRow.GetCell(15));

                            //check we dont reinsert data
                            List<SL_Ingestion_User> userList = dbRepo.GetAll().Where(x => x.IDNumber==siu.IDNumber).ToList();
                            if (userList.Count == 0)
                            {

                                dbRepo.Insert(siu);
                            }
                        }
                    }
                }
                //now call db ingestion
                this.ImportAllIngestDB(repoFactory,httpContextAccessor, localeService,userManager);
            } catch (Exception ex)
            {
                throw new Exception (ex.Message);
            }
            return true;
        }


        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool ImportAllChildren(
                    //[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
                    [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
                    [Service] InvitationNotificationManager notificationManager,
                      [Service] IGenericRepositoryFactory repoFactory,
                      [Service] IHttpContextAccessor httpContextAccessor,
                      [Service] ILocaleService<Language> localeService,
                      [Service] UserManager<ApplicationUser> userManager,
                      string file)
        {
            try { 
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                var bytes = Convert.FromBase64String(file);
                using MemoryStream fileStream = new MemoryStream(bytes);

                var workbook = WorkbookFactory.Create(fileStream);

                var uId = httpContextAccessor.HttpContext.GetUser().Id;
                var dbRepo = repoFactory.CreateRepository<SL_Ingestion_ChildCaregiver>(userContext: uId);

                //now do sheet 2
                var sheet2 = workbook.GetSheetAt(0);
                int idx = 1;
                for (var row = 1; row <= sheet2.LastRowNum; row++)
                {
                    var currentRow = sheet2.GetRow(row);

                    if (currentRow != null)
                    {
                        SL_Ingestion_ChildCaregiver siu = new SL_Ingestion_ChildCaregiver();
                        var Fullname = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                        if (!string.IsNullOrWhiteSpace(Fullname))
                        {
                            siu.ChildFullName = Fullname.Trim();
                            siu.FirstName = ExcelHelper.GetCellValue(currentRow.GetCell(1)).Trim();
                            siu.Surname = ExcelHelper.GetCellValue(currentRow.GetCell(2)).Trim();
                            siu.DateOfBirth = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                            siu.IDNumber = ExcelHelper.GetCellValue(currentRow.GetCell(4));

                            siu.FranchiseeType = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                            siu.ECDType = ExcelHelper.GetCellValue(currentRow.GetCell(6));
                            siu.FranchiseeName = ExcelHelper.GetCellValue(currentRow.GetCell(7));
                            siu.FranchiseeId = ExcelHelper.GetCellValue(currentRow.GetCell(8));

                            siu.EmergencyContactName = ExcelHelper.GetCellValue(currentRow.GetCell(9));
                            siu.EmergencyContactNumber = ExcelHelper.GetCellValue(currentRow.GetCell(10));

                            siu.EthnicGroup = ExcelHelper.GetCellValue(currentRow.GetCell(11));
                            siu.Gender = ExcelHelper.GetCellValue(currentRow.GetCell(12));
                            siu.Playgroup = ExcelHelper.GetCellValue(currentRow.GetCell(13));

                            siu.CaregiverName = ExcelHelper.GetCellValue(currentRow.GetCell(16));
                            siu.Grant = ExcelHelper.GetCellValue(currentRow.GetCell(17));
                            siu.HomeLanguage = ExcelHelper.GetCellValue(currentRow.GetCell(18));
                            siu.HasAllergies = ExcelHelper.GetCellValue(currentRow.GetCell(19));
                            siu.HasDisabilities = ExcelHelper.GetCellValue(currentRow.GetCell(20));
                            siu.HealthConditions = ExcelHelper.GetCellValue(currentRow.GetCell(21));
                            siu.TypesOfAllergies = ExcelHelper.GetCellValue(currentRow.GetCell(22));
                            siu.TypesOfDisabilities = ExcelHelper.GetCellValue(currentRow.GetCell(23));
                            siu.Education = ExcelHelper.GetCellValue(currentRow.GetCell(25));

                            siu.CaregiverIdNumber = ExcelHelper.GetCellValue(currentRow.GetCell(26));
                            siu.CaregiverContactNumber = ExcelHelper.GetCellValue(currentRow.GetCell(27));
                            siu.CaregiverRelationship = ExcelHelper.GetCellValue(currentRow.GetCell(28));
                            siu.CaregiverContactNumber = ExcelHelper.GetCellValue(currentRow.GetCell(29));
                            siu.ParentFees = ExcelHelper.GetCellValue(currentRow.GetCell(30));

                            siu.PhotoConsent = ExcelHelper.GetCellValue(currentRow.GetCell(31));
                            siu.POPIConsent = ExcelHelper.GetCellValue(currentRow.GetCell(32));

                            List<SL_Ingestion_ChildCaregiver> userList = dbRepo.GetAll().Where(x => x.IDNumber == siu.IDNumber).ToList();
                            if (userList.Count == 0)
                            {
                                dbRepo.Insert(siu);
                            }
                        }
                    }
                    idx++;
                }
                ImportAllChildrenIngestDB(repoFactory, httpContextAccessor, localeService, userManager);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool ImportAllIngestDB(
                      [Service] IGenericRepositoryFactory repoFactory,
                      [Service] IHttpContextAccessor httpContextAccessor,
                      [Service] ILocaleService<Language> localeService,
                      [Service] UserManager<ApplicationUser> userManager)
        {
            try
            {
                var languages = localeService.GetAvailableLocale().ToList();
                Guid tenantId = TenantExecutionContext.Tenant.Id;
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

                var staticHierarchyRepo = repoFactory.CreateGenericRepository<UserHierarchyEntity>(userContext: uId);

                //SendInvitationMutationExtension invite = new SendInvitationMutationExtension();
                var dbRepo = repoFactory.CreateRepository<SL_Ingestion_User>(userContext: uId);

                List<SL_Ingestion_User> userList = dbRepo.GetAll().Where(x => x.ProcessedDate == null).ToList();
                foreach(var user in userList) { 
                    if (user != null)
                    {
                        //var programme_indicator = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                        //var prograammeArr = programme_indicator.Split("_");

                        var fullname = user.FullName.Trim();
                        fullname = Regex.Replace(fullname, @"\s+", " ");
                        if (!string.IsNullOrEmpty(fullname))
                        {
                            var nameArr = fullname.Split(' ');
                            var firstname = (nameArr.Count() > 2 ? nameArr[0] + " " + nameArr[1] : nameArr[0]);
                            var surname = (nameArr.Count() > 2 ? nameArr[2] : nameArr[1]);

                            var programmeTypeDesc = user.ECDType;
                            var programmeType = programmeTypeRepo.GetAll().Where(x => x.Description.Equals(programmeTypeDesc)).FirstOrDefault();

                            char[] digits = user.IDNumber.ToCharArray();//new String(idNumber.TakeWhile(Char.IsDigit).ToArray());
                            var dob = new DateTime(Int32.Parse("19" + digits[0] + digits[1]), Int32.Parse(digits[2].ToString() + digits[3].ToString()), Int32.Parse(digits[4].ToString() + digits[5].ToString()));

                            var currentItem = practitionerImportList.Where(x => x.IDNumber == user.IDNumber).FirstOrDefault();
                            var item = currentItem != null ? currentItem : new ImportAllStaffItem();
                            item.MatchWithSite = (user.SameSite!=null && user.SameSite == "YES"? true:false);
                            item.SiteIndicator = user.Indicator;
                            //item.ParentUserId = (parentUserId!=null?parentUserId: null);
                            item.FirstName = firstname;
                            item.Surname = surname;
                            item.FullName = fullname;
                            item.PhoneNumber = user.PersonalNumber;
                            item.IDNumber = user.IDNumber;
                            item.ProgrammeTypeDesc = programmeTypeDesc;
                            item.ProgrammeTypeId = (programmeType != null ? programmeType.Id.ToString() : null);
                            item.SiteArea = user.SiteArea;
                            item.SiteName = user.SiteName;
                            item.ClassName = user.ClassName;
                            item.CoachName = user.CoachName;
                            item.CoachID = user.CoachId;
                            item.FranchisorhName = user.FranchisorName;
                            item.CoachNumber = user.CoachContactNumber;
                            item.ParentUserIdNumber = user.ParentId;
                            item.Dob = dob;//dobDateInt > 0 ? DateTime.FromOADate(dobDateInt) : DateTime.Now;

                            if (currentItem == null) practitionerImportList.Add(item);
                        }
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
                                PasswordHash = password,
                                SecurityStamp = securityStamp,
                                ConcurrencyStamp = concurrencystamp
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
                                StartDate = DateTime.Now.AddMonths(-1),
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

                            var parentUser = (practitioner.ParentUserIdNumber != null ? userManager.Users.Where(x => x.IdNumber == practitioner.ParentUserIdNumber).FirstOrDefault() : null);
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
                                newPractitioner.DateLinked = DateTime.Now;
                                newPractitioner.DateAccepted = DateTime.Now;

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
                                if (parentUser != null)
                                {
                                    addedPractitioner.PrincipalHierarchy = Guid.Parse(parentUser.Id);
                                    practitionerRepo.Update(addedPractitioner);
                                }
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
                            //update the SL Ingestion record as processed and save userId
                            SL_Ingestion_User slUser = dbRepo.GetAll().Where(x => x.IDNumber == practitioner.IDNumber).FirstOrDefault();
                            if (slUser != null) {
                                slUser.IsActive = true;
                                slUser.ProcessedDate = DateTime.Now;
                                slUser.UserId = newPractitioner.UserId;
                                slUser.UpdatedBy = uId;
                                slUser.UpdatedDate = DateTime.Now;
                                dbRepo.Update(slUser);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return true;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public bool ImportAllChildrenIngestDB(
              [Service] IGenericRepositoryFactory repoFactory,
              [Service] IHttpContextAccessor httpContextAccessor,
              [Service] ILocaleService<Language> localeService,
              [Service] UserManager<ApplicationUser> userManager)
        {
            try
            {
                Guid tenantId = TenantExecutionContext.Tenant.Id;

                //TODO: Pull all from DB thats not yet processed
                var uId = httpContextAccessor.HttpContext.GetUser().Id;
                var dbRepo = repoFactory.CreateRepository<SL_Ingestion_ChildCaregiver>(userContext: uId);

                List<SL_Ingestion_ChildCaregiver> userList = dbRepo.GetAll().Where(x => x.ProcessedDate == null).ToList();

                var languages = localeService.GetAvailableLocale().ToList();

                var programmeTypeRepo = repoFactory.CreateGenericRepository<ProgrammeType>(userContext: uId);

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


                /*The rest above this to pull in practitioners is in ImportAll Function*/

                List<ImportAllChildInfoItem> childImportListItem = new List<ImportAllChildInfoItem>();

                foreach (var user in userList)
                {
                    int idx = 0;
                    if (user != null)
                    {
                        var Fullname = user.ChildFullName.Trim();
                        if (!string.IsNullOrWhiteSpace(Fullname))
                        {
                            var Dob = user.DateOfBirth;

                            string calcdob = null;
                            if (user.IDNumber != null)
                            {
                                //if (int.TryParse(user.IDNumber))
                                char[] childdigits = user.IDNumber.ToCharArray();
                                calcdob = new DateTime(Int32.Parse("20" + childdigits[0] + childdigits[1]), Int32.Parse(childdigits[2].ToString() + childdigits[3].ToString()), Int32.Parse(childdigits[4].ToString() + childdigits[5].ToString())).ToString();
                            }
                            Dob = calcdob;//(Dob != null ? Dob.Replace("/", "-") : calcdob);

                            ImportAllChildInfoItem childItem = new ImportAllChildInfoItem()
                            {
                                Fullname = user.ChildFullName.Trim(),
                                FirstName = user.FirstName,
                                Surname = user.Surname,
                                Dob = (Dob != null ? Dob : "2022-01-01"),
                                IDNumber = (user.IDNumber != null ? user.IDNumber : "0000000000" + idx),
                                ProgramType = user.FranchiseeType,
                                ECDType = user.ECDType,
                                FranchiseeName = (user.FranchiseeName != null ? user.FranchiseeName.Trim() : null),
                                FranchiseeIDNumber = user.FranchiseeId,
                                EmergencyContactFullName = (user.EmergencyContactName != null ? user.EmergencyContactName.Trim() : null),
                                EmergencyContactPhoneNumber = user.EmergencyContactNumber,
                                EthnicGroup = user.EthnicGroup,
                                Gender = user.Gender,
                                PlayGroupGroup = user.Playgroup,
                                PrimaryCaregiver = (user.CaregiverName != null ? user.CaregiverName.Trim() : null),
                                GrantRecipient = user.Grant,
                                HomeLanguage = user.HomeLanguage,
                                Allergies = (user.HasAllergies != null ? (user.HasAllergies == "No" ? false : true) : false),
                                Disabilities = (user.HasDisabilities != null ? (user.HasDisabilities == "No" ? false : true) : false),
                                HealthConditions = (user.HealthConditions != null ? (user.HealthConditions == "No" ? false : true) : false),
                                TypeofAllergies = user.TypesOfAllergies,
                                TypeofDisabilities = user.TypesOfDisabilities,
                                CaregiverEducation = user.Education,
                                CaregiverIDNumber = user.CaregiverIdNumber,
                                CaregiverLanguage = user.CaregiverLanguage,
                                CaregiverRelationship = user.CaregiverRelationship,
                                CaregiverContactNo = user.CaregiverContactNumber,
                                ParentFees = user.ParentFees,
                                ConsentForPhoto = (user.PhotoConsent != null ? (user.PhotoConsent == "No" ? false : true) : false),
                                ConsentForPopia = (user.POPIConsent != null ? (user.POPIConsent == "No" ? false : true) : false)
                                //TODO: Add Grants
                            };

                            childImportListItem.Add(childItem);
                        }
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
                                }
                                else if (childItem.PrimaryCaregiver != null)
                                {
                                    emerfirstname = cgfirstname;
                                    emersurname = cgsurname;
                                    emergencyfullname = caregivefullname;
                                }
                                //check language
                                Guid? languageId = null;
                                if (childItem.HomeLanguage != null)
                                {
                                    var languageEntity = languages.Where(x => x.Description.Contains(childItem.HomeLanguage)).FirstOrDefault();
                                    if (languageEntity == null)
                                    {
                                        languageEntity = languages.Where(x => x.Locale == "en-za").FirstOrDefault();
                                    }
                                    languageId = languageEntity.Id;
                                }

                                Guid? relation = null;
                                if (childItem.CaregiverRelationship != null)
                                {
                                    var sRelation = staticRelationRepo.GetAll().Where(x => x.Description.Contains(childItem.CaregiverRelationship)).FirstOrDefault();
                                    if (sRelation != null)
                                        relation = sRelation.Id;
                                }
                                else
                                {
                                    var sRelation = staticRelationRepo.GetAll().Where(x => x.Description.Contains("Guardian")).FirstOrDefault();
                                    if (sRelation != null)
                                        relation = sRelation.Id;
                                }

                                Guid? education = null;
                                if (childItem.CaregiverEducation != null)
                                {
                                    var sEducation = staticRelationRepo.GetAll().Where(x => x.Description == childItem.CaregiverEducation).FirstOrDefault();
                                    if (sEducation != null)
                                        education = sEducation.Id;
                                }
                                if (education == null)
                                {
                                    var sEducation = staticRelationRepo.GetAll().Where(x => x.Description == "Matric").FirstOrDefault();
                                    if (sEducation != null)
                                        education = sEducation.Id;
                                }

                                Guid? gender = null;
                                if (childItem.Gender != null)
                                {
                                    var sgender = staticGenderRepo.GetAll().Where(x => x.Description.Contains(childItem.Gender)).FirstOrDefault();
                                    if (gender != null)
                                        gender = sgender.Id;
                                }
                                else
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
                                }
                                else
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
                                    //PhoneNumber = childItem.CaregiverContactNo,
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
                                if (childItem.Gender != null)
                                {
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

                                //get the classroom
                                Classroom existingClassroom = classroomGenericRepo.GetAll().Where(x => x.UserId.Equals(parentUser.Id)).FirstOrDefault();                            
                                if (existingClassroom != null)
                                {                                
                                    //map programme type
                                    childItem.ECDType = (childItem.ECDType == "ECD Centre" ? "Preschool" : childItem.ECDType == "Full Week (Daymothers)" ? "Day Mother" : childItem.ECDType == "SmartStart ECD" ? "Preschool" : childItem.ECDType == "PlayGroup" ? "Preschool" : childItem.ECDType);
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
                                        if (programmeType != null)
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
                                        }
                                    }
                                    else
                                    {
                                        //if the group exist already, only use that group id to create learnetr4
                                        programmeGroupId = existingGroup.Id.ToString();
                                    }
                                    //create programme

                                    //now create the learner and tie them to the playgroup - if a group exists
                                    if (programmeGroupId != null) {
                                        Learner newLearner = new Learner()
                                        {
                                            UserId = userId,
                                            ClassroomGroupId = Guid.Parse(programmeGroupId),
                                            StartedAttendance = DateTime.Now,
                                            Hierarchy = parentHierarchy
                                        };
                                        var newLearnerRet = learnerGenericRepo.Insert(newLearner);
                                    }
                                }
                                //update the SL Ingestion record as processed and save userId
                                SL_Ingestion_ChildCaregiver slUser = dbRepo.GetAll().Where(x => x.IDNumber == childItem.IDNumber).FirstOrDefault();
                                if (slUser != null)
                                {
                                    slUser.IsActive = true;
                                    slUser.ProcessedDate = DateTime.Now;
                                    slUser.UserId = childItem.UserId;
                                    slUser.UpdatedBy = uId;
                                    slUser.UpdatedDate = DateTime.Now;
                                    dbRepo.Update(slUser);
                                }
                            }
                        }
                        idx2++;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
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
