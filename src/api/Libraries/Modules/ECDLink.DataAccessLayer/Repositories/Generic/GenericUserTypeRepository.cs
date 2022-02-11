using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
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
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

            var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);

            var query = entities.AsQueryable();

            if (isAdmin)
            {
                return query;
            }
            else
            {
                return query.Where(x => ((IUserType)x).Hierarchy.StartsWith(hierarchy));

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

            if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
            {
                var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);

                if (!castRecord.Hierarchy.StartsWith(hierarchy))
                {
                    return default;
                }
            }

            return record;
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
