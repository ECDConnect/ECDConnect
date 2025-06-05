using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories.Generic.Base
{
    public class GenericRepositoryBase<T> : IGenericRepository<T, Guid>
        where T : EntityBase<Guid>
    {
        protected AuthenticationDbContext context;
        protected readonly IDomainEventService _domainEventService;

        protected DbSet<T> entities;

        protected Guid? _userId;
        protected string errorMessage = string.Empty;
        private Guid _tenantId;

        public GenericRepositoryBase(AuthenticationDbContext context, IDomainEventService domainEventService)
        {
            SetCustomScope(context);

            _domainEventService = domainEventService;
            _tenantId = TenantExecutionContext.Tenant.Id;
        }

        public virtual void SetUserContext(string user)
        {
            _userId = string.IsNullOrEmpty(user) ? null : Guid.Parse(user);
        }

         public virtual void SetTenantContext(Guid? tenant)
        {
            _tenantId = (Guid)tenant;
        }

        public virtual void SetUserContext(Guid? user)
        {
            _userId = user;
        }

        public virtual IQueryable<T> GetAll(PagedQueryInput pagingInput = null)
        {
            var queryable = entities.Where(e => e.TenantId == null || e.TenantId == _tenantId).AsQueryable();

            if (pagingInput is not null)
            {
                queryable = PaginationHelper.AddFiltering(pagingInput?.FilterBy, queryable);

                if (pagingInput.PageSize is not null)
                    queryable = PaginationHelper.AddPaging(pagingInput?.RowOffset ?? 0, pagingInput?.PageSize ?? 10, queryable);
            }

            return queryable;
        }

        public virtual int Count(PagedQueryInput pagingInput = null)
        {
            var queryable = entities.Where(e => e.TenantId == null || e.TenantId == _tenantId).AsQueryable();

            if (pagingInput is not null)
            {
                queryable = PaginationHelper.AddFiltering(pagingInput?.FilterBy, queryable);
            }

            return queryable.Count();
        }

        public virtual T GetById(Guid id)
        {
            return entities.Where(e => e.TenantId == _tenantId).SingleOrDefault(s => s.Id == id);
        }

        public async virtual Task<T> GetByIdAsync(Guid id)
        {
            return await entities.Where(e => e.TenantId == _tenantId).SingleOrDefaultAsync(s => s.Id == id);
        }

        public virtual T GetByUserId(string id)
        {
            Type type = typeof(T);
            if (type.GetProperty("UserId") != null && !string.IsNullOrEmpty(id))
            {
                var qq = entities.FromSqlRaw("SELECT * FROM \"" + type.Name + "\" WHERE \"UserId\" = '" + id + "' AND \"TenantId\" = '" + _tenantId + "'").FirstOrDefault();
                return qq;
            }
            else return default;
        }

        public virtual T GetByUserId(Guid id)
        {
            Type type = typeof(T);
            if (type.GetProperty("UserId") != null)
            {
                var qq = entities.FromSqlRaw("SELECT * FROM \"" + type.Name + "\" WHERE \"UserId\" = '" + id + "' AND \"TenantId\" = '" + _tenantId + "'").FirstOrDefault();
                return qq;
            }
            else return default;
        }

        public virtual List<T> GetListByUserId(string id)
        {
            Type type = typeof(T);
            if (type.GetProperty("UserId") != null && !string.IsNullOrEmpty(id))
            {
                var qq = entities.FromSqlRaw("SELECT * FROM \"" + type.Name + "\" WHERE \"UserId\" = '" + id + "' AND \"TenantId\" = '" + _tenantId + "'").ToList();////.OrderByDescending(y => y.InsertedDate);
                return qq;
            }
            else return default;
        }

        public virtual List<T> GetListByUserId(Guid id)
        {
            Type type = typeof(T);
            if (type.GetProperty("UserId") != null)
            {
                var qq = entities.FromSqlRaw("SELECT * FROM \"" + type.Name + "\" WHERE \"UserId\" = '" + id + "' AND \"TenantId\" = '" + _tenantId + "'").ToList();////.OrderByDescending(y => y.InsertedDate);
                return qq;
            }
            else return default;
        }

        public virtual T Insert(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            if (entity.Id == default(Guid))
            {
                entity.Id = Guid.NewGuid();
            }
            entity.TenantId = _tenantId;
            // TODO: Global change to Utc.
            entity.InsertedDate = DateTime.Now;
            if (string.IsNullOrEmpty(entity.UpdatedBy) && _userId.HasValue && _userId.Value != Guid.Empty)
                entity.UpdatedBy = _userId.Value.ToString();

            entities.Add(entity);
            context.SaveChanges();

            _domainEventService.NotifyCreate<T>(_userId?.ToString(), entity);

            return entity;
        }

        public virtual IEnumerable<T> InsertMany(IEnumerable<T> entityList)
        {
            if (entityList == null || !entityList.Any())
                return entityList;

            foreach (var entity in entityList)
            {
                entity.Id = entity.Id == default ? Guid.NewGuid() : entity.Id;
                entity.TenantId = _tenantId;
                // TODO: Global change to Utc.
                entity.InsertedDate = DateTime.Now;
            }

            entities.AddRange(entityList);
            context.SaveChanges();

            _domainEventService.NotifyCreate(_userId?.ToString(), entityList);

            return entityList;
        }

        public virtual T Update(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            if (Exists(entity.Id))
            {
                entity.UpdatedBy = _userId?.ToString();

                // Notify update would get input values without this:
                entity.TenantId = entities.Entry(entity).Property(e => e.TenantId).OriginalValue;
                entity.InsertedDate = entities.Entry(entity).Property(e => e.InsertedDate).OriginalValue;
                
                entity.UpdatedDate = DateTime.Now;
                
                entities.Update(entity);
                // Do not update Inserted Date:
                entities.Entry(entity).Property(e => e.InsertedDate).IsModified = false;
                // Do not allow replacing or changing TenantId.
                entities.Entry(entity).Property(e => e.TenantId).IsModified = false;

                // Publish notification with correct data.
                _domainEventService.NotifyUpdate<T>(_userId?.ToString(), entity);
            }
            else
            {
                Insert(entity);
            }


            context.SaveChanges();

            return entity;
        }

        public virtual void Delete(Guid id)
        {            
            T entity = entities.Where(e => e.TenantId == _tenantId).SingleOrDefault(s => s.Id == id);
            entity.IsActive = false;
            // TODO: Global change to Utc.
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = _userId?.ToString();
            entities.Update(entity);
            context.SaveChanges(true);
            _domainEventService.NotifyUpdate<T>(_userId?.ToString(), entity);         
        }

        public virtual bool Exists(Guid id)
        {
            if (id == default(Guid))
            {
                return false;
            }

            return entities.Any(s => s.Id == id);
        }

        public virtual T Retrieve(Guid id)
        {
            if (id == default(Guid))
            {
                return null;
            }

            return entities.FirstOrDefault(s => s.Id == id);
        }

        public bool dbCreated()
        {
            return context.Database.GetService<IRelationalDatabaseCreator>().Exists();
        }

        public virtual void SetCustomScope<Context>(Context dbContext)
        {
            var scopedContext = dbContext as AuthenticationDbContext;
            this.context = scopedContext;
            entities = scopedContext.Set<T>();
        }

        public void Dispose()
        {
            this.context = null;
            entities = null;
        }
    }
}
