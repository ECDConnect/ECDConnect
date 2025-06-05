using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security;
using ECDLink.Tenancy.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class ScopedGenericRepository<T> : GenericRepositoryBase<T>
      where T : EntityBase<Guid>
    {
        private readonly HierarchyEngine _hierarchyEngine;
        private readonly ApplicationUserManager _userManager;

        private string Hierarchy
        {
            get
            {
                return _hierarchyEngine.GetUserHierarchy(_userId);
            }
        }

        public ScopedGenericRepository(
            AuthenticationDbContext context,
            ApplicationUserManager userManager,
            HierarchyEngine hierarchyEngine,
            IDomainEventService domainEventService,
            IHttpContextAccessor contextAccessor)
          : base(context, domainEventService)
        {
            _hierarchyEngine = hierarchyEngine;
            _userManager = userManager;
        }

        public override IQueryable<T> GetAll(PagedQueryInput pagingInput = null)
        {
            if (!_userId.HasValue)
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var query = entities.AsQueryable();
            var user = _userManager.FindByIdAsync(_userId.ToString()).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

            if (pagingInput is not null)
            {
                query = PaginationHelper.AddFiltering(pagingInput?.FilterBy, query);
                
                if (pagingInput.PageSize is not null)
                    query = PaginationHelper.AddPaging(pagingInput?.RowOffset ?? 0, pagingInput?.PageSize ?? 10, query);
            }

            if (isAdmin)
            {
                
                return query;
            }
            else
            {
                try
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value).ToList();
                    if (hh.Count > 0)
                    {
                        if (!hh.Contains(null)) //dont run any null values through teh check, nothing should be null
                        {
                            return query.Where(x => hh.Contains(((IUserScoped)x).Hierarchy));
                        }
                    }
                }
                catch (Exception)
                {
                    return null;
                }
            }

            return query.Take(0);
        }

        public override T GetById(Guid id)
        {
            if (!_userId.HasValue)
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var record = base.GetById(id);

            var castRecord = record as IUserScoped;

            if (castRecord == default)
            {
                return default;
            }

            //if user is in a higher admin role (Principal, Practitioner, Coach, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            var user = _userManager.FindByIdAsync(_userId.ToString()).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
            if (!isAdmin)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value).ToList();
                    if (hh != null)
                    {
                        if (!hh.Contains(castRecord.Hierarchy))
                        {
                            return default;
                        }
                    }
                }
            }

            return record;
        }

        public async override Task<T> GetByIdAsync(Guid id)
        {
            if (!_userId.HasValue)
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var record = await base.GetByIdAsync(id);

            var castRecord = record as IUserScoped;

            if (castRecord == default)
            {
                return default;
            }

            //if user is in a higher admin role (Principal, Practitioner, Coach, then skip the check as they need to be able to see anyone anywhere due to the shift in roles of Milestone 1.
            var user = await _userManager.FindByIdAsync(_userId.ToString());
            var roles = await _userManager.GetRolesAsync(user);
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
            if (!isAdmin)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value).ToList();
                    if (hh != null)
                    {
                        if (!hh.Contains(castRecord.Hierarchy))
                        {
                            return default;
                        }
                    }
                }
            }

            return record;
        }

        public override T GetByUserId(string id)
        {
            if (!_userId.HasValue)
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            Type type = typeof(T);
            if (type.GetProperty("UserId") != null && !string.IsNullOrEmpty(id))
            {

                var record = base.GetByUserId(id);

                var castRecord = record as IUserScoped;

                if (castRecord == default)
                {
                    return default;
                }

                //hierarchy confirmation allowing this to be viewed
                var user = _userManager.FindByIdAsync(_userId.ToString()).Result;
                var roles = _userManager.GetRolesAsync(user).Result;
                var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
                if (!isAdmin)
                {
                    try
                    {
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value).ToList();
                        if (hh != null)
                        {
                            if (!hh.Contains(castRecord.Hierarchy))
                            {
                                return default;
                            }
                        }
                    }
                    catch (Exception)
                    {
                        return null;
                    }

                }
                return (T)record;
            }
            return null;
        }

        public override List<T> GetListByUserId(string id)
        {
            if (!_userId.HasValue)
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            Type type = typeof(T);
            if (type.GetProperty("UserId") != null && !string.IsNullOrEmpty(id))
            {

                var record = base.GetListByUserId(id);

                var castRecord = record as IUserScoped;

                if (castRecord == default)
                {
                    return default;
                }

                //hierarchy confirmation allowing this to be viewed
                var user = _userManager.FindByIdAsync(_userId.ToString()).Result;
                var roles = _userManager.GetRolesAsync(user).Result;
                var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
                if (!isAdmin)
                {
                    try
                    {
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value).ToList();
                        if (hh != null)
                        {
                            if (!hh.Contains(castRecord.Hierarchy))
                            {
                                return default;
                            }
                        }
                    }
                    catch (Exception)
                    {
                        return null;
                    }

                }
                return (List<T>)record;
            }
            return null;
        }


        public override T Insert(T entity)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            ((IUserScoped)entity).Hierarchy = Hierarchy;
            entity.TenantId = tenantId;
            // TODO: Global change to Utc.
            entity.InsertedDate = DateTime.Now;

            return base.Insert(entity);
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
                // Notify update would get input values without this:
                entity.TenantId = dbEntity.TenantId;
                entity.InsertedDate = dbEntity.InsertedDate;

                ((IUserScoped)entity).Hierarchy = ((IUserScoped)dbEntity).Hierarchy;
                context.Entry(dbEntity).CurrentValues.SetValues(entity);

                // Do not update Inserted Date:
                context.Entry(dbEntity).Property(e => e.InsertedDate).IsModified = false;
                // Do not allow replacing or changing TenantId.
                context.Entry(dbEntity).Property(e => e.TenantId).IsModified = false;

                _domainEventService.NotifyUpdate<T>(_userId.ToString(), entity);
                
                entity.UpdatedDate = DateTime.Now;
            }
            entity.UpdatedBy = _userId.ToString();

            context.SaveChanges();

            return entity;
        }

        public override void Delete(Guid id)
        {
            T entity = GetById(id);

            entities.Remove(entity);
            context.SaveChanges();

            _domainEventService.NotifyDelete<T>(_userId.ToString(), entity);
        }
    }
}
