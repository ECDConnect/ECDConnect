using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using Document = ECDLink.DataAccessLayer.Entities.Documents.Document;

namespace ECDLink.DataAccessLayer.Hierarchy
{
    public class HierarchyEngine
    {
        private readonly ICacheService<ITenantCache> _cacheService;
        private readonly IGenericRepositoryFactory _repoFactory;
        private readonly ILogger<HierarchyEngine> _logger;

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

        public HierarchyEngine(ICacheService<ITenantCache> cacheService, IGenericRepositoryFactory repoFactory, ILogger<HierarchyEngine> logger)
        {
            _cacheService = cacheService;
            _repoFactory = repoFactory;
            _logger = logger;
            //_logger.LogInformation("HierarchyEngine constructed");

        }

        public UserHierarchyEntity AddHierarchyEntity<TChild>(Guid parentId, Guid childId)
        {
            var childType = typeof(TChild).FullName;
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            // Only one hierarchy type allowed for now
            // Multiple to be added in the future
            var hierarchyType = HierarchyCache
                                    .Where(x => string.Equals(x.SystemType, childType))
                                    .OrderBy(x => x.Id)
                                    .FirstOrDefault();

            var parentHierarchyType = HierarchyCache
                                        .Where(x => x.Id == hierarchyType.ParentId)
                                        .OrderBy(x => x.Id)
                                        .FirstOrDefault();


            if (hierarchyType == default)
            {
                throw new ArgumentNullException($"{typeof(TChild).Name} not configured in hierarchy");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            UserHierarchyEntity parentEntity = default;

            if (hierarchyType.ParentId != default)
            {
                parentEntity = userHierarchyRepo.GetAll()
                                    .Where(x => x.UserId == parentId)
                                    .Where(x => string.Equals(x.UserType, parentHierarchyType.Type))
                                    .OrderBy(x => x.Id)
                                    .FirstOrDefault();
            }

            var childHierarchyEntity = new UserHierarchyEntity
            {
                Id = Guid.NewGuid(),
                NamedTypePath = HierarchyHelper.AppendHierarchy(parentEntity?.NamedTypePath ?? "System.", hierarchyType.Type),
                ParentId = parentId,
                UserId = childId,
                UserType = hierarchyType.Type,
                TenantId = tenantId
            };

            var newHierarchy = userHierarchyRepo.Insert(childHierarchyEntity);

            newHierarchy.Hierarchy = HierarchyHelper.AppendHierarchy(parentEntity?.Hierarchy ?? "0.", newHierarchy.Key.ToString());

            userHierarchyRepo.Update(newHierarchy);

            return newHierarchy;
        }

        // Case on type, and depending on type, iterate through different levels of collecting a list of hierarchies to use
        public List<string> GetHierarchyByParentList<T>(
            ApplicationUserManager _userManager,
            Guid userId)
        {
            var practRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: userId);

            var user = _userManager.FindByIdAsync(userId.ToString()).Result;
            var roles = _userManager.GetRolesAsync(user).Result;

            var isCoach = roles.Contains(Roles.COACH);
            var isPrincipal = roles.Contains(Roles.PRINCIPAL);
            var isPractitioner = roles.Contains(Roles.PRACTITIONER);

            // Add userId to list of hierarchies to fetch
            var userIdsToFetch = new List<Guid>() { userId };

            if (isCoach)
            {
                userIdsToFetch.AddRange(
                    GetCoachIds(practRepo, userId));
            }
            else if (isPrincipal || isPractitioner)
            {
                userIdsToFetch.AddRange(
                    GetPrincipalPractitionerIds(practRepo, userId));
            }
            // Fetch all user hierarchies before they are used
            var userHierarchies = GetManyUserHierarchy(userIdsToFetch);

            var hierarchyList = new List<string>();
            if (userHierarchies?.Any() ?? false)
            {
                hierarchyList.AddRange(userHierarchies.Distinct());
            }

            //in some cases like a child, we need to get the relevant children hierarchy in addition for the generic repository selectionlist
            if (typeof(T) == typeof(Child))
            {
                var childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: userId);
                var childHierarchies = new List<string>();

                //use the parent list to determine
                foreach (var hierarchy in hierarchyList)
                {
                    List<string> childHierarchy = childRepo.GetAll()
                        .Where(c => c.Hierarchy.StartsWith(hierarchy)).Select(p => p.Hierarchy)
                        .ToList();
                    if (childHierarchy.Any())
                    {
                        childHierarchies.AddRange(childHierarchy);
                    }
                }

                hierarchyList.AddRange(childHierarchies);
            }
            //in some cases like a learner, similarly to a child, we need to get the relevant children hierarchy in addition for the generic repository selectionlist
            if (typeof(T) == typeof(Learner))
            {
                var childRepo = _repoFactory.CreateGenericRepository<Learner>(userContext: userId);
                var learnerHierarchies = new List<string>();

                //use the parent list to determine
                foreach (var hierarchy in hierarchyList)
                {
                    List<string> learnerHierarchy = childRepo.GetAll().Where(c => c.Hierarchy.StartsWith(hierarchy)).Select(p => p.Hierarchy).ToList();
                    if (learnerHierarchy.Any())
                    {
                        learnerHierarchies.AddRange(learnerHierarchy);
                    }
                }

                hierarchyList.AddRange(learnerHierarchies);
            }
            if (typeof(T) == typeof(Document))
            {
                var documentRepo = _repoFactory.CreateGenericRepository<Document>(userContext: userId);

                var documentHierarchy = GetManyDocumentsByHierarchy(documentRepo, hierarchyList);

                if (documentHierarchy.Any())
                {
                    hierarchyList.AddRange(documentHierarchy);
                }
            }

