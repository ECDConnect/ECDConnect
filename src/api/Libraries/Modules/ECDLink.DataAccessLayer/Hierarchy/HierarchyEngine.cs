using ECDLink.Abstractrions.Services;
using ECDLink.Core.Caching;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Documents;
using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;

namespace ECDLink.DataAccessLayer.Hierarchy
{
    public class HierarchyEngine
    {
        private readonly ICacheService<ITenantCache> _cacheService;
        private readonly IGenericRepositoryFactory _repoFactory;
        //private readonly IDbContextFactory<AuthenticationDbContext> _dbFactory;

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

        public List<string> GetHierarchyByParentList<T>(
        UserManager<ApplicationUser> _userManager,
        string userId)
        {
            List<string> hierarchyList = new List<string>();
            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception("No user specified");
            }
            //case on type, and depending on type, iterate through different levels of collecting a list of hierarchies to use
            var franchisorRepo = _repoFactory.CreateGenericRepository<Franchisor>(userContext: userId);
            var coachRepo = _repoFactory.CreateGenericRepository<Coach>(userContext: userId);
            var practRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: userId);
            var user = _userManager.FindByIdAsync(userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;            
            var isFranchisor = roles.Contains(Roles.FRANCHISOR);
            var isCoach = roles.Contains(Roles.COACH);
            var isPrincipal = roles.Contains(Roles.PRINCIPAL);
            var isPractitioner = roles.Contains(Roles.PRACTITIONER);

            hierarchyList.Add(this.GetUserHierarchy(userId));
            if (isFranchisor) {
                List<Coach> franchisorCoaches = coachRepo.GetAll().ToList();
                franchisorCoaches = franchisorCoaches.Where(c => c.FranchisorId.Equals(userId)).ToList();
                if (franchisorCoaches.Count > 0)
                {
                    foreach (var c in franchisorCoaches)
                    {
                        hierarchyList.Add(this.GetUserHierarchy(c.UserId));
                        List<Practitioner> franchisorsPractitioners = practRepo.GetAll().ToList();
                        if (franchisorsPractitioners.Count > 0)
                        {
                            foreach (var p in franchisorsPractitioners)
                            {
                                hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                            }
                        }
                    }
                }
            } else if (isCoach) {
                List<Practitioner> coachPractitioners = practRepo.GetAll().ToList();
                coachPractitioners = coachPractitioners.Where(c => c.CoachHierarchy.HasValue).ToList();
                coachPractitioners = coachPractitioners.Where(c => c.CoachHierarchy.ToString() == userId).ToList();
                if (coachPractitioners.Count > 0)
                {
                    foreach (var p in coachPractitioners)
                    {
                        hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                    }
                }
            } else if (isPrincipal || isPractitioner) {
                List<Practitioner> principalPractitioners = practRepo.GetAll().ToList();
                principalPractitioners = principalPractitioners.Where(c => c.PrincipalHierarchy.HasValue).ToList();
                principalPractitioners = principalPractitioners.Where(c => c.PrincipalHierarchy.ToString() == userId).ToList();
                if (principalPractitioners.Count > 0)
                {
                    foreach (var p in principalPractitioners)
                    {
                        hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                    }
                }
            }
            //in some cases liek a child, we need to get the relevant children hierarchy in addition for the generic repository selectionlist
            if (typeof(T) == typeof(Child))
            {
                var childRepo = _repoFactory.CreateGenericRepository<Child>(userContext: userId);
                //use the parent list to determine
                List<string> childHierarchyList = hierarchyList.Copy();
                foreach (var hierarchy in childHierarchyList)
                {
                    List<string> childHierarchy = childRepo.GetAll().Where(c => c.Hierarchy.StartsWith(hierarchy)).Select(p => p.Hierarchy).ToList();
                    if (childHierarchy.Any())
                    {
                        hierarchyList.AddRange(childHierarchy);
                    }
                }
            }

            return hierarchyList;
        }

        public string GetHierarchy<TChild>(string parentId, string childId)
            where TChild : IUserType
        {
            var childType = typeof(TChild).FullName;

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
