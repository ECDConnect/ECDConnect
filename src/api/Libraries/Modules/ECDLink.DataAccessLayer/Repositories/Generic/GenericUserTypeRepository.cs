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
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class GenericUserTypeRepository<T> : GenericRepositoryBase<T>
     where T : EntityBase<Guid>
    {
        private readonly ApplicationUserManager _userManager;
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
          ApplicationUserManager userManager)
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


        public override IQueryable<T> GetAll(PagedQueryInput pagingInput = null)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            if (!_userId.HasValue)
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var user = _userManager.FindByIdAsync(_userId.ToString()).Result;
            var roles = _userManager.GetRolesAsync(user).Result;
            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);
            
            var query = entities.Where(e => e.TenantId == null || e.TenantId == tenantId).AsQueryable();

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
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value);
                    if (hh.Count > 0)
                    {
                        if (!hh.Contains(null)) //dont run any null values through teh check, nothing should be null
                        {
                            return query.Where(x => hh.Contains(((IUserType)x).Hierarchy));
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
            var record = base.GetById(id);

            var castRecord = record as IUserType;

            if (castRecord == default)
            {
                return default;
            }

            var user = _userManager.FindByIdAsync(castRecord.UserId.ToString()).Result;
            var roles = _userManager.GetRolesAsync(user).Result;

            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

            if (!isAdmin)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value);
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
            var record = base.GetById(id);

            var castRecord = record as IUserType;

            if (castRecord == default)
            {
                return default;
            }

            var user = await _userManager.FindByIdAsync(castRecord.UserId.ToString());
            var roles = await _userManager.GetRolesAsync(user);

            var isAdmin = roles.Contains(Roles.ADMINISTRATOR);

            if (!isAdmin)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value);
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
                var castRecord = record as IUserType;

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
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value);
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
                var castRecord = record as IUserType;

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
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_userManager, _userId.Value);
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
            var typedEntity = entity as IUserType;
            Guid tenantId = TenantExecutionContext.Tenant.Id;

            var hierarchyEntity = _hierarchyEngine.AddHierarchyEntity<T>(_userId.Value, typedEntity.UserId.Value);

            typedEntity.Hierarchy = HierarchyHelper.AppendHierarchy(Hierarchy, hierarchyEntity.Key.ToString());

            if (typedEntity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entity.TenantId = tenantId;
            // TODO: Global change to Utc.
            entity.InsertedDate = DateTime.Now;
            entities.Add(entity);

            context.SaveChanges();

            _domainEventService.NotifyCreate(_userId.ToString(), entity);

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
                // Notify update would get input values without this:
                entity.TenantId = dbEntity.TenantId;
                entity.InsertedDate = dbEntity.InsertedDate;

                ((IUserType)entity).Hierarchy = ((IUserType)dbEntity).Hierarchy;

                entity.UpdatedDate = DateTime.Now;

                context.Entry(dbEntity).CurrentValues.SetValues(entity);
                // Do not modify inserted date.
                entities.Entry(dbEntity).Property(e => e.InsertedDate).IsModified = false;
                // Do not modify TenantId.
                entities.Entry(dbEntity).Property(e => e.TenantId).IsModified = false;

                _domainEventService.NotifyUpdate<T>(_userId.ToString(), entity);
            }

            context.SaveChanges();

            return entity;
        }
    }
}
