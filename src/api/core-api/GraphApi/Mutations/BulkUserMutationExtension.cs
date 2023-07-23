using EcdLink.Api.CoreApi.Managers.Notifications;
using EcdLink.Api.CoreApi.Security.Managers.TokenAccess;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
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
using Microsoft.EntityFrameworkCore;
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
        public async Task<UserImportModel> ImportHealthCareWorkersAsync(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          [Service] ILogger<ImportUserMutationExtension> _logger,
          UserManager<ApplicationUser> userManager,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;

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
            var hcwUsers = new Dictionary<string, HealthCareWorker>();
            var createdUsers = new List<string>();
            var hcwToTeamLeadMap = new Dictionary<string, string>();

            var validationErrors = new List<InputValidationError>();

            // TODO: Addd async enumerator for this?
            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);
            var headerRow = sheet.GetRow(0);

            // TODO: is lastrownum the last row number?
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
                var teamLeadIdNum = UserHelper.CoerceValidSAID(
                    ExcelHelper.GetCellValue(currentRow.GetCell(6)));

                if (idOrPassport is null
                    && id is null
                    && passport is null
                    && firstName is null
                    && surname is null
                    && cellphone is null
                    && teamLeadIdNum is null)
                    continue;

                var rowErrors = GetCHWValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone, teamLeadIdNum);

                // Collect all row errors.
                // Could be on a row with no errors, but previous rows had errors.
                if (rowErrors.Any() || validationErrors.Any())
                {
                    // Dont add null rows
                    if (rowErrors.Any())
                        validationErrors.Add(new InputValidationError(row, rowErrors, $"Errors on row {row}."));

                    // Do not continue processing if errors.
                    continue;
                }
                var insertedDate = DateTime.UtcNow;
                var user = new ApplicationUser()
                {
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
                    IsActive = true
                };
                userImportList.Add(user);

                // Add usernames to dictionary, will return false on duplicate.
                if (!hcwToTeamLeadMap.TryAdd(user.UserName, teamLeadIdNum))
                    validationErrors.Add(new InputValidationError(row, new List<string> { }, $"Duplicate user: {user.UserName}."));

                // Add new community health worker.
                hcwUsers.Add(user.UserName,
                    new HealthCareWorker()
                    {
                        User = user,
                        IsRegistered = false, //TODO: Registered by default?
                        ConsentForPhoto = false,
                        InsertedDate = insertedDate,
                        // TeamLeadId = ? // Team lead needs to be fetched from clinic?
                        TenantId = tenantId,
                        IsActive = true
                    });
            }

            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            var teamLeadIdNumbers = hcwToTeamLeadMap
                .Select(uc => uc.Value)
                .Distinct()
                .ToList();

            var teamLeadRepo = repoFactory.CreateGenericRepository<TeamLead>(userContext: currentUserId);
            var teamLeadSaIdToIdsMap = teamLeadRepo.GetAll()
                .Include(t => t.User)
                .Where(t => teamLeadIdNumbers.Contains(t.User.IdNumber))
                .ToDictionary(t => t.Id, t => t.User.IdNumber);

            var communityHealthWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: currentUserId);

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
                    addToRoleResult = await userManager.AddToRoleAsync(user, RolesGG.HEALTH_CARE_WORKER);
                }
                catch (Exception ex)
                {
                    validationErrors.Add(
                        new InputValidationError(
                            rowNum,
                            addToRoleResult?.Errors.Select(e => e.Description),
                            $"Could not add user to role: {RolesGG.HEALTH_CARE_WORKER}."));
                }

                try
                {
                    var teamLeadSAIdNum = hcwToTeamLeadMap[user.UserName];
                    var hcw = hcwUsers.First(u => u.Key == user.UserName).Value;
                    hcw.TeamLeadId = teamLeadSaIdToIdsMap.First(teamLead => teamLead.Value == teamLeadSAIdNum).Key;
                    hcw.UserId = user.Id;

                    communityHealthWorkerRepo.Insert(hcw);
                }
                catch (Exception ex)
                {
                    validationErrors.Add(new InputValidationError(
                        rowNum,
                        addToRoleResult?.Errors?.Select(e => e?.Description?.ToString()),
                        $"Could not create {RolesGG.HEALTH_CARE_WORKER}."));
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
                }
                catch (Exception ex)
                {
                    validationErrors.Add(new InputValidationError(rowNum, new string[] { ex.Message }, $"Could not send invitation to user: {user.UserName}"));
                }
            }

            return new UserImportModel()
            {
                CreatedUsers = createdUsers,
                ValidationErrors = validationErrors
            };

            // Local function
            static IEnumerable<string> GetCHWValidationErrors(
                string idOrPassport,
                string id,
                string passport,
                string firstName,
                string surname,
                string cellphone,
                string teamLeadId)
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


                if (idOrPassport?.ToLowerInvariant() == "id"
                    && !UserHelper.IsSAIDValid(teamLeadId))
                {
                    errors.Add("Team Lead Id is empty or invalid.");
                }

                return errors;
            }
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<UserImportModel> ImportTeamLeadsAsync(
          [Service] IHttpContextAccessor httpContextAccessor,
          [Service] ILogger<ImportUserMutationExtension> _logger,
          [Service] InvitationNotificationManager notificationManager,
          [Service] ITokenManager<ApplicationUser, InvitationTokenManager> invitationManager,
          IGenericRepositoryFactory repoFactory,
          UserManager<ApplicationUser> userManager,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);

            if (file is null || currentUserId is null)
            {
                throw new QueryException("Invalid input.");
            }

            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
            if (!userIsAdmin)
                throw new QueryException("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var userImportList = new List<ApplicationUser>();
            var teamLeadUsers = new Dictionary<string, TeamLead>();
            var createdUsers = new List<string>();
            var userClinicNames = new Dictionary<string, string>();

            var validationErrors = new List<InputValidationError>();

            var bytes = Convert.FromBase64String(file);
            using MemoryStream fileStream = new MemoryStream(bytes);
            var workbook = WorkbookFactory.Create(fileStream);

            var sheet = workbook.GetSheetAt(0);
            var headerRow = sheet.GetRow(0);

            // TODO: is lastrownum the last row number?
            // Skip header row by starting at 1.
            for (var row = 1; row <= sheet.LastRowNum; row++)
            {
                var currentRow = sheet.GetRow(row);

                if (currentRow != null)
                {
                    var idOrPassport = ExcelHelper.GetCellValue(currentRow.GetCell(0));
                    var id = UserHelper.CoerceValidSAID(
                        ExcelHelper.GetCellValue(currentRow.GetCell(1)));
                    var passport = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                    var firstName = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                    var surname = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    var cellphone = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                    var email = ExcelHelper.GetCellValue(currentRow.GetCell(6));
                    var clinicName = ExcelHelper.GetCellValue(currentRow.GetCell(7));

                    if (idOrPassport is null
                    && id is null
                    && passport is null
                    && firstName is null
                    && surname is null
                    && cellphone is null
                    && email is null
                    && clinicName is null)
                        continue;

                    var rowErrors = GetValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone, email, clinicName);

                    // Collect all row errors.
                    // Could be on a row with no errors, but previous rows had errors.
                    if (rowErrors.Any() || validationErrors.Any())
                    {
                        // Dont add null rows
                        if (rowErrors.Any())
                            validationErrors.Add(new InputValidationError(row, rowErrors));

                        // Do not continue processing if errors.
                        continue;
                    }
                    
                    var insertedDate = DateTime.UtcNow;

                    var user = new ApplicationUser()
                    {
                        IdNumber = id,
                        UserName = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
                        FirstName = firstName,
                        Surname = surname,
                        FullName = $"{firstName} {surname}",
                        Email = email,
                        WhatsAppNumber = UserHelper.NormalizePhoneNumber(cellphone),
                        PhoneNumber = UserHelper.NormalizePhoneNumber(cellphone),
                        PhoneNumberConfirmed = true,
                        PendingPhoneNumber = null,
                        ContactPreference = MessageTypeConstants.SMS,
                        TenantId = tenantId,
                        InsertedDate = insertedDate,
                        IsActive = true
                    };
                    userImportList.Add(user);

                    // Record Clinic Name
                    userClinicNames.TryAdd(user.UserName, clinicName);

                    // Add new community health worker.
                    teamLeadUsers.Add(user.UserName,
                        new TeamLead()
                        {
                            User = user,
                            JobTitle = RolesGG.TEAM_LEAD,
                            TenantId = tenantId,
                            // Clinics to be added.
                            ClinicId = null,
                            InsertedDate = insertedDate,
                            IsActive = true
                        });
                }
            }

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

            // Return errors before trying to create users so the list doesn't need to be diff'd for users that were created.
            if (validationErrors.Any())
                return new UserImportModel() { ValidationErrors = validationErrors };


            // Get Clinics
            var userClinicNameList = userClinicNames.Select(uc => uc.Value).Distinct().ToList();

            var clinicRepo = repoFactory.CreateGenericRepository<Clinic>(userContext: currentUserId);
            var clinics = clinicRepo.GetAll().Where(c => userClinicNameList.Contains(c.Name)).ToList();
            var foundClinicNames = clinics.Select(c => c.Name);

            var missingClinicIds = userClinicNameList.Except(foundClinicNames).ToList();

            if (missingClinicIds.Any())
            {
                validationErrors.Add(new InputValidationError(0, missingClinicIds, "These clinic Id's could not be found."));
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };
            }

            // Create Team Leads
            var teamLeadRepo = repoFactory.CreateGenericRepository<TeamLead>(userContext: currentUserId);

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
                    addToRoleResult = await userManager.AddToRoleAsync(user, RolesGG.TEAM_LEAD);
                    if (!addToRoleResult.Succeeded)
                    {
                        validationErrors.Add(
                        new InputValidationError(
                            rowNum,
                            addToRoleResult?.Errors.Select(e => e.Description),
                            $"Could not add user to role: {RolesGG.TEAM_LEAD}."));
                        continue;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message, ex);
                    validationErrors.Add(
                        new InputValidationError(
                            rowNum,
                            addToRoleResult?.Errors.Select(e => e.Description),
                            $"Could not add user to role: {RolesGG.TEAM_LEAD}."));
                    continue;
                }

                if (addToRoleResult != null)
                {
                    // Get the current tl's user.
                    var newTl = teamLeadUsers.First(tl => tl.Key == user.UserName).Value;

                    // Assign newly created user
                    newTl.UserId = user.Id;

                    if (userClinicNames.TryGetValue(user.UserName, out string clinicName))
                    {
                        var clinic = clinics.First(c => c.Name == clinicName);
                        newTl.ClinicId = clinic.Id;
                    }

                    try
                    {
                        teamLeadRepo.Insert(newTl);
                    }
                    catch (Exception ex)
                    {
                        validationErrors.Add(
                        new InputValidationError(
                            rowNum,
                            new string[] { ex.Message },
                            $"Could not create team lead for user: {user.UserName}."));
                        continue;
                    }
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
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message, ex);
                    validationErrors.Add(new InputValidationError(rowNum, new string[] { ex.Message }, $"Could not send invitation to user: {user.UserName}"));
                }
            }

            return new UserImportModel()
            {
                CreatedUsers = createdUsers,
                ValidationErrors = validationErrors
            };

            // Local function
            static IEnumerable<string> GetValidationErrors(string idOrPassport, string id, string passport, string firstName, string surname, string cellphone, string email, string clinicName)
            {
                var errors = new List<string>();
                if (idOrPassport is null)
                    errors.Add("Type of identification is empty");

                var valid = new string[] { "id", "passport" };
                if (!valid.Contains(idOrPassport))
                    errors.Add($"Type of identification must be {string.Join(", ", valid)}");

                if (idOrPassport?.ToLowerInvariant() == "id"
                    && !UserHelper.IsSAIDValid(id))
                    errors.Add("Type of identification is \"id\", is empty or invalid");

                if (idOrPassport?.ToLowerInvariant() == "passport"
                    && passport.Length == 0)
                    errors.Add("Type of identification is \"passport\", is empty or invalid");

                if (string.IsNullOrWhiteSpace(firstName)
                    || firstName.Length == 0)
                    errors.Add("First Name is empty.");

                if (string.IsNullOrWhiteSpace(surname)
                    || surname.Length == 0)
                    errors.Add("Surname is empty.");

                if (string.IsNullOrWhiteSpace(cellphone)
                    || cellphone.Length == 0)
                    errors.Add("Cellphone is empty.");

                if (!string.IsNullOrEmpty(email) // Email is optional
                    && !UserHelper.IsEmailValid(email))
                    errors.Add("Email is invalid");

                if (string.IsNullOrWhiteSpace(clinicName) || clinicName?.Length < 1)
                    errors.Add("Clinic Name is invalid");

                return errors;
            }
        }
    }


}
