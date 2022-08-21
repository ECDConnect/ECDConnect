using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.Security;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class ScopedGenericRepository<T> : GenericRepositoryBase<T>
      where T : EntityBase<Guid>
    {
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly UserManager<ApplicationUser> _userManager;
        private string Hierarchy
        {
            get
            {
                return _hierarchyEngine.GetUserHierarchy(_userId);
            }
        }

        public ScopedGenericRepository(
            AuthenticationDbContext context,
            UserManager<ApplicationUser> userManager,
            HierarchyEngine hierarchyEngine,
            IDomainEventService domainEventService)
          : base(context, domainEventService)
        {
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
        }

        public override IQueryable<T> GetAll()
        {
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var all = base.GetAll();

            //CB Added to bypass hierarchy
            var user = _userManager.FindByIdAsync(_userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            //if user is in a higher admin role (Principal, Practitioner, Coach, Franchisor, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            var higherRoles = new[] { Roles.PRACTITIONER, Roles.COACH, Roles.ADMINISTRATOR, Roles.PRINCIPAL, Roles.FRANCHISOR };//
            bool isHigherRole = higherRoles.Any(roles.Contains);

            if (isHigherRole)
            {
                return entities.AsQueryable();
            }
            else
            {

                var hierarchy = _hierarchyEngine.GetUserHierarchy(_userId);

                // Change this to an LTree at some point
                return entities
                  .Where(x => ((IUserScoped)x).Hierarchy.StartsWith(hierarchy))
                  .AsQueryable();
            }
        }

        public override T GetById(Guid id)
        {
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var record = base.GetById(id);

            var castRecord = record as IUserScoped;

            if (castRecord == default)
            {
                return default;
            }
            //if user is in a higher admin role (Principal, Practitioner, Coach, Franchisor, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            var user = _userManager.FindByIdAsync(_userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var higherRoles = new[] { Roles.PRACTITIONER, Roles.COACH, Roles.ADMINISTRATOR, Roles.PRINCIPAL, Roles.FRANCHISOR };//
            bool isHigherRole = higherRoles.Any(roles.Contains); //roles.contains(Roles.ADMINISTRATOR);
            if (!isHigherRole)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    if (!castRecord.Hierarchy.StartsWith(Hierarchy))
                    {
                        return default;
                    }
                }
            }

            return record;
        }

        public override T Insert(T entity)
        {
            ((IUserScoped)entity).Hierarchy = Hierarchy;

            return base.Insert(entity);
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
                ((IUserScoped)entity).Hierarchy = ((IUserScoped)dbEntity).Hierarchy;
                context.Entry(dbEntity).CurrentValues.SetValues(entity);
                _domainEventService.NotifyUpdate<T>(_userId, entity);
            }

            context.SaveChanges();

            return entity;
        }

        public override void Delete(Guid id)
        {
            T entity = GetById(id);

            entities.Remove(entity);
            context.SaveChanges();

            _domainEventService.NotifyDelete<T>(_userId, entity);
        }
    }
}
