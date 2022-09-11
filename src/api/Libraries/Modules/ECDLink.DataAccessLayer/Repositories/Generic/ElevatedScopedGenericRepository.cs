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
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Classroom;
using System.Collections.Generic;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class ElevatedScopedGenericRepository<T> : GenericRepositoryBase<T>
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

        public ElevatedScopedGenericRepository(
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
            var user = _userManager.FindByIdAsync(_userId).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

            var query = entities.AsQueryable();
            if (isAdmin) 
            {
                return query;
            }
            else
            {
                var hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId);
                if (hh != null)
                {
                    var ll1 = entities.AsQueryable().Where(x => ((IUserScoped)x).Hierarchy.StartsWith(hh[0]));
                    foreach (var h in hh)
                    {

                        var ll = entities.AsQueryable().Where(x => ((IUserScoped)x).Hierarchy.StartsWith(h));
                        if (ll.AsQueryable().Count() > 0)
                        {
                            if (ll1.Count() == 0)
                            {
                                ll1 = ll.AsQueryable();
                            }
                            if (ll.Count() > 0 && ll1.Count() > 0)
                            {
                                ll1.Concat(ll).AsQueryable();
                            }
                        }

                    }
                    return ll1;
                }
            }
            return query.Take(0);//if neither of these are true, rather return nothing that all

        }

        public override T GetById(Guid id)
        {
            //TODO CB: build userhierarchy permissions list in to GetById
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
        //TODO CB: build userhierarchy permissions list in to GetById
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
            else return null;//default to getting just by id
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
