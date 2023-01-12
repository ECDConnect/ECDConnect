using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
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
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class DataIngestionMutationExtension
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
        public bool DataIngestionImport(
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

                    userManager.CreateAsync(newUser);

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

                    userManager.AddToRoleAsync(newUser, Roles.PRACTITIONER);
                }
            }

            var importerUserId = httpContextAccessor.HttpContext.GetUser().Id;
            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: importerUserId);

            foreach (var prac in templist)
            {
                prac.TenantId = tenantId;
                practitionerRepo.Insert(prac);
            }

            return true;
        }
    }
}
