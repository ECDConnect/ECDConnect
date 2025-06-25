using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Users;
using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Security.Managers;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{

    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ImportUserMutationExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<UserImportModel> ImportPractitionersAsync(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] ILogger<ImportUserMutationExtension> _logger,
          ApplicationUserManager userManager,
          AuthenticationDbContext dbContext,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id.ToString();

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR) || await userManager.IsInRoleAsync(currentUser, Roles.SUPER_ADMINISTRATOR);
            if (!userIsAdmin)
                throw new QueryException("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var userImportList = new List<ApplicationUser>();
            var practitionerUsers = new Dictionary<string, Practitioner>();
            var createdUsers = new List<string>();
            var coachRoleName = TenantExecutionContext.Tenant.Modules != null ? TenantExecutionContext.Tenant.Modules.CoachRoleName : "Coach";
            var validationErrors = new List<InputValidationError>();

            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);
            var headerRow = sheet.GetRow(0);

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

                var rowErrors = new List<string>();

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
                    IdNumber = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
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
                    var coachUser = dbContext.Users.Where(user => user.IdNumber == coachIdOrPassport && user.TenantId == tenantId).FirstOrDefault();

                    if (coachUser != null)
                    {
                        coachHierarchy = coachUser.Id;
                    }
                    else
                    {
                        validationErrors.Add(
                            new InputValidationError(row, new List<string> { }, $"{coachRoleName} does not exist for id/passport {coachIdOrPassport}")
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
                        CoachHierarchy = coachHierarchy == Guid.Empty ? null : coachHierarchy,
                        CoachLinkDate = coachHierarchy == Guid.Empty ? null : DateTime.Now.Date
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

                var userExists = dbContext.Users.Where(x => x.UserName == user.UserName || (x.IdNumber == user.IdNumber && x.TenantId == TenantExecutionContext.Tenant.Id)).FirstOrDefault();

                if (userExists is not null)
                {
                    validationErrors.Add(
                        new InputValidationError(rowNum, new List<string> { }, $"User already exists: {user.UserName}")
                        );
                    continue;
                }
            }

            // Return errors before trying to create users so the list doesn't need to be diff'd for users that were created.
            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            rowNum = 0;
            foreach (var user in userImportList)
            {
                rowNum++;

                var created = await userManager.CreateAsync(user);

                if (!created.Succeeded)
                {
                    validationErrors.Add(
                        new InputValidationError(rowNum, new List<string> { $": {string.Join(',', created.Errors.Select(e => e.Description))}" }, "Could not create this user.")
                        );
                    continue;
                }

                IdentityResult addToRoleResult = null;
                try
                {
                    addToRoleResult = await userManager.AddToRoleAsync(user, Roles.PRACTITIONER);
                }
                catch (Exception)
                {
                    validationErrors.Add(
                        new InputValidationError(
                            rowNum,
                            addToRoleResult?.Errors.Select(e => e.Description),
                            $"Could not add user to role: {Roles.PRACTITIONER}."));
                }

                try
                {
                    var practitioner = practitionerUsers.First(u => u.Key == user.UserName).Value;
                    practitioner.UserId = user.Id;

                    practitionerRepo.Insert(practitioner);
                }
                catch (Exception)
                {
                    validationErrors.Add(new InputValidationError(
                        rowNum,
                        addToRoleResult?.Errors?.Select(e => e?.Description?.ToString()),
                        $"Could not create {Roles.PRACTITIONER}."));
                    continue;
                }

                createdUsers.Add(user.UserName);

                try
                {
                    var token = await invitationManager.GenerateTokenAsync(user);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        validationErrors.Add(new InputValidationError(rowNum, null, $"Could not generate invitation token for user: {user.UserName}"));
                        continue;
                    }
                    await notificationManager.SendInvitationAsync(user, token);
                    await Task.Delay(1000);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Could not send invitation to user: {user?.UserName}");
                    validationErrors.Add(new InputValidationError(rowNum, new string[] { ex.Message }, $"Could not send invitation to user: {user?.UserName}"));
                }
            }

            return new UserImportModel()
            {
                CreatedUsers = createdUsers,
                ValidationErrors = validationErrors
            };
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<UserImportModel> ImportCoachesAsync(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] ILogger<ImportUserMutationExtension> _logger,
          ApplicationUserManager userManager,
          AuthenticationDbContext dbContext,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id.ToString();

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR) || await userManager.IsInRoleAsync(currentUser, Roles.SUPER_ADMINISTRATOR);
            if (!userIsAdmin)
                throw new QueryException("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var userImportList = new List<ApplicationUser>();
            var coachUsers = new Dictionary<string, Coach>();
            var createdUsers = new List<string>();

            var validationErrors = new List<InputValidationError>();

            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);
            var headerRow = sheet.GetRow(0);

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


                var rowErrors = new List<string>();

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
                    IdNumber = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
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
                var userExists = dbContext.Users.Where(x => x.UserName == user.UserName || (x.IdNumber == user.IdNumber && x.TenantId == TenantExecutionContext.Tenant.Id)).FirstOrDefault();

                if (userExists is not null)
                {
                    validationErrors.Add(
                        new InputValidationError(rowNum, new List<string> { }, $"User already exists: {user.UserName}")
                        );
                    continue;
                }
            }

            // Return errors before trying to create users so the list doesn't need to be diff'd for users that were created.
            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            rowNum = 0;
            foreach (var user in userImportList)
            {
                rowNum++;

                var created = await userManager.CreateAsync(user);

                if (!created.Succeeded)
                {
                    validationErrors.Add(
                        new InputValidationError(rowNum, new List<string> { $": {string.Join(',', created.Errors.Select(e => e.Description))}" }, "Could not create this user.")
                        );
                    continue;
                }

                IdentityResult addToRoleResult = null;
                try
                {
                    addToRoleResult = await userManager.AddToRoleAsync(user, Roles.COACH);
                }
                catch (Exception)
                {
                    validationErrors.Add(
                        new InputValidationError(
                            rowNum,
                            addToRoleResult?.Errors.Select(e => e.Description),
                            $"Could not add user to role: {Roles.COACH}."));
                }

                try
                {
                    var coach = coachUsers.First(u => u.Key == user.UserName).Value;
                    coach.UserId = user.Id;

                    coachRepo.Insert(coach);
                }
                catch (Exception)
                {
                    validationErrors.Add(new InputValidationError(
                        rowNum,
                        addToRoleResult?.Errors?.Select(e => e?.Description?.ToString()),
                        $"Could not create {Roles.COACH}."));
                    continue;
                }

                createdUsers.Add(user.UserName);

                try
                {
                    var token = await invitationManager.GenerateTokenAsync(user);

                    if (string.IsNullOrWhiteSpace(token))
                    {
                        validationErrors.Add(new InputValidationError(rowNum, null, $"Could not generate invitation token for user: {user.UserName}"));
                        continue;
                    }
                    await notificationManager.SendInvitationAsync(user, token);
                    await Task.Delay(1000);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Could not send invitation to user: {user?.UserName}");
                    validationErrors.Add(new InputValidationError(rowNum, new string[] { ex.Message }, $"Could not send invitation to user: {user?.UserName}"));
                }
            }

            return new UserImportModel()
            {
                CreatedUsers = createdUsers,
                ValidationErrors = validationErrors
            };

        }

    }
}
