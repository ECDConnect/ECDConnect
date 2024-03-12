using ECDLink.Abstractrions.Constants;
using ECDLink.Core.Extensions;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace ECDLink.DataAccessLayer.Configuration.Setup.Seed.SeedFunctions
{
    public class AuthenticationSeed
    {
        private readonly IServiceProvider serviceProvider;

        public AuthenticationSeed(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;

            SeedHierarchy();
            SeedUsers();
            SeedRoles();
            SeedPermissions();
            SeedUserRoles();
        }

        private void SeedUsers()
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var userManager = serviceProvider.GetService<ApplicationUserManager>();

            var newUser = new ApplicationUser
            {
                Email = "test@test.com",
                UserName = "admin",
                ContactPreference = MessageTypeConstants.SMS,
                IdNumber = "2711305800088",
                FirstName = "Admin",
                Surname = "Admin",
                PhoneNumber = "0614887313",
                IsActive = true,
                TenantId = tenantId,
            };

            userManager.CreateAsync(newUser);
            userManager.AddPasswordAsync(newUser, "Hello123!");

            var engine = serviceProvider.GetService<HierarchyEngine>();
            engine.AddHierarchyEntity<ApplicationUser>(newUser.Id, newUser.Id);
        }

        private void SeedRoles()
        {
            var roleManager = serviceProvider.GetService<ApplicationRoleManager> ();

            string[] roles =
            {
                "Administrator",
                "Coach",
                "Practitioner",
                "Child",
                "Learner",
                "ClassroomGroup",
                "Principal",
                "Franchisor"
            };

            foreach (var role in roles)
            {
                var roleExists = roleManager.RoleExistsAsync(role).Result;

                if (!roleExists)
                {
                    roleManager.CreateAsync(new ApplicationIdentityRole(role));
                }
            }
        }

        private void SeedPermissions()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var permissionManager = repositoryFactory.CreateRepository<Permission>();

            var context = serviceProvider.GetService<AuthenticationDbContext>();

            var types = context.Model.GetEntityTypes().Where(x => x.Name.Contains("ECDLink"));

            var permissions = new List<Tuple<string, string, string>>();

            var commandList = new[]
            {
                SecurityConstants.ApiActions.CREATE,
                SecurityConstants.ApiActions.UPDATE,
                SecurityConstants.ApiActions.DELETE,
                SecurityConstants.ApiActions.VIEW
            };

            foreach (var item in types)
            {
                foreach (var command in commandList)
                {
                    var grouping = item.ClrType.GetCustomAttribute<EntityPermissionAttribute>();

                    var permissionName = grouping?.PermissionName ?? string.Empty;

                    if (string.IsNullOrEmpty(permissionName))
                    {
                        continue;
                    }

                    permissions.Add(Tuple.Create(permissionName, $"{command}_{permissionName}".ToLower(), $"{command} {permissionName.SplitCamelCase()}"));
                }
            }

            var allPermissions = permissionManager.GetAll();

            foreach (var permission in permissions)
            {
                if (!allPermissions.Any(x => string.Equals(x.Name, permission.Item2)))
                {
                    permissionManager.Insert(new Permission
                    {
                        Name = permission.Item2,
                        NormalizedName = permission.Item3,
                        Grouping = permission.Item1
                    });
                }
            }
        }

        private void SeedUserRoles()
        {
            var userManager = serviceProvider.GetService<ApplicationUserManager>();

            var roleManager = serviceProvider.GetService<ApplicationRoleManager>();

            var allRoles = roleManager.Roles.Select(x => x.Name).ToList();

            var allUsers = userManager.Users.ToList();

            foreach (var user in allUsers)
            {
                userManager.AddToRolesAsync(user, allRoles);
            }
        }

        private void SeedHierarchy()
        {
            var repositoryFactory = serviceProvider.GetService<IGenericRepositoryFactory>();

            var hierarchyRepo = repositoryFactory.CreateRepository<HierarchyEntity>();

            var list = new List<HierarchyEntity>()
            {
                new HierarchyEntity
                {
                    Id = Guid.Parse("d5e8030b-5ea3-4de8-a403-60d8e34d4d21"),
                    IsActive = true,
                    ParentId = default,
                    SystemType = typeof(ApplicationUser).FullName,
                    Type = "Administrator"
                },
                new HierarchyEntity
                {
                    Id = Guid.Parse("c3eb2d28-832e-4202-b251-278b1dc89844"),
                    IsActive = true,
                    ParentId = Guid.Parse("d5e8030b-5ea3-4de8-a403-60d8e34d4d21"),
                    SystemType = typeof(Practitioner).FullName,
                    Type = typeof(Practitioner).Name
                },
                new HierarchyEntity
                {
                    Id = Guid.Parse("9ec454ac-ac26-4a5c-914d-e1191edcfa78"),
                    IsActive = true,
                    ParentId = Guid.Parse("c3eb2d28-832e-4202-b251-278b1dc89844"),
                    SystemType = typeof(Child).FullName,
                    Type = typeof(Child).Name
                },
                 new HierarchyEntity
                {
                    Id = Guid.Parse("4fc01cd6-0acb-4634-897c-465a783074c3"),
                    IsActive = true,
                    ParentId = Guid.Parse("9ec454ac-ac26-4a5c-914d-e1191edcfa78"),
                    SystemType = typeof(Learner).FullName,
                    Type = typeof(Learner).Name
                },
                  new HierarchyEntity
                {
                    Id = Guid.Parse("60d908cc-cb62-4143-9605-0095dfd7e432"),
                    IsActive = true,
                    ParentId = Guid.Parse("c3eb2d28-832e-4202-b251-278b1dc89844"),
                    SystemType = typeof(ClassroomGroup).FullName,
                    Type = typeof(ClassroomGroup).Name
                },
            };

            foreach (var item in list)
            {
                hierarchyRepo.Insert(item);
            }
        }
    }
}
