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

        public List<string> GetHierarchyByParentList(
        UserManager<ApplicationUser> _userManager,
        string requestingUser, 
        string userId)
        {
            List<string> hierarchyList = new List<string>();
            if (string.IsNullOrEmpty(userId))
            {
                throw new Exception("No user specified");
            }
            //var roles = _userManager.GetRolesAsync(requestingUser).Result;
            ////setup db conenction
            //using var scope = dbFactory.CreateDbContext();
            //using var dbContextTransaction = scope.Database.BeginTransaction();
            //var uId = contextAccessor.HttpContext.GetUser().Id;

            //repo = _provider.GetService<ElevatedScopedGenericRepository<T>>();
            //case on type, and depending on type, iterate through different levels of collecting a list of hierarchies to use
            var franchisorRepo = _repoFactory.CreateGenericRepository<Franchisor>(userContext: requestingUser);
            var coachRepo = _repoFactory.CreateGenericRepository<Coach>(userContext: requestingUser);
            var practRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: requestingUser);
            var user = _userManager.FindByIdAsync(requestingUser).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            //object userObject = roles.Contains(Roles.FRANCHISOR) ? typeof(Franchisor) : (roles.Contains(Roles.COACH) ? typeof(Franchisor) : (roles.Contains(Roles.PRINCIPAL) ? typeof(Principal) : (roles.Contains(Roles.PRACTITIONER) ? typeof(Practitioner) : null)));
            var isFranchisor = roles.Contains(Roles.FRANCHISOR);
            var isCoach = roles.Contains(Roles.COACH);
            var isPrincipal = roles.Contains(Roles.PRINCIPAL);
            var isPractitioner = roles.Contains(Roles.PRACTITIONER);
            //always retrieve immediate users hierarchy to list first
            hierarchyList.Add(this.GetUserHierarchy(userId));
            //switch (typeof(T))
            //{
            if (isFranchisor) {
                //retrieve all userarchy from franchisor to coach and principal and practitioner
                //case var cl when typeof(userObject) == typeof(Franchisor):
                //1st run coaches
                List<Coach> coachesF = coachRepo.GetAll().Where(c => c.FranchisorId.Equals(userId)).ToList();
                if (coachesF.Count > 0)
                {
                    foreach (var c in coachesF)
                    {
                        hierarchyList.Add(this.GetUserHierarchy(c.UserId));

                        //2nd run principal and practitioners where coachhierarchy is set - irrelevant whetther 
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
                //case var cl when typeof(T) == typeof(Coach):
                //1st run principal and practitioners where coachhierarchy is set - irrelevant whetther 
                List<Practitioner> coachPractitioners = practRepo.GetAll().Where(c => c.CoachHierarchy.HasValue).ToList();
                coachPractitioners = coachPractitioners.Where(c => c.CoachHierarchy.ToString() == userId).ToList();
                if (coachPractitioners.Count > 0)
                {
                    foreach (var p in coachPractitioners)
                    {
                        hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                    }
                }
            } else if (isPrincipal) {
                // case var cl when typeof(T) == typeof(Practitioner):
                //case var clA when typeof(T) == typeof(Principal):
                //1st run principal and practitioners where coachhierarchy is set - irrelevant whetther 
                List<Practitioner> principalPractitioners = practRepo.GetAll().Where(c => c.PrincipalHierarchy.Equals(userId)).ToList();
                if (principalPractitioners.Count > 0)
                {
                    foreach (var p in principalPractitioners)
                    {
                        hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                    }
                }
            }
            

            /*switch (typeof(T))
            {

                case var clsUT when typeof(IUserType).IsAssignableFrom(typeof(T)):
                    //repo = _provider.GetService<GenericUserTypeRepository<T>>();
                    hierarchyList.Add(this.GetUserHierarchy(userId));

                    break;
                case var clsES when typeof(IUserElevatedScoped).IsAssignableFrom(typeof(T)):
                    //repo = _provider.GetService<ElevatedScopedGenericRepository<T>>();
                    //case on type, and depending on type, iterate through different levels of collecting a list of hierarchies to use
                    var franchisorRepo = _repoFactory.CreateRepository<Franchisor>(userContext: requestingUser);
                    var coachRepo = _repoFactory.CreateRepository<Coach>(userContext: requestingUser);
                    var practRepo = _repoFactory.CreateRepository<Practitioner>(userContext: requestingUser);

                    //always retrieve immediate users hierarchy to list first
                    hierarchyList.Add(this.GetUserHierarchy(userId));

                    switch (typeof(T))
                    {
                        //retrieve all userarchy from franchisor to coach and principal and practitioner
                        case var cl when typeof(T) == typeof(Franchisor):
                            //1st run coaches
                            List<Coach> coachesF = coachRepo.GetAll().Where(c => c.FranchisorId.Equals(userId)).ToList();
                            if (coachesF.Count > 0)
                            {
                                foreach (var c in coachesF)
                                {
                                    hierarchyList.Add(this.GetUserHierarchy(c.UserId));

                                    //2nd run principal and practitioners where coachhierarchy is set - irrelevant whetther 
                                    List<Practitioner> franchisorsPractitioners = practRepo.GetAll().Where(p => p.CoachHierarchy.Equals(c.UserId)).ToList();
                                    if (franchisorsPractitioners.Count > 0)
                                    {
                                        foreach (var p in franchisorsPractitioners)
                                        {
                                            hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                                        }
                                    }
                                }
                            }
                            break;
                        case var cl when typeof(T) == typeof(Coach):
                            //1st run principal and practitioners where coachhierarchy is set - irrelevant whetther 
                            List<Practitioner> coachPractitioners = practRepo.GetAll().Where(p => p.CoachHierarchy.Equals(userId)).ToList();
                            if (coachPractitioners.Count > 0)
                            {
                                foreach (var p in coachPractitioners)
                                {
                                    hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                                }
                            }
                            break;
                        case var cl when typeof(T) == typeof(Principal):
                            //1st run principal and practitioners where coachhierarchy is set - irrelevant whetther 
                            List<Practitioner> principalPractitioners = practRepo.GetAll().Where(p => p.PrincipalHierarchy.Equals(userId)).ToList();
                            if (principalPractitioners.Count > 0)
                            {
                                foreach (var p in principalPractitioners)
                                {
                                    hierarchyList.Add(this.GetUserHierarchy(p.UserId));
                                }
                            }
                            break;
                    }
                    break;
                case var clGE when typeof(IUserScoped).IsAssignableFrom(typeof(T)):
                    //repo = _provider.GetService<ScopedGenericRepository<T>>();
                    hierarchyList.Add(this.GetUserHierarchy(userId));
                    break;
                default:
                    //repo = _provider.GetService<GenericRepository<T>>();
                    hierarchyList.Add(this.GetUserHierarchy(userId));
                    break;
            }*/

            return hierarchyList;
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
