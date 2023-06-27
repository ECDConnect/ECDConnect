using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Helpers;
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
using Microsoft.EntityFrameworkCore;
using NPOI.SS.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
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
          UserManager<ApplicationUser> userManager,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;

            if (file is null || currentUserId is null)
            {
                throw new Exception("Invalid input.");
            }

            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);
            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
            if (!userIsAdmin)
                throw new Exception("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var userImportList = new List<ApplicationUser>();
            var hcwUsers = new Dictionary<string, HealthCareWorker>();
            var createdUsers = new List<UserModel>();
            var userClinics = new Dictionary<string, Guid>();

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
                    var id = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                    var passport = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                    var firstName = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                    var surname = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    var cellphone = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                    var uniqueClinicId = ExcelHelper.GetCellValue(currentRow.GetCell(6));

                    var rowErrors = GetValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone, uniqueClinicId);

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

                    var user = new ApplicationUser()
                    {
                        IdNumber = id,
                        UserName = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
                        FirstName = firstName,
                        Surname = surname,
                        WhatsAppNumber = cellphone,
                        PhoneNumber = cellphone,
                        PhoneNumberConfirmed = false,
                        PendingPhoneNumber = cellphone,
                        ContactPreference = "sms",
                        TenantId = tenantId
                    };
                    userImportList.Add(user);
                    // Try add to skip duplicates.
                    userClinics.TryAdd(user.UserName, Guid.Parse(uniqueClinicId));

                    // Add new community health worker.
                    hcwUsers.Add(user.UserName,
                        new HealthCareWorker()
                        {
                            User = user,
                            IsRegistered = false, //TODO: Registered by default?
                            ConsentForPhoto = false,
                            // TeamLeadId = ? // Team lead needs to be fetched from clinic?
                            TenantId = tenantId,
                        });
                }
            }

            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            var userClinicIds = userClinics.Select(uc => uc.Value).ToList().Distinct();

            var clinicRepo = repoFactory.CreateGenericRepository<Clinic>(userContext: currentUserId);
            var clinics = clinicRepo.GetAll().Where(c => userClinicIds.Contains(c.Id)).ToList();

            var missingClinicIds = userClinicIds.Except(clinics.Select(c => c.Id)).Select(i => i.ToString());

            if (missingClinicIds.Any())
            {
                validationErrors.Add(new InputValidationError(0, missingClinicIds, "These clinic Id's could not be found."));
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };
            }

            var teamLeadRepo = repoFactory.CreateGenericRepository<TeamLead>();
            var teamLeads = teamLeadRepo.GetAll()
                .Where(tl => userClinicIds.Contains(tl.ClinicId.Value))
                .OrderBy(tl => tl.InsertedDate)
                .ToList();

            if (!teamLeads.Any())
            {
                var clinicsMissingTeamLead = clinics.Select(c => c.Id)
                    .Except(teamLeads.Select(tl => tl.ClinicId.Value))
                    .Select(i => i.ToString());

                validationErrors.Add(new InputValidationError(0, clinicsMissingTeamLead, "These clinics have no Team Leads."));
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };
            }

            var communityHealthWorkerRepo = repoFactory.CreateGenericRepository<HealthCareWorker>(userContext: currentUserId);

            var rowNum = 0;
            foreach (var user in userImportList)
            {
                rowNum++;
                try
                {
                    var created = await userManager.CreateAsync(user, $"A{Guid.NewGuid()}!");
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
                        continue;
                    }

                    try
                    {
                        var currentUserClinic = userClinics.Where(u => u.Key == user.UserName).First();
                        var tls = teamLeads.Where(tl => tl.ClinicId == currentUserClinic.Value);

                        if (!tls.Any())
                        {
                            validationErrors.Add(new InputValidationError(
                                rowNum, 
                                new List<string> { $"{currentUserClinic.Value}." },
                                "Could not find team lead for user's clinic."));
                            continue;
                        }

                        var tlId = tls.First().Id;
                        var hcw = hcwUsers.First(u => u.Key == user.UserName).Value;
                        hcw.TeamLeadId = tlId;

                        communityHealthWorkerRepo.Insert(hcw);
                    }
                    catch (Exception ex)
                    {
                        validationErrors.Add(new InputValidationError(
                            rowNum, 
                            new List<string> { string.Join(',', addToRoleResult?.Errors?.ToList()) },
                            $"Could not create {RolesGG.HEALTH_CARE_WORKER}."));
                        continue;
                    }
                    
                    var userModel = new UserModel(user);
                    createdUsers.Add(userModel);
                }
                catch (Exception ex)
                {

                }
            }

            return new UserImportModel()
            {
                CreatedUsers = createdUsers,
                ValidationErrors = validationErrors
            };

            // Local function
            static IEnumerable<string> GetValidationErrors(string idOrPassport, string id, string passport, string firstName, string surname, string cellphone, string uniqueClinicId)
            {
                var errors = new List<string>();
                if (idOrPassport is null)
                    errors.Add("Type of identification is empty");

                if (idOrPassport is null ||
                    (idOrPassport.ToLowerInvariant() == "id" && id is not null && id.Length != 13))
                    errors.Add("Type of identification is Id and Id is empty or invalid");

                if (idOrPassport is null ||
                    (idOrPassport.ToLowerInvariant() == "passport" && passport.Length == 0))
                    errors.Add("Type of identification is Passport and Passport is empty or invalid");
                if (firstName is null || firstName.Length == 0)
                    errors.Add("First Name is empty.");

                if (surname is null || surname.Length == 0)
                    errors.Add("Surname Name is empty.");

                if (cellphone is null || cellphone.Length == 0)
                    errors.Add("Surname Name is empty.");

                if (!Guid.TryParse(uniqueClinicId, out Guid uniqueClinicIdGuid))
                    errors.Add("Unique ClinicId is invalid");

                if (uniqueClinicId is null || uniqueClinicIdGuid == Guid.Empty)
                    errors.Add("Unique ClinicId is empty.");

                return errors;
            }
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.Create)]
        public async Task<UserImportModel> ImportTeamLeadsAsync(
          [Service] IHttpContextAccessor httpContextAccessor,
          IGenericRepositoryFactory repoFactory,
          UserManager<ApplicationUser> userManager,
          string file)
        {
            string currentUserId = httpContextAccessor.HttpContext.GetUser()?.Id;
            ApplicationUser currentUser = await userManager.FindByIdAsync(currentUserId);

            if (file is null || currentUserId is null)
            {
                throw new Exception("Invalid input.");
            }

            var userIsAdmin = await userManager.IsInRoleAsync(currentUser, Roles.ADMINISTRATOR);
            if (!userIsAdmin)
                throw new Exception("You do not have permission to use this function.");

            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var userImportList = new List<ApplicationUser>();
            var teamLeadUsers = new Dictionary<string, TeamLead>();
            var createdUsers = new List<UserModel>();
            var userClinics = new Dictionary<string, Guid>();

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
                    var id = ExcelHelper.GetCellValue(currentRow.GetCell(1));
                    var passport = ExcelHelper.GetCellValue(currentRow.GetCell(2));
                    var firstName = ExcelHelper.GetCellValue(currentRow.GetCell(3));
                    var surname = ExcelHelper.GetCellValue(currentRow.GetCell(4));
                    var cellphone = ExcelHelper.GetCellValue(currentRow.GetCell(5));
                    var email = ExcelHelper.GetCellValue(currentRow.GetCell(6));

                    var rowErrors = GetValidationErrors(idOrPassport, id, passport, firstName, surname, cellphone, email);

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

                    var user = new ApplicationUser()
                    {
                        IdNumber = id,
                        UserName = idOrPassport?.ToLowerInvariant() == "id" ? id : passport,
                        FirstName = firstName,
                        Surname = surname,
                        Email = email,
                        WhatsAppNumber = cellphone,
                        PhoneNumber = cellphone,
                        PhoneNumberConfirmed = false,
                        PendingPhoneNumber = cellphone,
                        ContactPreference = "sms",
                        TenantId = tenantId
                    };
                    userImportList.Add(user);
                                        
                    // Add new community health worker.
                    teamLeadUsers.Add(user.UserName,
                        new TeamLead()
                        {
                            User = user,
                            JobTitle = RolesGG.TEAM_LEAD,
                            TenantId = tenantId,
                            // Clinics to be added.
                            ClinicId = null
                        });
                }
            }

            if (validationErrors.Any())
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };

            var userClinicIds = userClinics.Select(uc => uc.Value).ToList().Distinct();

            var clinicRepo = repoFactory.CreateGenericRepository<Clinic>(userContext: currentUserId);
            var clinics = clinicRepo.GetAll().Where(c => userClinicIds.Contains(c.Id)).ToList();

            var missingClinicIds = userClinicIds.Except(clinics.Select(c => c.Id)).Select(i => i.ToString());

            if (missingClinicIds.Any())
            {
                validationErrors.Add(new InputValidationError(0, missingClinicIds, "These clinic Id's could not be found."));
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };
            }

            var teamLeadRepo = repoFactory.CreateGenericRepository<TeamLead>();
            var teamLeads = teamLeadRepo.GetAll()
                .Where(tl => userClinicIds.Contains(tl.ClinicId.Value))
                .OrderBy(tl => tl.InsertedDate)
                .ToList();

            if (!teamLeads.Any())
            {
                var clinicsMissingTeamLead = clinics.Select(c => c.Id)
                    .Except(teamLeads.Select(tl => tl.ClinicId.Value))
                    .Select(i => i.ToString());

                validationErrors.Add(new InputValidationError(0, clinicsMissingTeamLead, "These clinics have no Team Leads."));
                return new UserImportModel()
                {
                    ValidationErrors = validationErrors
                };
            }

            var rowNum = 0;
            foreach (var user in userImportList)
            {
                rowNum++;
                try
                {
                    var created = await userManager.CreateAsync(user, $"A{Guid.NewGuid()}!");
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
                        validationErrors.Add(
                            new InputValidationError(
                                rowNum,
                                addToRoleResult?.Errors.Select(e => e.Description),
                                $"Could not add user to role: {RolesGG.TEAM_LEAD}."));
                        continue;
                    }

                    var userModel = new UserModel(user);
                    createdUsers.Add(userModel);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }

            return new UserImportModel()
            {
                CreatedUsers = createdUsers,
                ValidationErrors = validationErrors
            };

            // Local function
            static IEnumerable<string> GetValidationErrors(string idOrPassport, string id, string passport, string firstName, string surname, string cellphone, string email)
            {
                var errors = new List<string>();
                if (idOrPassport is null)
                    errors.Add("Type of identification is empty");

                if (idOrPassport is null ||
                    (idOrPassport.ToLowerInvariant() == "id" && id is not null && id.Length != 13))
                    errors.Add("Type of identification is Id and Id is empty or invalid");

                if (idOrPassport is null ||
                    (idOrPassport.ToLowerInvariant() == "passport" && passport.Length == 0))
                    errors.Add("Type of identification is Passport and Passport is empty or invalid");
                if (firstName is null || firstName.Length == 0)
                    errors.Add("First Name is empty.");

                if (surname is null || surname.Length == 0)
                    errors.Add("Surname Name is empty.");

                if (cellphone is null || cellphone.Length == 0)
                    errors.Add("Surname Name is empty.");

                // Warning: When using System.Text.RegularExpressions to process untrusted input, pass a timeout.
                // A malicious user can provide input to RegularExpressions, causing a Denial-of - Service attack.
                // ASP.NET Core framework APIs that use RegularExpressions pass a timeout.
                if (!string.IsNullOrEmpty(email) // Emailis optional
                    && !Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(200)))
                    errors.Add("Email is invalid");

                return errors;
            }
        }
    }


}
