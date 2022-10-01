using DotLiquid;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Documents;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.UriParser;
using NPOI.SS.UserModel;
using System;
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

            List<ImportAllChildInfoItem> childImportListItem = new List<ImportAllChildInfoItem>();
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
            var classroomGroupRepo = repoFactory.CreateRepository<ClassroomGroup>(userContext: uId);
            var classProgramme = repoFactory.CreateRepository<ClassProgramme>(userContext: uId);

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
                            //PasswordHash = password,
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

                        //sort roles
                        if (practitioner.SiteIndicator != "Principal")
                        {
                            var userRole = userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER).Result;
                            //parentUserId = pare null;//reset parentUserId to null because we dont need this user to match anymore
                        }
                        else
                        {
                            //reset parentUserId
                            //var userRole = userManager.AddToRoleAsync(newUser, Roles.PRINCIPAL).Result;
                            var userRole = userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER).Result;
                            //parentUserId = userId;
                        }


                        //    //invite to application
                        //    //invite.SendInviteToApplication(invitationManager, notificationManager, userManager, prac.UserId);



                        //create classrooms and classroomgroups and programmes

                    }

                }




            }




            //now do sheet 2
            var sheet2 = workbook.GetSheetAt(1);
            for (var row = 1; row <= sheet2.LastRowNum; row++)
            {
                var currentRow = sheet2.GetRow(row);

                if (currentRow != null)
                {
                    var var1 = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                    var var2 = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                    var var3 = ExcelHelper.GetCellValue(currentRow.GetCell(2));

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
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
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
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
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
