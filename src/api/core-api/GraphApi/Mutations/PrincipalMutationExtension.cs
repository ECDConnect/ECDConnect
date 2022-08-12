using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
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
using EcdLink.Api.CoreApi.GraphApi.Queries;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class PrincipalMutationExtension
    {

        //private Practitioner AddPrincipal([Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
        //    [Service] IGenericRepositoryFactory repoFactory, 
        //    Practitioner principal, SiteAddress siteAddressEntity)
        //{
        //    var principalEntity = new Practitioner
        //    {
        //        AttendanceRegisterLink = principal.AttendanceRegisterLink,
        //        CoachHierarchy = principal.CoachHierarchy,
        //        ConsentForPhoto = principal.ConsentForPhoto,
        //        Documents = principal.Documents,
        //        IsFundaAppAdmin = principal.IsFundaAppAdmin,
        //        IsPrincipal = true,
        //        IsTrainee = principal.IsTrainee,
        //        LanguageUsedInGroups = principal.LanguageUsedInGroups,
        //        MaxChildren = principal.MaxChildren,
        //        MonthSinceFranchisee = principal.MonthSinceFranchisee,
        //        NotInvitedYet = principal.NotInvitedYet,
        //        ParentFees = principal.ParentFees,
        //        IsActive = true,
        //        PrincipalHierarchy = principal.PrincipalHierarchy,
        //        SigningSignature = principal.SigningSignature,
        //        StartDate = principal.StartDate,
        //        User = principal.User,
        //        UserId = principal.User.Id,
        //        SiteAddressId = siteAddressEntity.Id
        //    };

        //    var updated = repoFactory.Insert(principalEntity);

        //    return updated;
        //}

        public Practitioner AddPractitionerToPrincipal([Service] IServiceProvider serviceProvider, [Service] IHttpContextAccessor contextAccessor,
    [Service] UserManager<ApplicationUser> userManager,
    [Service] RoleManager<IdentityRole> roleManager,
    [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
    [Service] IGenericRepositoryFactory repoFactory,
    string firstName,
    string lastName,
    string idNumber,
    string userId)
        {
            List<Practitioner> practitioners = new List<Practitioner>();

            var principal = userManager.FindByIdAsync(userId).Result;
            
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            var practitionerUser = new PractitionerQueryExtension().GetPractitionerByIdNumber(serviceProvider, contextAccessor,userManager,roleManager,dbFactory, repoFactory, idNumber);            
            if (practitionerUser != null)
            {
                Practitioner practitioner = (practitionerUser.practitionerObjectData != null ? practitionerUser.practitionerObjectData : practitionerUser.principalObjectData);
                if (practitioner != null)
                {
                    practitioner.PrincipalHierarchy = userId;
                    var updateResult = practitionerRepo.Update(practitioner);
                }

                return practitioner;
            }
            else
            {
                //Create basic user and practitioner
                var pracRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);

                var pOne = new ApplicationUser
                {
                    FirstName =firstName,
                    Surname = lastName,
                    FullName = firstName + " " + lastName,
                    UserName = idNumber,
                    IdNumber = idNumber,
                    IsActive = true,
                    NickFirstName = firstName,
                    NickSurname = lastName,
                    NickFullName = firstName + " " + lastName
                };

                var result = userManager.CreateAsync(pOne).Result;
                string practitionerId = pOne.Id;

                var passwordResult = userManager.AddPasswordAsync(pOne, idNumber).Result;

                pracRepo.Insert(new Practitioner
                {                    
                    Id = Guid.NewGuid(),
                    UserId = practitionerId,
                    IsPrincipal = false,
                    PrincipalHierarchy = userId,
                    NotInvitedYet = true});

                return new PractitionerQueryExtension().GetPractitionerByUserId(contextAccessor, dbFactory, repoFactory, practitionerId);
            }
        }

        public Practitioner DeletePractitionerForPrincipal([Service] IHttpContextAccessor contextAccessor,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
            [Service] IGenericRepositoryFactory repoFactory,
            string userId, string principalId)
        {

            //find the practitioner
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId));
            {
                practitioner.CoachHierarchy = practitioner.PrincipalHierarchy.Replace(principalId, "");
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Practitioner PromotePractitionerToPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             string userId)
        {
             using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId));
            if (practitioner != null)
            {
                practitioner.IsPrincipal = true;
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
        }

        public Practitioner DemotePractitionerAsPrincipal([Service] IHttpContextAccessor contextAccessor,
             [Service] UserManager<ApplicationUser> userManager,
             [Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
             [Service] IGenericRepositoryFactory repoFactory,
             string userId)
        {
            using var scope = dbFactory.CreateDbContext();
            using var dbContextTransaction = scope.Database.BeginTransaction();
            var uId = contextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: uId);
            Practitioner practitioner = (Practitioner)practitionerRepo.GetAll().Where(x => x.UserId.Equals(userId));
            if (practitioner != null)
            {
                practitioner.IsPrincipal = false;
                var updateResult = practitionerRepo.Update(practitioner);
            }

            return practitioner;
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
        public bool PrincipalImport(
          //[Service] IDbContextFactory<AuthenticationDbContext> dbFactory,
          [Service] IGenericRepositoryFactory repoFactory,
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ILocaleService<Language> localeService,
          [Service] UserManager<ApplicationUser> userManager,
          string file)
        {
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
                        IsActive = true
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
                        IsActive = true
                    });

                    var userRole = userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER).Result;
                }
            }

            var importerUserId = httpContextAccessor.HttpContext.GetUser().Id;
            //var context = dbFactory.CreateDbContext();
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: importerUserId);

            foreach (var prac in templist)
            {
                var addedPractitioner = practitionerRepo.Insert(prac);
            }

            return true;
        }



    }
}
