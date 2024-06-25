using EcdLink.Api.CoreApi.GraphApi.Models.Permissions;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PermissionQueryTypeExtension
    {
        [Permission(PermissionGroups.SYSTEM, GraphActionEnum.View)]
        public async Task<IEnumerable<PermissionGroupModel>> GetPermissionGroups(IGenericRepositoryFactory repositoryFactory)
        {
            var permissionsRepository = repositoryFactory.CreateRepository<Permission>();

            var permissionQuery = permissionsRepository.GetAll();
            var permissions = await permissionQuery.ToListAsync();

            var grouping = permissions.Select(x => x.Grouping).Distinct().ToList();

            var grouped = new List<PermissionGroupModel>();

            foreach (var permissionGroup in grouping)
            {
                grouped.Add(new PermissionGroupModel
                {
                    GroupName = permissionGroup,
                    Permissions = permissions.Where(x => string.Equals(x.Grouping, permissionGroup))
                });
            }

            return grouped;
        }

        [Permission(PermissionGroups.USERPERMISSION, GraphActionEnum.View)]
        public List<PractitionerPermissionModel> GetPractitionerRolePermissions(IGenericRepositoryFactory repoFactory)
        {
            var permissionsRepository = repoFactory.CreateRepository<Permission>();
            return permissionsRepository
                .GetAll()
                .Where(x => x.IsActive && x.Grouping == UserPermissionGroups.PRACTITIONER)
                .Select(item => new PractitionerPermissionModel(item)).ToList();
        }
    }
}
