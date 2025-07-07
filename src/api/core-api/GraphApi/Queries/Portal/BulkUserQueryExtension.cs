using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;


namespace EcdLink.Api.CoreApi.GraphApi.Queries.Portal
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class BulkUserQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserImportModel ValidatePractitionerImportSheet(
          [Service] IHttpContextAccessor httpContextAccessor,
          ApplicationUserManager userManager,
          AuthenticationDbContext dbContext,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id.ToString();

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            var validationErrors = new List<InputValidationError>();

            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);
            var headerRow = sheet.GetRow(0);
            var coachRoleName = TenantExecutionContext.Tenant.Modules.CoachRoleName;
            var idPassportDuplications = ValidateIdPassportDuplications(sheet);

            // Skip header row by starting at 1.
            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow is null)
                {
                    break;
                }
                var idOrPassport = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                var id = UserHelper.CoerceValidSAID(ExcelHelper.GetCellValue(currentRow.GetCell(1)));
                var passport = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                var firstName = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                var surname = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                var cellphone = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                var coachIdOrPassport = ExcelHelper.GetCellValue(currentRow.GetCell(6));

                if (idOrPassport is null
                    && id is null
                    && passport is null
                    && firstName is null
                    && surname is null
                    && cellphone is null)
                    continue;

                var rowErrors = GetSheetValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone);

                if (idPassportDuplications.Any())
                {
                    // If there is duplicate id or passport numbers add them to the row error list
                    var duplicateError = idPassportDuplications.Where(x => x.Row == row).FirstOrDefault();
                    if (duplicateError != null)
                    {
                        rowErrors.Add(duplicateError.Errors.GetItemByIndex(0).ToString());
                    }
                }

                if (rowErrors.Any() || validationErrors.Any())
                {
                    if (rowErrors.Any())
                    {
                        validationErrors.Add(new InputValidationError(row, rowErrors, $"Errors on row {row}."));
                    }
                }

                if (TenantExecutionContext.Tenant.Modules != null && TenantExecutionContext.Tenant.Modules.CoachRoleEnabled && !string.IsNullOrEmpty(coachIdOrPassport))
                {
                    var coachUser = dbContext.Users.Where(user => user.IdNumber == coachIdOrPassport && user.TenantId == TenantExecutionContext.Tenant.Id).FirstOrDefault();

                    if (coachUser == null)
                        validationErrors.Add(
                            new InputValidationError(row, new List<string> { }, $"{coachRoleName} does not exist for id/passport {coachIdOrPassport}")
                        );
                }
                var userIdNumberPassport = idOrPassport?.ToLowerInvariant() == "id" ? id : passport;
                var userExists = dbContext.Users.Where(x => x.UserName == userIdNumberPassport || (x.IdNumber == userIdNumberPassport && x.TenantId == TenantExecutionContext.Tenant.Id)).FirstOrDefault();
                if (userExists != null)
                {
                    validationErrors.Add(
                       new InputValidationError(row, new List<string> { }, $"User already exists: {userIdNumberPassport}")
                       );
                }
            }

            return new UserImportModel()
            {
                ValidationErrors = validationErrors
            };
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserImportModel ValidateCoachImportSheet(
          [Service] IHttpContextAccessor httpContextAccessor,
          AuthenticationDbContext dbContext,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id.ToString();

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            var userImportList = new List<ApplicationUser>();
            var validationErrors = new List<InputValidationError>();

            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);
            var headerRow = sheet.GetRow(0);

            var idPassportDuplications = ValidateIdPassportDuplications(sheet);

            // Skip header row by starting at 1.
            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow is null)
                {
                    break;
                }
                var idOrPassport = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                var id = UserHelper.CoerceValidSAID(ExcelHelper.GetCellValue(currentRow.GetCell(1)));
                var passport = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                var firstName = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                var surname = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                var cellphone = ExcelHelper.GetCellValue(currentRow.GetCell(5));

                if (idOrPassport is null
                    && id is null
                    && passport is null
                    && firstName is null
                    && surname is null
                    && cellphone is null)
                    continue;

                var rowErrors = GetSheetValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone);

                if (idPassportDuplications.Any())
                {
                    // If there is duplicate id or passport numbers add them to the row error list
                    var duplicateError = idPassportDuplications.Where(x => x.Row == row).FirstOrDefault();
                    if (duplicateError != null)
                    {
                        rowErrors.Add(duplicateError.Errors.GetItemByIndex(0).ToString());
                    }
                }

                if (rowErrors.Any() || validationErrors.Any())
                {
                    if (rowErrors.Any())
                    {
                        validationErrors.Add(new InputValidationError(row, rowErrors, $"Errors on row {row}."));
                    }

                }
                var userIdNumberPassport = idOrPassport?.ToLowerInvariant() == "id" ? id : passport;
                // check for username (accross tenants) and idnumber (tenant specific)
                var userExists = dbContext.Users.Where(x => x.UserName == userIdNumberPassport || (x.IdNumber == userIdNumberPassport && x.TenantId == TenantExecutionContext.Tenant.Id)).FirstOrDefault();
                if (userExists != null)
                {
                    validationErrors.Add(
                       new InputValidationError(row, new List<string> { }, $"User already exists: {userIdNumberPassport}")
                       );
                }
            }

            return new UserImportModel()
            {
                ValidationErrors = validationErrors
            };
        }

        private List<string> GetSheetValidationErrors(
                string idOrPassport,
                string id,
                string passport,
                string firstName,
                string surname,
                string cellphone)
        {
            var errors = new List<string>();
            if (idOrPassport is null)
                errors.Add("Type of identification is empty");

            var valid = new string[] { "id", "passport" };
            if (!valid.Contains(idOrPassport))
                errors.Add($"Type of identification must be {string.Join(", ", valid)}");

            if (idOrPassport != null && idOrPassport?.ToLowerInvariant() == "id"
                && !UserHelper.IsSAIDValid(id))
            {
                if (string.IsNullOrEmpty(id))
                {
                    errors.Add("Id is empty");
                }
                else
                {
                    errors.Add("Id invalid " + id);
                }
            }

            if (idOrPassport != null && idOrPassport.ToLowerInvariant() == "passport" && (passport is null || passport.Length == 0))
                errors.Add("Passport is empty");

            if (firstName is null || firstName.Length == 0)
                errors.Add("First Name is empty.");

            if (surname is null || surname.Length == 0)
                errors.Add("Surname is empty.");

            if (cellphone is null || cellphone.Length == 0)
                errors.Add("Cellphone is empty.");

            if (cellphone is not null)
            {
              if (cellphone.Length > 0 && cellphone.Length < 9 || cellphone.Length > 10 || Regex.Matches(cellphone, "[^0-9]").Count > 0)
                errors.Add("Cellphone is invalid.");
            }

            return errors;
        }

        private List<InputValidationError> ValidateIdPassportDuplications(ISheet sheet)
        {
            var validationErrors = new List<InputValidationError>();
            var listItems = new Dictionary<int, String>();
            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow is null)
                {
                    break;
                }

                var idOrPassport = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                var id = UserHelper.CoerceValidSAID(ExcelHelper.GetCellValue(currentRow.GetCell(1)));
                var passport = ExcelHelper.GetCellValue(currentRow.GetCell(2));

                if (idOrPassport is null
                    && id is null
                    && passport is null)
                    continue;

                if (id != null)
                {
                    listItems.Add(row, id);
                }
                if (passport != null)
                {
                    listItems.Add(row, passport);
                }
            }

            var result = from item in listItems
                         group item by item.Value into groupedItems
                         where groupedItems.Count() > 1
                         select groupedItems;

            foreach (var row in result)
            {
                var sameValue = (from item in row select item.Key + "").ToArray();

                if (sameValue.Length > 0)
                {
                    for (int i = 0; i < sameValue.Length; i++)
                    {
                        validationErrors.Add(new InputValidationError(int.Parse(sameValue[i]), new List<string> { $"Duplicate ID or Passport number for {row.Key}" }, $"Errors on row {sameValue[i]}."));
                    }
                }
            }

            return validationErrors;
        }
       
    }
    
}
