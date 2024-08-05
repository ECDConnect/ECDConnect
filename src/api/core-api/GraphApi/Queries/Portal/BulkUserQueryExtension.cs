using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
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
using System.Threading.Tasks;


namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class BulkUserQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<UserImportModel> ValidatePractitionerImportSheet(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          ApplicationUserManager userManager,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id.ToString();

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
            if (!userIsAdmin)
                throw new QueryException("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var userImportList = new List<ApplicationUser>();
            var practitionerUsers = new Dictionary<string, Practitioner>();
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
                var coachIdOrPassport = ExcelHelper.GetCellValue(currentRow.GetCell(6));

                if (idOrPassport is null
                    && id is null
                    && passport is null
                    && firstName is null
                    && surname is null
                    && cellphone is null)
                    continue;

                var rowErrors = GetPractitionerValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone, coachIdOrPassport);

                if (idPassportDuplications.Any())
                {
                    // If there is duplicate id or passport numbers add them to the row error list
                    var duplicateError = idPassportDuplications.Where(x => x.Row == row).FirstOrDefault();
                    if (duplicateError != null)
                    {
                        rowErrors.Add(duplicateError.Errors.GetItemByIndex(0).ToString());
                    }
                }

                // Collect all row errors.
                // Could be on a row with no errors, but previous rows had errors.
                if (rowErrors.Any() || validationErrors.Any())
                {
                    // Dont add null rows
                    if (rowErrors.Any())
                    {
                        validationErrors.Add(new InputValidationError(row, rowErrors, $"Errors on row {row}."));
                    }

                    // Do not continue processing if errors.
                    continue;
                }

                var coachHierarchy = Guid.Empty;
                var insertedDate = DateTime.UtcNow;
                var userId = Guid.NewGuid();
                var user = new ApplicationUser()
                {
                    Id = userId,
                    IdNumber = id,
                    UserName = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
                    FirstName = firstName,
                    Surname = surname,
                    FullName = $"{firstName} {surname}",
                    WhatsAppNumber = UserHelper.NormalizePhoneNumber(cellphone),
                    PhoneNumber = UserHelper.NormalizePhoneNumber(cellphone),
                    PhoneNumberConfirmed = true,
                    PendingPhoneNumber = null,
                    ContactPreference = MessageTypeConstants.SMS,
                    TenantId = tenantId,
                    InsertedDate = insertedDate,
                    IsActive = true,
                };
                userImportList.Add(user);

                if (!string.IsNullOrEmpty(coachIdOrPassport))
                {
                    var coachUser = userManager.FindByNameAsync(coachIdOrPassport).Result;

                    if (coachUser != null)
                    {
                        coachHierarchy = coachUser.Id;
                    }
                    else
                    {
                        validationErrors.Add(
                            new InputValidationError(row, new List<string> { }, $"Coach does not exist for id/passport {coachIdOrPassport}")
                        );
                    }
                }
                practitionerUsers.Add(user.UserName,
                    new Practitioner()
                    {
                        Id = user.Id,
                        User = user,
                        IsRegistered = false,
                        InsertedDate = insertedDate,
                        TenantId = tenantId,
                        IsActive = true,
                        CoachHierarchy = coachHierarchy == Guid.Empty ? null : coachHierarchy
                    });
            }

            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            var practitionerRepo = repoFactory.CreateRepository<Practitioner>(userContext: currentUserId);

            var rowNum = 0;
            foreach (var user in userImportList)
            {
                rowNum++;
                var userExists = await userManager.FindByNameAsync(user.UserName);

                if (userExists is not null)
                {
                    validationErrors.Add(
                        new InputValidationError(rowNum, new List<string> { }, $"User already exists: {user.UserName}")
                        );
                    continue;
                }
            }

            return new UserImportModel()
            {
                ValidationErrors = validationErrors
            };

            
            // Local function
            static List<string> GetPractitionerValidationErrors(
                string idOrPassport,
                string id,
                string passport,
                string firstName,
                string surname,
                string cellphone,
                string coachIdOrPassport)
            {
                var errors = new List<string>();
                if (idOrPassport is null)
                    errors.Add("Type of identification is empty");

                var valid = new string[] { "id", "passport" };
                if (!valid.Contains(idOrPassport))
                    errors.Add($"Type of identification must be {string.Join(", ", valid)}");

                if (idOrPassport?.ToLowerInvariant() == "id"
                    && !UserHelper.IsSAIDValid(id))
                {
                    errors.Add("Id is empty or invalid");
                }

                if (idOrPassport is null ||
                    (idOrPassport.ToLowerInvariant() == "passport" && passport.Length == 0))
                    errors.Add("Passport is empty or invalid");

                if (firstName is null || firstName.Length == 0)
                    errors.Add("First Name is empty.");

                if (surname is null || surname.Length == 0)
                    errors.Add("Surname is empty.");

                if (cellphone is null || cellphone.Length == 0)
                    errors.Add("Cellphone is empty.");

                if (TenantExecutionContext.Tenant.Modules.CoachRoleEnabled)
                {
                    if (!string.IsNullOrEmpty(coachIdOrPassport) && !UserHelper.IsSAIDValid(coachIdOrPassport))
                    {
                        errors.Add("Coach Id is empty or invalid");
                    }
                }
                return errors;
            }
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<UserImportModel> ValidateCoachImportSheet(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          ApplicationUserManager userManager,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id.ToString();

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
            if (!userIsAdmin)
                throw new QueryException("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var userImportList = new List<ApplicationUser>();
            var coachUsers = new Dictionary<string, Coach>();
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

                var rowErrors = GetCoachValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone);

                if (idPassportDuplications.Any())
                {
                    // If there is duplicate id or passport numbers add them to the row error list
                    var duplicateError = idPassportDuplications.Where(x => x.Row == row).FirstOrDefault();
                    if (duplicateError != null)
                    {
                        rowErrors.Add(duplicateError.Errors.GetItemByIndex(0).ToString());
                    }
                }

                // Collect all row errors.
                // Could be on a row with no errors, but previous rows had errors.
                if (rowErrors.Any() || validationErrors.Any())
                {
                    // Dont add null rows
                    if (rowErrors.Any())
                    {
                        validationErrors.Add(new InputValidationError(row, rowErrors, $"Errors on row {row}."));
                    }

                    // Do not continue processing if errors.
                    continue;
                }
                var insertedDate = DateTime.UtcNow;
                var userId = Guid.NewGuid();
                var user = new ApplicationUser()
                {
                    Id = userId,
                    IdNumber = id,
                    UserName = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
                    FirstName = firstName,
                    Surname = surname,
                    FullName = $"{firstName} {surname}",
                    WhatsAppNumber = UserHelper.NormalizePhoneNumber(cellphone),
                    PhoneNumber = UserHelper.NormalizePhoneNumber(cellphone),
                    PhoneNumberConfirmed = true,
                    PendingPhoneNumber = null,
                    ContactPreference = MessageTypeConstants.SMS,
                    TenantId = tenantId,
                    InsertedDate = insertedDate,
                    IsActive = true,
                };
                userImportList.Add(user);

                coachUsers.Add(user.UserName,
                    new Coach()
                    {
                        Id = user.Id,
                        User = user,
                        IsRegistered = false,
                        InsertedDate = insertedDate,
                        TenantId = tenantId,
                        IsActive = true
                    });
            }

            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            var coachRepo = repoFactory.CreateRepository<Coach>(userContext: currentUserId);

            var rowNum = 0;
            foreach (var user in userImportList)
            {
                rowNum++;
                var userExists = await userManager.FindByNameAsync(user.UserName);

                if (userExists is not null)
                {
                    validationErrors.Add(
                        new InputValidationError(rowNum, new List<string> { }, $"User already exists: {user.UserName}")
                        );
                    continue;
                }
            }

            return new UserImportModel()
            {
                ValidationErrors = validationErrors
            };

            // Local function
            static List<string> GetCoachValidationErrors(
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

                if (idOrPassport?.ToLowerInvariant() == "id"
                    && !UserHelper.IsSAIDValid(id))
                {
                    errors.Add("Id is empty or invalid");
                }

                if (idOrPassport is null ||
                    (idOrPassport.ToLowerInvariant() == "passport" && passport.Length == 0))
                    errors.Add("Passport is empty or invalid");

                if (firstName is null || firstName.Length == 0)
                    errors.Add("First Name is empty.");

                if (surname is null || surname.Length == 0)
                    errors.Add("Surname is empty.");

                if (cellphone is null || cellphone.Length == 0)
                    errors.Add("Cellphone is empty.");
                return errors;
            }
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
