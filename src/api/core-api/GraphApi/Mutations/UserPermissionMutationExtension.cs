using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.Input;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class UserPermissionMutationExtension
    {
        [Permission(PermissionGroups.USERPERMISSION, GraphActionEnum.Update)]
        public List<UserPermissionModel> UpdateUserPermission(
            IGenericRepositoryFactory repoFactory,
            [Service] IHttpContextAccessor httpContextAccessor,
            UpdateUserPermissionInputModel input)
        {
            var uId = httpContextAccessor.HttpContext.GetUser().Id;
            var userPermissionRepo = repoFactory.CreateGenericRepository<UserPermission>(userContext: uId);
            var permissionRepo = repoFactory.CreateGenericRepository<Permission>(userContext: uId);

            if (input == null)
            {
                throw new ArgumentNullException("input");
            }

            if (input.UserId.ToString() == "")
            {
                throw new ArgumentException("UserId is empty");
            }

            // Current permissions linked to user 
            var allUserPermissions = userPermissionRepo.GetAll().Where(x => x.UserId == input.UserId).ToList();

            // Archive user permissions
            if (input.PermissionIds.Count == 0 && allUserPermissions.Any())
            {
                foreach (var item in allUserPermissions)
                {
                    userPermissionRepo.Delete(item.Id);
                }
            } 
            else
            {
                // Fetch all available system permissions for practitioners for assignment to current user
                var practitionerSystemPermissionsIds = permissionRepo.GetAll()
                                                        .Where(x => x.IsActive && x.Grouping == UserPermissionGroups.PRACTITIONER)
                                                        .Select(x => x.Id)
                                                        .ToList();

                
                var allUserPermissionIds = allUserPermissions.Select(x => x.PermissionId).ToList();

                var permissionIdsToAddAsArchived = practitionerSystemPermissionsIds.Where(x => !input.PermissionIds.Contains(x) && !allUserPermissionIds.Contains(x)).ToList();
                var permissionIdsToAddAsActive = input.PermissionIds.Where(x => !allUserPermissionIds.Contains(x)).ToList();
                var permissionIdsToArchive = allUserPermissions.Where(x => x.IsActive == true && !input.PermissionIds.Contains(x.PermissionId)).Select(x => x.PermissionId).ToList();
                var permissionIdsToActivate = allUserPermissions.Where(x => x.IsActive == false && input.PermissionIds.Contains(x.PermissionId)).Select(x => x.PermissionId).ToList();

                if (permissionIdsToAddAsArchived.Any())
                {
                    List<UserPermission> newPermissions = new List<UserPermission>();
                    foreach (var item in permissionIdsToAddAsArchived)
                    {
                        newPermissions.Add(new UserPermission()
                        {
                            Id = Guid.NewGuid(),
                            UserId = input.UserId,
                            PermissionId = item,
                            IsActive = false
                        });
                    }
                    userPermissionRepo.InsertMany(newPermissions);
                }

                if (permissionIdsToAddAsActive.Any())
                {
                    List<UserPermission> newPermissions = new List<UserPermission>();
                    foreach (var item in permissionIdsToAddAsActive)
                    {
                        newPermissions.Add(new UserPermission()
                        {
                            Id = Guid.NewGuid(),
                            UserId = input.UserId,
                            PermissionId = item,
                            IsActive = true
                        });
                    }
                    userPermissionRepo.InsertMany(newPermissions);
                }

                if (permissionIdsToArchive.Any())
                {
                    foreach (var item in permissionIdsToArchive)
                    {
                        var permissionToArchive = allUserPermissions.Where(x => x.PermissionId == item).FirstOrDefault();
                        userPermissionRepo.Delete(permissionToArchive.Id);
                    }
                }

                if (permissionIdsToActivate.Any())
                {
                    foreach (var item in permissionIdsToActivate)
                    {
                        var permissionToActivate = allUserPermissions.Where(x => x.PermissionId == item).FirstOrDefault();
                        permissionToActivate.IsActive = true;
                        permissionToActivate.UpdatedDate = DateTime.Now;
                        permissionToActivate.UpdatedBy = uId.ToString();
                        userPermissionRepo.Update(permissionToActivate);
                    }
                }
            }

            return userPermissionRepo
                .GetAll()
                .Include(x => x.Permission)
                .Where(x => x.UserId == input.UserId).Select(x => new UserPermissionModel(x))
                .ToList();
        }
    }
}
