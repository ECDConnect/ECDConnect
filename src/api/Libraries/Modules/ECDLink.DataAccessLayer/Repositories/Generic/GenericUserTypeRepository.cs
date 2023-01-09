using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Hierarchy;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using ECDLink.Tenancy.Context;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using ECDLink.Security.Extensions;

namespace ECDLink.DataAccessLayer.Repositories.Generic
{
    public class GenericUserTypeRepository<T> : GenericRepositoryBase<T>
     where T : EntityBase<Guid>
    {
        private readonly HttpContext _httpContext;
        private readonly HierarchyEngine _hierarchyEngine;

        private string Hierarchy
        {
            get
            {
                return _hierarchyEngine.GetUserHierarchy(_userId);
            }
        }
        // TODO: HTTPContext to be removed when HotChocolate.Data.EntityFramework 12.16.0 can be used.
        public GenericUserTypeRepository(
          AuthenticationDbContext context,
          HierarchyEngine hierarchyEngine,
          IDomainEventService domainEventService,
          [Service] IHttpContextAccessor contextAccessor)
          : base(context, domainEventService)
        {
            _hierarchyEngine = hierarchyEngine;
            _httpContext = contextAccessor.HttpContext ?? throw new ArgumentNullException("No HttpContextAccessor supplied.");
        }

        public override void Delete(Guid id)
        {
            T entity = GetById(id);

            if (entity == default)
            {
                return;
            }

            entity.IsActive = false;
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = _userId;

            context.SaveChanges();

            _hierarchyEngine.RemoveHierarchy(((IUserType)entity).UserId);
        }


        public override IQueryable<T> GetAll()
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            var query = entities.Where(e => e.TenantId == null || e.TenantId.Equals(tenantId)).AsQueryable();//.Where(e => e.TenantId.Equals(tenantId))
            var isAdmin = _httpContext.IsAdmin();
            if (isAdmin)
            {
                return query.OrderByDescending(x => x.InsertedDate);
            }
            else
            {
                try { 
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_httpContext, _userId);
                    if (hh.Count>0)
                    {
                        if (!hh.Contains(null)) //dont run any null values through teh check, nothing should be null
                        {
                            return query.Where(x => hh.Contains(((IUserType)x).Hierarchy)).OrderByDescending(y => y.InsertedDate);
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
            var record = base.GetById(id);

            var castRecord = record as IUserType;

            if (castRecord == default)
            {
                return default;
            }
            
            var isAdmin = _httpContext.IsAdmin();
            if (!isAdmin)
            {
                if (!string.IsNullOrWhiteSpace(castRecord.Hierarchy))
                {
                    List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_httpContext, _userId);
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
                var isAdmin = _httpContext.IsAdmin();
                if (!isAdmin)
                {
                    try
                    {
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_httpContext, _userId);
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
        public override List<T> GetListByUserId(string id)
        {
            if (string.IsNullOrEmpty(_userId))
            {
                throw new UnauthorizedAccessException("User does not have access to this data");
            }

            Type type = typeof(T);
            if (type.GetProperty("UserId") != null)
            {

                var record = base.GetListByUserId(id);
                var castRecord = record as IUserType;

                if (castRecord == default)
                {
                    return default;
                }

                //hierarchy confirmation allowing this to be viewed
                var isAdmin = _httpContext.IsAdmin();
                if (!isAdmin)
                {
                    try
                    {
                        List<string> hh = _hierarchyEngine.GetHierarchyByParentList<T>(_httpContext, _userId);
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
                return (List<T>)record;
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
