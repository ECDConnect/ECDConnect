using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Events;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories.Generic.Base
{
    public class GenericRepositoryBase<T> : IGenericRepository<T, Guid>
        where T : EntityBase<Guid>
    {
        protected AuthenticationDbContext context;
        protected readonly Guid contextId = Guid.NewGuid();
        protected readonly IDomainEventService _domainEventService;
        private readonly ILogger<GenericRepositoryBase<T>> _logger;
        protected DbSet<T> entities;

        protected string _userId;
        protected string errorMessage = string.Empty;

        public GenericRepositoryBase(IDomainEventService domainEventService, IDbContextFactory<AuthenticationDbContext> authDbContextFactory, ILogger<GenericRepositoryBase<T>> logger)
        {
            _logger = logger; 
            context = authDbContextFactory.CreateDbContext();
            _logger.LogDebug("Context created: {contextId}", contextId);

            SetCustomScope(context);
            
            _domainEventService = domainEventService;
        }

        public virtual void SetUserContext(string user)
        {
            _userId = user;
        }

        public virtual IQueryable<T> GetAll()
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return entities.Where(e => e.TenantId == null || e.TenantId.Equals(tenantId)).AsQueryable();
        }

        public virtual T GetById(Guid id)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return entities.Where(e => e.TenantId.Equals(tenantId)).SingleOrDefault(s => s.Id == id);
        }

        public async virtual Task<T> GetByIdAsync(Guid id)
        {
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            return await entities.Where(e => e.TenantId.Equals(tenantId)).SingleOrDefaultAsync(s => s.Id == id);
        }

        public virtual T GetByUserId(string id)
        {
            Type type = typeof(T);
            if (type.GetProperty("UserId") != null)
            {
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                var qq = entities.FromSqlRaw("SELECT * FROM \"" + type.Name + "\" WHERE \"UserId\" = '" + id + "' AND \"TenantId\" = '" + tenantId + "'").FirstOrDefault();
                return qq;
            }
            else return default;
        }

        public virtual List<T> GetListByUserId(string id)
        {
            Type type = typeof(T);
            if (type.GetProperty("UserId") != null)
            {
                Guid tenantId = TenantExecutionContext.Tenant.Id;
                var qq = entities.FromSqlRaw("SELECT * FROM \"" + type.Name + "\" WHERE \"UserId\" = '" + id + "' AND \"TenantId\" = '" + tenantId + "'").ToList();////.OrderByDescending(y => y.InsertedDate);
                return qq;
            }
            else return default;
        }

        public virtual T Insert(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            Guid tenantId = TenantExecutionContext.Tenant.Id;
            if (entity.Id == default(Guid))
            {
                entity.Id = Guid.NewGuid();
            }
            entity.TenantId = tenantId;
            // TODO: Global change to Utc.
            entity.InsertedDate = DateTime.Now;

            entities.Add(entity);
            context.SaveChanges();

            _domainEventService.NotifyCreate<T>(_userId, entity);
            return entity;
        }

        public virtual T Update(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            if (Exists(entity.Id))
            {
                // TODO: Global change to Utc.
                entity.UpdatedDate = DateTime.Now;
                entity.UpdatedBy = _userId;
                // Notify update would get input values without this:
                entity.TenantId = entities.Entry(entity).Property(e => e.TenantId).OriginalValue;
                entity.InsertedDate = entities.Entry(entity).Property(e => e.InsertedDate).OriginalValue;

                entities.Update(entity);
                // Do not update Inserted Date:
                entities.Entry(entity).Property(e => e.InsertedDate).IsModified = false;
                // Do not allow replacing or changing TenantId.
                entities.Entry(entity).Property(e => e.TenantId).IsModified = false;
                
                // Publish notification with correct data.
                _domainEventService.NotifyUpdate<T>(_userId, entity);
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
            Guid tenantId = TenantExecutionContext.Tenant.Id;
            T entity = entities.Where(e => e.TenantId == tenantId).SingleOrDefault(s => s.Id == id);
            entity.IsActive = false;
            // TODO: Global change to Utc.
            entity.UpdatedDate = DateTime.Now;
            entity.UpdatedBy = _userId;
            entities.Update(entity);
            context.SaveChanges(true);
            _domainEventService.NotifyUpdate<T>(_userId, entity);

        }

        public virtual bool Exists(Guid id)
        {
            if (id == default(Guid))
            {
                return false;
            }

            return entities.Any(s => s.Id == id);
        }

        public bool dbCreated()
        {
            return context.Database.GetService<IRelationalDatabaseCreator>().Exists();
        }

        public virtual void SetCustomScope<context>(context dbContext)
        {
            var scopedContext = dbContext as AuthenticationDbContext;
            this.context = scopedContext;
            entities = scopedContext.Set<T>();
        }

        public void Dispose()
        {
            _logger.LogDebug("Disposing context: {contextId}", contextId);
            this.context.Dispose();
            this.context = null;
            entities = null;
        }
    }
}
