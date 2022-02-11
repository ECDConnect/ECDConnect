using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ECDLink.DataAccessLayer.Hierarchy
{
    public class HierarchyEngine
    {
        private readonly ICacheService<ITenantCache> _cacheService;
        private readonly IGenericRepositoryFactory _repoFactory;

        private IEnumerable<HierarchyEntity> HierarchyCache
        {
            get
            {
                if (!_cacheService.Exists(CacheKeyConstants.HierarchyCache))
                {
                    var hierarchy = _repoFactory.CreateRepository<HierarchyEntity>().GetAll().ToList();

                    _cacheService.SetCacheItem(CacheKeyConstants.HierarchyCache, hierarchy);
                }

                return _cacheService.GetCacheItem<IEnumerable<HierarchyEntity>>(CacheKeyConstants.HierarchyCache);
            }
        }

        public HierarchyEngine(ICacheService<ITenantCache> cacheService, IGenericRepositoryFactory repoFactory)
        {
            _cacheService = cacheService;
            _repoFactory = repoFactory;
        }

        public UserHierarchyEntity AddHierarchyEntity<TChild>(string parentId, string childId)
        {
            var childType = typeof(TChild).FullName;

            // Only one hierarchy type allowed for now
            // Multiple to be added in the future
            var hierarchyType = HierarchyCache
                                    .Where(x => string.Equals(x.SystemType, childType))
                                    .FirstOrDefault();

            var parentHierarchyType = HierarchyCache
                                        .Where(x => x.Id == hierarchyType.ParentId)
                                        .FirstOrDefault();


            if (hierarchyType == default)
            {
                throw new ArgumentNullException($"{typeof(TChild).Name} not configured in hierarchy");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            UserHierarchyEntity parentEntity = default;
            // Potentially use Guid on the userHierarchy here instead of the the name

            if (hierarchyType.ParentId != default)
            {
                parentEntity = userHierarchyRepo.GetAll()
                                    .Where(x => string.Equals(x.UserId, parentId))
                                    .Where(x => string.Equals(x.UserType, parentHierarchyType.Type))
                                    .FirstOrDefault();
            } 

            var childHierarchyEntity = new UserHierarchyEntity
            {
                Id = Guid.NewGuid(),
                NamedTypePath = HierarchyHelper.AppendHierarchy(parentEntity?.NamedTypePath ?? "System.", hierarchyType.Type),
                ParentId = parentId,
                UserId = childId,
                UserType = hierarchyType.Type
            };

            var newHierarchy = userHierarchyRepo.Insert(childHierarchyEntity);

            newHierarchy.Hierarchy = HierarchyHelper.AppendHierarchy(parentEntity?.Hierarchy ?? "0.", newHierarchy.Key.ToString());

            userHierarchyRepo.Update(newHierarchy);

            return newHierarchy;
        }

        public string GetHierarchy<TChild>(string parentId, string childId)
            where TChild : IUserType
        {
            var childType = typeof(TChild).FullName;

            // Only one hierarchy type allowed for now
            // Multiple to be added in the future
            var hierarchyType = HierarchyCache
                                    .Where(x => string.Equals(x.SystemType, childType))
                                    .FirstOrDefault();

            var parentHierarchyType = HierarchyCache
                                        .Where(x => x.Id == hierarchyType.ParentId)
                                        .FirstOrDefault();


            if (hierarchyType == default)
            {
                throw new ArgumentNullException($"{typeof(TChild).Name} not configured in hierarchy");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => string.Equals(x.UserId, childId))
                               .Where(x => string.Equals(x.ParentId, parentId))
                               .Where(x => string.Equals(x.UserType, hierarchyType.Type))
                               .FirstOrDefault();

            return entity.Hierarchy;
        }

        public string GetUserHierarchy(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception("No user specified");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => string.Equals(x.UserId, userId))
                               .FirstOrDefault();

            return entity?.Hierarchy;
        }

        public string GetAdminUserId()
        {
            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.IsActive && string.Equals(x.UserType, "Administrator"))
                               .FirstOrDefault();

            return entity?.UserId;
        }

        public bool RemoveHierarchy(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return false;
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => string.Equals(x.UserId, userId))
                               .FirstOrDefault();

            entity.IsActive = false;

            userHierarchyRepo.Update(entity);

            return true;
        }
    }
}
