using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.Core.Extensions;
using Microsoft.Extensions.Azure;
using ECDLink.Tenancy.Context;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class GenericUserTypeRepository<T> : GenericRepositoryBase<T>
     where T : EntityBase<Guid>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly HierarchyEngine _hierarchyEngine;

        private string Hierarchy
        {
            get
            {
                return _hierarchyEngine.GetUserHierarchy(_userId);
            }
        }

        public GenericUserTypeRepository(
          AuthenticationDbContext context,
          HierarchyEngine hierarchyEngine,
          IDomainEventService domainEventService,
          UserManager<ApplicationUser> userManager)
          : base(context, domainEventService)
        {
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
        }

        public override void Delete(Guid id)
        {
            T entity = GetById(id);

            if (entity == default)
            {
                return;
            }

            entity.IsActive = false;

            context.SaveChanges();

            _hierarchyEngine.RemoveHierarchy(((IUserType)entity).UserId);
        }

        private void processUserRemoval(string userId)
        {
            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == default(ApplicationUser))
            {
                return;
            }

            ApplicationUserHelper.AnonymizeUser(user);

            var updateResult = _userManager.UpdateAsync(user).Result;

            if (!updateResult.Succeeded)
            {
                throw new Exception("Unable to anonymise user");
            }

            // Remove all roles from user
            var roles = _userManager.GetRolesAsync(user).Result;

            var removeRolesResult = _userManager.RemoveFromRolesAsync(user, roles).Result;

            if (!removeRolesResult.Succeeded)
            {
                //TODO: Add logging here if roles cannot be removed
            }
        }

        public override IQueryable<T> GetAll()
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var user = _userManager.FindByIdAsync(_userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
            
            var query = entities.AsQueryable();//.Where(e => e.TenantId.Equals(tenantId))
            if (isAdmin)
            {
                return query;
            }
            else
            {
                try { 
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId);
                    if (hh.Count>0)
                    {
                        if (!hh.Contains(null)) //dont run any null values through teh check, nothing should be null
                        {
                            return query.Where(x => hh.Contains(((IUserType)x).Hierarchy));
                        }
                    }
                }
                catch (Exception e)
                {
                    return null;
                }
            }
            return query.Take(0);
        }

        public override T GetById(Guid id)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            var record = base.GetById(id);

            var castRecord = record as IUserType;

            if (castRecord == default)
            {
                return default;
            }

            //if user is in a higher admin role (Principal, Practitioner, Coach, Franchisor, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            var user = _userManager.FindByIdAsync(castRecord.UserId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            //var higherRoles = new[] { Roles.PRACTITIONER, Roles.COACH, Roles.ADMINISTRATOR, Roles.PRINCIPAL, Roles.FRANCHISOR };//
            //bool isHigherRole = higherRoles.Any(roles.Contains);

            ///if (!isHigherRole)
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

            if (!isAdmin)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId);
                    if (hh != null)
                    {
                        if (!hh.Contains(castRecord.Hierarchy))
                        {
                            return default;
                        }
                    }

                    //var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);
                    //if (!castRecord.Hierarchy.StartsWith(hierarchy))
                    //{
                    //    return default;
                    //}
                }
            }

            return record;
        }

        public override T GetByUserId(string id)
        {
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            Type type = typeof(T);
            if (type.GetProperty("UserId") != null)
            {
                
                var record = base.GetByUserId(id);
                var castRecord = record as IUserType;

                if (castRecord == default)
                {
                    return default;
                }

                //hierarchy confirmation allowing this to be viewed
                var user = _userManager.FindByIdAsync(_userId).Result;
                var roles = _userManager.GetRolesAsync(user).Result;
                var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

                if (!isAdmin)
                {
                    try
                    {
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId);
                        if (hh != null)
                        {
                            if (!hh.Contains(castRecord.Hierarchy))
                            {
                                return default;
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        return null;
                    }

                }
                return (T)record;
            }
            return null;
        }

        public override T Insert(T entity)
        {
            var typedEntity = entity as IUserType;
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var hierarchyEntity = _hierarchyEngine.AddHierarchyEntity<T>(_userId, typedEntity.UserId);

            typedEntity.Hierarchy = HierarchyHelper.AppendHierarchy(Hierarchy, hierarchyEntity.Key.ToString());

            if (typedEntity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entity.TenantId = tenantId; 
            entities.Add(entity);

            context.SaveChanges();

            _domainEventService.NotifyCreate(_userId, entity);

            return entity;
        }

        public override T Update(T entity)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            var dbEntity = GetById(entity.Id);

            if (dbEntity == default(T))
            {
                Insert(entity);
            }
            else
            {
                entity.TenantId = tenantId;
                ((IUserType)entity).Hierarchy = ((IUserType)dbEntity).Hierarchy;
                context.Entry(dbEntity).CurrentValues.SetValues(entity);
                _domainEventService.NotifyUpdate<T>(_userId, entity);
            }

            context.SaveChanges();

            return entity;
        }
    }
}
