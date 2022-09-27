using EcdLink.Api.CoreApi.GraphApi.Models;
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
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

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

            List<ImportAllStaffItem> practitionerImportList = new List<ImportAllStaffItem>();
            var headerRow = sheet.GetRow(0);

            //set sharedinfo needed between rows
            bool matchWithSite = false;
            string siteIndicator = "";
            Guid? parentId = null;

            var uId = httpContextAccessor.HttpContext.GetUser().Id;

            var programmeTypeRepo = repoFactory.CreateRepository<ProgrammeType>(userContext: uId);
            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: uId);
            var franchisorRepo = repoFactory.CreateRepository<Franchisor>(userContext: uId);

            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow != null)
                {
                    //check the indicator of what type of staff the row is - Franchisee(practitioner)/Principal/Coach/Franchisor/FAA(FundaAppAdmin)
                    matchWithSite = (ExcelHelper.GetCellValue(currentRow.GetCell(0)) == "YES" ? true : false);
                    
                    siteIndicator = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                    
                    var programme_indicator = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                    var prograammeArr = programme_indicator.Split("_");

                    var fullname = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                    var nameArr = fullname.Split(" ");
                    var firstname = (nameArr.Count()>2 ? nameArr[0] + " " + nameArr[1] : nameArr[0]);
                    var surname = (nameArr.Count() > 2 ? nameArr[2]: nameArr[1]);

                    var idNumber = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    var cellnumber = ExcelHelper.GetCellValue(currentRow.GetCell(5));

                    var programmeTypeDesc = ExcelHelper.GetCellValue(currentRow.GetCell(7));
                    var prammeTypeId = programmeTypeRepo.GetAll().Where(x => x.Description.Equals(programmeTypeDesc)).FirstOrDefault();

                    var siteArea = ExcelHelper.GetCellValue(currentRow.GetCell(8));
                    var siteName = ExcelHelper.GetCellValue(currentRow.GetCell(9));
                    var className = ExcelHelper.GetCellValue(currentRow.GetCell(10));

                    var coachName = ExcelHelper.GetCellValue(currentRow.GetCell(11));
                    var coachID = ExcelHelper.GetCellValue(currentRow.GetCell(12));
                    var franchisorhName = ExcelHelper.GetCellValue(currentRow.GetCell(13));
                    var coachNumber = ExcelHelper.GetCellValue(currentRow.GetCell(14));

                    //var consentForPhoto = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    //var language = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                    //var parentFees = ExcelHelper.GetCellValue(currentRow.GetCell(6));
                    //var startDate = ExcelHelper.GetCellValue(currentRow.GetCell(7));
                    //var maxChildren = ExcelHelper.GetCellValue(currentRow.GetCell(8));
                    char[] digits = idNumber.ToCharArray();//new String(idNumber.TakeWhile(Char.IsDigit).ToArray());
                    var dob = new DateTime(Int32.Parse("19" + digits[0] + digits[1]), Int32.Parse(digits[2].ToString() + digits[3].ToString()), Int32.Parse(digits[4].ToString() + digits[5].ToString()));


                    if (idNumber != null)
                    {
                        //var languageEntity = languages.Where(x => x.Description == language).FirstOrDefault();
                        //if (languageEntity == null)
                        //{
                        //    languageEntity = languages.Where(x => x.Locale == "en-za").FirstOrDefault();
                        //}
                        var currentItem = practitionerImportList.Where(x => x.IDNumber == idNumber).FirstOrDefault();

                        //var startDateInt = int.Parse(startDate);
                        //var dobDateInt = int.Parse(dob);
                        var item = currentItem != null ? currentItem : new ImportAllStaffItem();
                        item.FirstName = firstname;
                        item.Surname = surname;
                        item.FullName = fullname;
                        item.PhoneNumber = cellnumber;
                        item.IDNumber = idNumber;
                        //item.ConsentForPhoto = consentForPhoto == "Yes" ? true : false;
                        //item.ParentFees = int.Parse(parentFees);
                        //item.StartDate = DateTime.Now;
                        //item.MaxChildren = int.Parse(maxChildren);
                        //item.LanguageId = languageEntity.Id;
                        item.Dob = dob;//dobDateInt > 0 ? DateTime.FromOADate(dobDateInt) : DateTime.Now;

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
                        FullName = practitioner.FullName,//$"{practitioner.FirstName} {practitioner.Surname}",
                        ContactPreference = "sms",
                        IsActive = true,
                        TenantId = tenantId
                    };

                    var userCreatedResult = userManager.CreateAsync(newUser).Result;

                    templist.Add(new Practitioner
                    {
                        Id = Guid.NewGuid(),
                        UserId = userId,
                        //MaxChildren = practitioner.MaxChildren,
                        //ConsentForPhoto = practitioner.ConsentForPhoto,
                        //ParentFees = practitioner.ParentFees,
                        //StartDate = practitioner.StartDate,
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
                //prac.TenantId = tenantId;
                var addedPractitioner = practitionerRepo.Insert(prac);
            }

            return true;
        }

        public bool UpdatePractitionerShareInfo([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, string principalId)
        {
            bool bReturn = false;
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
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
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId, bool status = false)

        {

            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
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
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId)

        {
            bool bReturn = false;
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
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

        public bool UpdatePractitionerIsTrainee([Service] IHttpContextAccessor contextAccessor,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string practitionerId)

        {
            bool bReturn = false;
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(practitionerId)).FirstOrDefault();
            {
                if (practitioner != null)
                {
                    practitioner.IsTrainee = true;
                    var updateResult = practitionerRepo.Update(practitioner);
                    return true;
                }
            }

            return bReturn;
        }



    }
}
