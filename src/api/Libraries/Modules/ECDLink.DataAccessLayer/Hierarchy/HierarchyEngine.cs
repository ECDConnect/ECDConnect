using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
                                    .Where(x => string.Equals(x.UserId, parentId))
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
        UserManager<ApplicationUser> _userManager,
        string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception("No user specified");
            }

            var practRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: userId);

            var userIdGuid = Guid.Parse(userId);

            var user = _userManager.FindByIdAsync(userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;

            var isFranchisor = roles.Contains(Roles.FRANCHISOR);
            var isCoach = roles.Contains(Roles.COACH);
            var isPrincipal = roles.Contains(Roles.PRINCIPAL);
            var isPractitioner = roles.Contains(Roles.PRACTITIONER);

            // Add userId to list of hierarchies to fetch
            var userIdsToFetch = new List<string>() { userId };

            if (isFranchisor)
            {
                userIdsToFetch.AddRange(
                    GetFranchisorIds(practRepo, userIdGuid));
            }
            else if (isCoach)
            {
                userIdsToFetch.AddRange(
                    GetCoachIds(practRepo, userIdGuid));
            }
            else if (isPrincipal || isPractitioner)
            {
                userIdsToFetch.AddRange(
                    GetPrincipalPractitionerIds(practRepo, userIdGuid));
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

        private List<string> GetFranchisorIds(IGenericRepository<Practitioner, Guid> practRepo, Guid userIdGuid)
        {
            var coachRepo = _repoFactory.CreateGenericRepository<Coach>(userContext: userIdGuid.ToString());
            List<Guid> franchisorCoachIds = coachRepo.GetAll()
                .Where(c => c.FranchisorId == userIdGuid)
                .Select(f => Guid.Parse(f.UserId))
                .ToList();

            List<string> userIdsToFetch = new List<string>();
            if (franchisorCoachIds?.Count > 0)
            {
                var coachIdsToFetch = franchisorCoachIds.Where(f => f != null).Select(f => f.ToString());
                userIdsToFetch.AddRange(coachIdsToFetch);
            }

            List<Practitioner> franchisorsPractitioners = practRepo.GetAll()
                    .Where(p => franchisorCoachIds.Contains(p.CoachHierarchy ?? Guid.Empty))
                    .ToList();

            if (franchisorsPractitioners?.Count > 0)
            {
                userIdsToFetch.AddRange(franchisorsPractitioners.Select(f => f.UserId));
            }

            return userIdsToFetch;
        }

        private static List<string> GetCoachIds(IGenericRepository<Practitioner, Guid> practRepo, Guid userIdGuid)
        {
            var coachPractitioners = practRepo.GetAll()
                .Where(c => c.CoachHierarchy.HasValue == true && c.CoachHierarchy == userIdGuid)?
                .Select(p => p.UserId)?
                .ToList();

            return coachPractitioners ?? new List<string>();
        }

        private static List<string> GetPrincipalPractitionerIds(IGenericRepository<Practitioner, Guid> practitionerRepo, Guid userIdGuid)
        {
            // some practitioners can be principal as owner with only themselves as owner
            var principalPractitioners = practitionerRepo.GetAll()
                .Where(c => (c.PrincipalHierarchy.HasValue && c.PrincipalHierarchy == userIdGuid) || (c.IsPrincipal == true && c.UserId == userIdGuid.ToString()))
                .Select(p => p.UserId.ToString())
                .ToList();

            List<string> ids = new List<string>();

            if (principalPractitioners.Count > 0)
            {
                ids = principalPractitioners.Where(u => u != null)
                    .ToList();
            }

            return ids;
        }

        public string GetHierarchy<TChild>(string parentId, string childId)
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
                               .Where(x => string.Equals(x.UserId, childId))
                               .Where(x => string.Equals(x.ParentId, parentId))
                               .Where(x => string.Equals(x.UserType, hierarchyType.Type))
                               .OrderBy(x => x.Id)
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
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();

            return entity?.Hierarchy;
        }

        public string GetUserParentUserId(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception("No user specified");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => string.Equals(x.UserId, userId))
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();

            return entity?.ParentId;
        }

        public IQueryable<string> GetManyUserHierarchy(IEnumerable<string> userIds)
        {
            if (!(userIds?.Any() ?? false))
            {
                throw new Exception("No user specified");
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entites = userHierarchyRepo.GetAll()
                .Where(x => userIds.Contains(x.UserId))
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


        public string GetAdminUserId()
        {
            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();            
            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.IsActive && string.Equals(x.UserType, "Administrator") && x.TenantId.Equals(TenantExecutionContext.Tenant.Id))
                               .OrderBy(x => x.Key)
                               .FirstOrDefault();

            return entity?.UserId;
        }

        public string GetIntegrationUserId()
        {
            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();
            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.IsActive && string.Equals(x.UserType, "Administrator") && string.Equals(x.User.UserName, "IntegrationUser"))
                               .OrderBy(x => x.Key)
                               .FirstOrDefault();

            return entity?.UserId;
        }

        public string GetSuperAdminUserId()
        {
            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var entity = userHierarchyRepo.GetAll()
                               .Where(x => x.IsActive && string.Equals(x.UserType, "SuperAdministrator"))
                               .OrderBy(x => x.Key)
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
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();
            entity.IsActive = false;

            userHierarchyRepo.Update(entity);


            return true;
        }

        public bool DeleteHierarchy(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return false;
            }

            var userHierarchyRepo = _repoFactory.CreateRepository<UserHierarchyEntity>();

            var entity = userHierarchyRepo.GetAll()
                               .Where(x => string.Equals(x.UserId, userId))
                               .OrderBy(x => x.Id)
                               .FirstOrDefault();

            userHierarchyRepo.Delete(entity.Id);

            return true;
        }
    }
}
