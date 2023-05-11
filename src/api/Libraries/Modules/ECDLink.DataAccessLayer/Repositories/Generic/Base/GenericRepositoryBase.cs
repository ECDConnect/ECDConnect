using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
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
        protected readonly IDomainEventService _domainEventService;

        protected DbSet<T> entities;

        protected string _userId;
        protected string errorMessage = string.Empty;

        public GenericRepositoryBase(AuthenticationDbContext context, IDomainEventService domainEventService)
        {
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

            //Populate Audit records
            if (typeof(ITrackableType).IsAssignableFrom(typeof(T)))
                DoAudit(entity, "Insert");

            return entity;
        }

        public virtual T Update(T entity)

        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            //T oneMoreCheck = GetById(entity.Id);
            //T onemoreprecheck = entities.Find(entity.Id);

            Guid tenantId = TenantExecutionContext.Tenant.Id;

            if (Exists(entity.Id))
            {
                T beforeUpdate = Retrieve(entity.Id);

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

                //Populate Audit records
                if (typeof(ITrackableType).IsAssignableFrom(typeof(T)))
                {
                   if (DoAudit(entity, "Update", beforeUpdate))
                    {
                        if (entity.UpdatedDate == default(DateTime)) { entity.UpdatedDate = DateTime.Now; }
                        entity.UpdatedDate = DateTime.Now;
                    }
                } else
                {
                    entity.UpdatedDate = DateTime.Now;
                }

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

            //Populate Audit records
            if (typeof(ITrackableType).IsAssignableFrom(typeof(T)))
            DoAudit(entity, "Delete");

        }

        public virtual bool DoAudit(T entity, string changeType = "Update", T beforeObj = null)
        {
            bool isValidChange = false;
            GenericRepositoryBase<IntegrationAudit> auditInsertRepo = new GenericRepositoryBase<IntegrationAudit>(context, _domainEventService);
            Type tA = typeof(T);
            //Populate Audit records
            switch (changeType)
            {
                case "Delete":
                    auditInsertRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = changeType,
                        Entity = tA.Name,
                        Property = "IsActive",
                        ValueAfter = "false",
                        ValueBefore = "true",
                        UserId = _userId,
                        RelatedId = entity.Id.ToString()
                    });
                    isValidChange = true;
                    break;
                case "Insert":
                    auditInsertRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = changeType,
                        Entity = tA.Name,
                        UserId = _userId,
                        RelatedId = entity.Id.ToString()
                    });
                    isValidChange= true;
                    break;
                default:
                    List<IntegrationAudit> changesList = new List<IntegrationAudit>();
                    foreach (var prop in tA.GetProperties())
                    {
                        Type propType = prop.PropertyType;
                        if (propType.IsPrimitive || (propType == typeof(string)) || (propType == typeof(System.Guid)) || propType.IsValueType && prop.Name != "UpdatedDate") //ignore navigation types due to lazyloading And do not flag UpdatedDate as Valid change
                        {
                            //Determine changes and convert all to string
                            string beforeValue = entities.Entry(beforeObj).Property(prop.Name).OriginalValue != null ? entities.Entry(beforeObj).Property(prop.Name).OriginalValue.ToString() :  "";
                            string afterValue = prop.GetValue(entity, null) != null ? prop.GetValue(entity, null).ToString() : "";

                            if (beforeValue != afterValue)
                            {
                                changesList.Add(new IntegrationAudit()
                                {
                                    ChangeType = changeType,
                                    Entity = tA.Name,
                                    Property = prop.Name,
                                    ValueBefore = beforeValue,
                                    ValueAfter = afterValue,
                                    UserId = _userId,
                                    RelatedId = entity.Id.ToString()
                                });
                                isValidChange = true;
                            }
                        }
                    }

                    foreach (var auditItem in changesList)
                    {
                        auditInsertRepo.Insert(auditItem);
                    }
                    break;
            }
            return isValidChange;
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

        public virtual void SetCustomScope<context>(context dbContext)
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