            return hierarchyList.Distinct().ToList();
        }

        private static List<Guid> GetCoachIds(IGenericRepository<Practitioner, Guid> practRepo, Guid userIdGuid)
        {
            var coachPractitioners = practRepo.GetAll()
                .Where(c => c.CoachHierarchy.HasValue == true && c.CoachHierarchy == userIdGuid)?
                .Select(p => p.UserId.Value)
                .ToList();

            return coachPractitioners ?? new List<Guid>();
        }

        private static List<Guid> GetPrincipalPractitionerIds(IGenericRepository<Practitioner, Guid> practitionerRepo, Guid userIdGuid)
        {
            // some practitioners can be principal as owner with only themselves as owner
            var principalPractitioners = practitionerRepo.GetAll()
                .Where(c => (c.PrincipalHierarchy.HasValue && c.PrincipalHierarchy == userIdGuid) || (c.IsPrincipal == true && c.UserId == userIdGuid))
                .Select(p => p.UserId.Value)
                .ToList();

            List<Guid> ids = new List<Guid>();
            if (principalPractitioners.Count > 0)
            {
                ids = principalPractitioners;
            }

            return ids;
        }

        public string GetHierarchy<TChild>(Guid parentId, Guid childId)
            where TChild : IUserType
        {
            var childType = typeof(TChild).FullName;

            var hierarchyType = HierarchyCache
                                    .Where(x => string.Equals(x.SystemType, childType))
                                    .OrderBy(x => x.Id)
                                    .FirstOrDefault();

            if (hierarchyType == default)
            {
                throw new ArgumentNullException($"{typeof(TChild).Name} not configured in hierarchy");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.UserId == childId)
                               .Where(x => x.ParentId == parentId)
                               .Where(x => string.Equals(x.UserType, hierarchyType.Type))
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();

            return entity.Hierarchy;
        }

        public string GetUserHierarchy(Guid? userId)
        {
            if (!userId.HasValue)
            {
                throw new Exception("No user specified");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.UserId == userId.Value)
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();

            return entity?.Hierarchy;
        }

        public Guid? GetUserParentUserId(Guid? userId)
        {
            if (!userId.HasValue)
            {
                throw new Exception("No user specified");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.UserId == userId.Value)
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();

            return entity?.ParentId;
        }

        public IQueryable<string> GetManyUserHierarchy(IEnumerable<string> userIds)
        {
            return GetManyUserHierarchy(userIds.Select(x => Guid.Parse(x)));
        }
        public IQueryable<string> GetManyUserHierarchy(IEnumerable<Guid> userIds)
        {
            if (!(userIds?.Any() ?? false))
            {
                throw new Exception("No user specified");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entites = userHierarchyRepo.GetAll()
                .Where(x => userIds.Contains(x.UserId.Value))
                .Select(e => e.Hierarchy);

            return entites;
        }

        public IEnumerable<string> GetManyDocumentsByHierarchy(IGenericRepository<Document, Guid> docRepo, IEnumerable<string> hierarchyIds)
        {
            if (!(hierarchyIds?.Any() ?? false))
            {
                return new List<string>().AsQueryable();
            }

            var hierarchies = new List<string>();
            foreach (var hierarchyId in hierarchyIds)
            {
                var a = docRepo.GetAll()
                    .Where(x => ((IUserScoped)x).Hierarchy.StartsWith(hierarchyId))
                    .Select(p => p.Hierarchy)
                    .ToList();
                hierarchies.AddRange(a);
            }

            return hierarchies;
        }


        public Guid? GetAdminUserId()
        {
            var value = _cacheService.GetCacheItem<List<Guid?>>(CacheKeyConstants.UserHierarchyAdminUserIdCache);
            if (value == null)
            {
                var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();
                value = userHierarchyRepo.GetAll()
                                   .Where(x => x.IsActive && string.Equals(x.UserType, "Administrator") && x.TenantId.Equals(TenantExecutionContext.Tenant.Id))
                                   .OrderBy(x => x.Key)
                                   .Select(x => x.UserId)
                                   .ToList();
                _cacheService.SetCacheItem(CacheKeyConstants.UserHierarchyAdminUserIdCache, value,
                    new MemoryCacheEntryOptions()
                        .SetSize(1)
                        .SetAbsoluteExpiration(TimeSpan.FromSeconds(15 * 60))
                        );


            }
            return value.Count == 0 ? null : value[0];
        }

        public Guid? GetSuperAdminUserId()
        {
            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.IsActive && string.Equals(x.UserType, "SuperAdministrator"))
                               .OrderBy(x => x.Key)
                               .FirstOrDefault();

            return entity?.UserId;
        }

        public bool RemoveHierarchy(Guid? userId)
        {
            if (!userId.HasValue)
            {
                return false;
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.UserId == userId.Value)
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();
            entity.IsActive = false;

            userHierarchyRepo.Update(entity);


            return true;
        }

        public bool DeleteHierarchy(Guid? userId)
        {
            if (!userId.HasValue)
            {
                return false;
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.UserId == userId.Value)
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();
            if (entity != null)
            {
                userHierarchyRepo.Delete(entity.Id);
            }

            return true;
        }
    }
}
