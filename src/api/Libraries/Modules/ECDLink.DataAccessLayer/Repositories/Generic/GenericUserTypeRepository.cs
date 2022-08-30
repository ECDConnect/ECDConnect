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
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var all = base.GetAll();

            var user = _userManager.FindByIdAsync(_userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            //if user is in a higher admin role (Principal, Practitioner, Coach, Franchisor, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            //var higherRoles = new[] { Roles.PRACTITIONER, Roles.COACH, Roles.ADMINISTRATOR, Roles.PRINCIPAL, Roles.FRANCHISOR };//            
            //bool isHigherRole = higherRoles.Any(roles.Contains);
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
            //T userObject = roles.Contains(Roles.FRANCHISOR)?typeof(Franchisor):(roles.Contains(Roles.COACH)? typeof(Franchisor): (roles.Contains(Roles.PRINCIPAL)? typeof(Principal) : (roles.Contains(Roles.PRACTITIONER) ? typeof(Practitioner): null)));
            //var isFranchisor = roles.Contains(Roles.FRANCHISOR);
            //var isCoach = roles.Contains(Roles.COACH);
            //var isPrincipal = roles.Contains(Roles.PRINCIPAL);
            //var isPractitioner = roles.Contains(Roles.PRACTITIONER);
            //var excludingEntities = new[] { typeof(Practitioner), typeof(Principal), typeof(Coach), typeof(Franchisor), typeof(Classroom), typeof(ClassroomGroup), typeof(Child), typeof(Programme) };//remove teh last three for normal functionlity
            //bool isExcluded = excludingEntities.Contains(typeof(T));
            List<T> queryList = new List<T>();
            
            //var query = entities.AsQueryable();
            //var returnQuery = entities.AsQueryable();
            if (isAdmin)
            {
                var query = entities.AsQueryable();
                return query;
            }
            else
            {
                //if (isExcluded && isHigherRole)
                //{
                //    return query;
                //} else {                 
                //var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);

                //return query.Where(x => ((IUserType)x).Hierarchy.StartsWith(hierarchy));
                var hh = _hierarchyEngine.GetHierarchyByParentList(_userManager, _userId, _userId);

                foreach (var h in hh)
                {                    
                    queryList.AddRange(entities.AsQueryable().Where(x => ((IUserType)x).Hierarchy.StartsWith(h)));                    
                }
                return queryList.AsQueryable();
                //}
            }

            // Change this to an LTree at some point            
        }

        public override T GetById(Guid id)
        {
            var record = base.GetById(id);

            var castRecord = record as IUserType;

            if (castRecord == default)
            {
                return default;
            }

            //if user is in a higher admin role (Principal, Practitioner, Coach, Franchisor, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            var user = _userManager.FindByIdAsync(castRecord.UserId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var higherRoles = new[] { Roles.PRACTITIONER, Roles.COACH, Roles.ADMINISTRATOR, Roles.PRINCIPAL, Roles.FRANCHISOR };//
            bool isHigherRole = higherRoles.Any(roles.Contains);

            if (!isHigherRole)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);
                    if (!castRecord.Hierarchy.StartsWith(hierarchy))
                    {
                        return default;
                    }
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

                var record = base.GetAll().Where(s => s.GetType().GetProperty("UserId").GetValue(s, null).Equals(id));

                var castRecord = record as IUserType;

                if (castRecord == default)
                {
                    return default;
                }

                //if user is in a higher admin role (Principal, Practitioner, Coach, Franchisor, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
                var user = _userManager.FindByIdAsync(castRecord.UserId).Result;
                var roles = _userManager.GetRolesAsync(user).Result;
                var higherRoles = new[] { Roles.PRACTITIONER, Roles.COACH, Roles.ADMINISTRATOR, Roles.PRINCIPAL, Roles.FRANCHISOR };//
                bool isHigherRole = higherRoles.Any(roles.Contains);

                if (!isHigherRole)
                {
                    if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                    {
                        var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);
                        if (!castRecord.Hierarchy.StartsWith(hierarchy))
                        {
                            return default;
                        }
                    }
                }

                return (T)record;
            } else return this.GetById(Guid.Parse(id));//default to getting just by id
        }

        public override T Insert(T entity)
        {
            var typedEntity = entity as IUserType;

            var hierarchyEntity = _hierarchyEngine.AddHierarchyEntity<T>(_userId, typedEntity.UserId);

            typedEntity.Hierarchy = HierarchyHelper.AppendHierarchy(Hierarchy, hierarchyEntity.Key.ToString());

            if (typedEntity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entities.Add(entity);

            context.SaveChanges();

            _domainEventService.NotifyCreate(_userId, entity);

            return entity;
        }

        public override T Update(T entity)
        {
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
                ((IUserType)entity).Hierarchy = ((IUserType)dbEntity).Hierarchy;
                context.Entry(dbEntity).CurrentValues.SetValues(entity);
                _domainEventService.NotifyUpdate<T>(_userId, entity);
            }

            context.SaveChanges();

            return entity;
        }
    }
}
