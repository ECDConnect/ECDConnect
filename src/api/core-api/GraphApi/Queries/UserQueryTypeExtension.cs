using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.EGraphQL.ObjectTypes.Input;
using ECDLink.Moodle.Managers;
using ECDLink.Moodle.Models;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class UserQueryTypeExtension
    {

        public UserQueryTypeExtension()
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        // TODO: Move paging code into a "Pagination" service
        // TODO: Builder pattern for query?
        public async Task<IQueryable<ApplicationUser>> GetUsersAsync(
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IGenericRepositoryFactory repoFactory,
            PagedQueryInput? pagingInput = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var usersQuery = userManager.Users
                .Where(u => u.TenantId == tenantId)
                .AsNoTracking();
            usersQuery = AddProvinceFilter(repoFactory, pagingInput, usersQuery);

            usersQuery = AddFiltering(pagingInput, usersQuery);
            usersQuery = AddSorting(pagingInput, usersQuery);

            return usersQuery
                .Skip(pagingInput.RowOffset)
                .Take(pagingInput.PageSize);
        }

        private static IQueryable<ApplicationUser> AddProvinceFilter(IGenericRepositoryFactory repoFactory, PagedQueryInput pagingInput, IQueryable<ApplicationUser> usersQuery)
        {
            var provinceFilters = pagingInput?.FilterBy?.Where(f => f.FieldName == "Province").Select(f => f.Value).ToList();

            if (provinceFilters?.Any() ?? false)
            {
                using var provinceRepo = repoFactory.CreateGenericRepository<Province>();
                var provinceIds = provinceRepo.GetAll()
                    .Where(p => provinceFilters.Contains(p.Description))
                    .Select(p => p.Id);

                //TODO: circumvent thread exception...
                usersQuery = usersQuery
                    .Where(u => provinceIds.Contains(u.practitionerObjectData.SiteAddress.ProvinceId ?? Guid.Empty));
                    //|| provinceIds.Contains(u.principalObjectData.SiteAddress.ProvinceId ?? Guid.Empty)
                    //|| provinceIds.Contains(u.coachObjectData.SiteAddress.ProvinceId ?? Guid.Empty)
                    //|| provinceIds.Contains(u.franchisorObjectData.SiteAddress.ProvinceId ?? Guid.Empty))
            }

            return usersQuery;
        }

        private static IQueryable<ApplicationUser> AddFiltering(PagedQueryInput pagingInput, in IQueryable<ApplicationUser> usersQueryIn)
        {
            var usersQuery = usersQueryIn.Where(t => true);
            // TODO: These will need database indexes?
            if (pagingInput.FilterBy?.Any() ?? false)
            {
                foreach (var filter in pagingInput.FilterBy)
                {
                    switch (filter.FieldName?.ToLower())
                    {
                        case "firstname":
                            usersQuery = usersQuery.Where(u => u.FirstName.Contains(filter.Value));
                            break;
                        case "surname":
                            usersQuery = usersQuery.Where(u => u.Surname.Contains(filter.Value));
                            break;
                        case "fullname":
                            usersQuery = usersQuery.Where(u => u.FullName.Contains(filter.Value));
                            break;
                        case "email":
                            usersQuery = usersQuery.Where(u => u.Email.Contains(filter.Value));
                            break;
                        case "age":
                            usersQuery = usersQuery.Where(u => u.Age == Convert.ToInt32(filter.Value));
                            break;
                        case "username":
                            usersQuery = usersQuery.Where(u => u.UserName.Contains(filter.Value));
                            break;
                        case "emergencycontactfullname":
                            usersQuery = usersQuery.Where(u => u.EmergencyContactFullName.Contains(filter.Value));
                            break;
                        case "idnumber":
                            usersQuery = usersQuery.Where(u => u.IdNumber.Contains(filter.Value));
                            break;
                        case "phonenumber":
                            usersQuery = usersQuery.Where(u => u.PhoneNumber.Contains(filter.Value));
                            break;
                        case "whatsappnumber":
                            usersQuery = usersQuery.Where(u => u.WhatsAppNumber.Contains(filter.Value));
                            break;
                        case "province":
                            // Provices handeled outside loop above ^ (see provinceFilters)
                            break;
                    }

                }
            }

            return usersQuery;
        }

        private static IQueryable<ApplicationUser> AddSorting(PagedQueryInput pagingInput, IQueryable<ApplicationUser> usersQuery)
        {
            if (pagingInput.SortBy?.Any() ?? false)
            {
                foreach (var sort in pagingInput.SortBy)
                {
                    // TODO: Get this working with HotChocolate :(
                    //var sortByFieldName = sort?.FieldName ?? "fullname";
                    //if (sort.Descending)
                    //    usersQuery = usersQuery.OrderByDescending(u => EF.Property<object>(u, sortByFieldName));

                    //if (!sort.Descending)
                    //    usersQuery = usersQuery.OrderBy(u => EF.Property<object>(u, sortByFieldName));

                    switch (sort.FieldName?.ToLower())
                    {
                        case "firstname":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.FirstName)
                                : usersQuery.OrderByDescending(u => u.FirstName);
                            break;
                        case "surname":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.Surname)
                                : usersQuery.OrderByDescending(u => u.Surname);
                            break;
                        case "fullname":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.Surname)
                                : usersQuery.OrderByDescending(u => u.Surname);
                            break;
                        case "email":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.Email)
                                : usersQuery.OrderByDescending(u => u.Email);
                            break;
                        case "age":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.Age)
                                : usersQuery.OrderByDescending(u => u.Age);
                            break;
                        case "username":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.UserName)
                                : usersQuery.OrderByDescending(u => u.UserName);
                            break;
                        case "emergencycontactfullname":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.EmergencyContactFullName)
                                : usersQuery.OrderByDescending(u => u.EmergencyContactFullName);
                            break;
                        case "idnumber":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.IdNumber)
                                : usersQuery.OrderByDescending(u => u.IdNumber);
                            break;
                        default:
                            //case "FullName":
                            usersQuery = sort.Descending == false
                                ? usersQuery.OrderBy(u => u.FullName)
                                : usersQuery.OrderByDescending(u => u.FullName);
                            break;
                    }
                }
            }
            else
            {
                usersQuery = usersQuery.OrderBy(u => u.Surname).ThenBy(u => u.FirstName);
            }

            return usersQuery;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public async Task<ApplicationUser> GetUserById(
            [Service] UserManager<ApplicationUser> userManager,
            [Service] RoleManager<IdentityRole> roleManager,
            IGenericRepositoryFactory repoFactory,
            string userId)
        {
            var user = userManager.FindByIdAsync(userId).Result;

            var roles = await (new ObjectTypes.ApplicationUserExtension()).GetRolesAsync(user, roleManager, userManager);

            if (user != null)
            {
                //Franchisor
                if (roles.Any(x => x.Name.Contains("Franchisor")))
                {
                    var franchisorRepo = repoFactory.CreateGenericRepository<Franchisor>(userContext: user.Id);
                    user.franchisorObjectData = franchisorRepo.GetByUserId(user.Id);
                }
                //Coach
                if (roles.Any(x => x.Name.Contains("Coach")))
                {
                    var coachRepo = repoFactory.CreateGenericRepository<Coach>(userContext: user.Id);
                    user.coachObjectData = coachRepo.GetByUserId(user.Id);
                }
                //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
                if (roles.Any(x => x.Name.Contains("Principal") || x.Name.Contains("Practitioner")))
                {
                    var practiRepo = repoFactory.CreateGenericRepository<Practitioner>(userContext: user.Id);
                    var userData = practiRepo.GetByUserId(user.Id);
                    if (userData != null)
                    {
                        if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
                        {
                            user.practitionerObjectData = null;
                            user.principalObjectData = userData;
                        }
                        else
                        {
                            user.principalObjectData = null;
                            user.practitionerObjectData = userData;
                        }
                    }
                }
                //Child
                if (roles.Any(x => x.Name.Contains("Child")))
                {
                    var childRepo = repoFactory.CreateGenericRepository<Child>(userContext: user.Id);
                    user.childObjectData = childRepo.GetByUserId(user.Id);
                }

                return user.IsActive ? user : default(ApplicationUser);
            }
            return default(ApplicationUser);
        }

        public UserByToken GetUserByToken(
            [Service] UserManager<ApplicationUser> userManager,
            IGenericRepositoryFactory repoFactory,
            string token)
        {
            UserByToken tokenuser = new UserByToken();
            if (token != null)
            {
                var shortUrlRepo = repoFactory.CreateGenericRepository<ShortenUrlEntity>(userContext: null);

                var tokenusr = shortUrlRepo.GetAll().Where(x => x.URL.Contains(token)).OrderByDescending(x => x.InsertedDate).FirstOrDefault();
                if (tokenusr != null)
                {
                    var user = userManager.FindByIdAsync(tokenusr.UserId).Result;

                    if (user is null)
                    {
                        throw new Exception("User not found.");
                    }

                    Guid tenantId = TenantExecutionContext.Tenant.Id;

                    if (user.TenantId != tenantId && user.TenantId != null)
                    {
                        throw new Exception("Cross tenant access denied.");
                    }

                    tokenuser.FullName = user.FullName;
                    tokenuser.PhoneNumber = user.PhoneNumber;
                    tokenuser.UserId = user.Id;
                    tokenuser.RoleName = (user.practitionerObjectData != null ? "Practitioner" : user.principalObjectData != null ? "Principal" : user.coachObjectData != null ? "Coach" : "User");

                }
            }
            return tokenuser;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public string getMoodleSessionForUserId(
            [Service] MoodleManager moodleManager,
            [Service] UserManager<ApplicationUser> userManager,
            string userId)
        {

            var user = userManager.FindByIdAsync(userId).Result;
            var moodleUserName = user.IdNumber + "@ecdconnect.co.za";
            var moodlePassword = "Test@1234";

            var cohorts = new List<string>();

            string moodleConfigVar = TenantExecutionContext.Tenant.MoodleConfigVar;
            if (!string.IsNullOrEmpty(moodleConfigVar))
            {
                var moodleConfig = JsonConvert.DeserializeObject<MoodleConfig>(moodleConfigVar);
                var allCohorts = moodleConfig.All.Cohorts;
                foreach (var cohort in allCohorts)
                {
                    cohorts.Add(cohort);
                }
            }

            var moodleUser = new MoodleUser()
            {
                UserName = moodleUserName,
                Password = moodlePassword,
                IdNumber = user.IdNumber,
                Firstname = user.FirstName,
                Lastname = user.Surname,
                Email = moodleUserName, // user.Email,
                Phone1 = string.IsNullOrEmpty(user.PhoneNumber) ? "" : user.PhoneNumber
            };
            // create user for moodle
            return moodleManager.CreateUserAsync(moodleUser, cohorts).Result.ToString();
            // create session for moodle user
            // return moodleManager.CreateUserSessionAsync(moodleUserName).Result;
        }

    }
}
