using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Events;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.Tenancy.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using NPOI.POIFS.FileSystem;
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
        private Guid _tenantId;

        public GenericRepositoryBase(AuthenticationDbContext context, IDomainEventService domainEventService)
        {
            SetCustomScope(context);

            _domainEventService = domainEventService;
            _tenantId = TenantExecutionContext.Tenant.Id;
        }

        public virtual void SetUserContext(string user)
        {
            _userId = user;
        }

        public virtual IQueryable<T> GetAll(PagedQueryInput pagingInput = null)
        {
            var queryable = entities.Where(e => e.TenantId == null || e.TenantId.Equals(_tenantId)).AsQueryable();

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
            var queryable = entities.Where(e => e.TenantId == null || e.TenantId.Equals(_tenantId)).AsQueryable();

            if (pagingInput is not null)
            {
                queryable = PaginationHelper.AddFiltering(pagingInput?.FilterBy, queryable);
            }

            return queryable.Count();
        }

        public virtual T GetById(Guid id)
        {
            return entities.Where(e => e.TenantId.Equals(_tenantId)).SingleOrDefault(s => s.Id == id);
        }

        public async virtual Task<T> GetByIdAsync(Guid id)
        {
            return await entities.Where(e => e.TenantId.Equals(_tenantId)).SingleOrDefaultAsync(s => s.Id == id);
        }

        public virtual T GetByUserId(string id)
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

            entities.Add(entity);
            context.SaveChanges();

            _domainEventService.NotifyCreate<T>(_userId, entity);

            //Populate Audit records
            if (typeof(ITrackableType).IsAssignableFrom(typeof(T)))
                DoAudit(entity, "Insert");

            return entity;
        }

        public virtual IEnumerable<T> InsertMany(IEnumerable<T> entityList)
        {
            if (entityList == null || !entityList.Any())
                throw new ArgumentNullException("entity");

            //Populate Audit records
            if (typeof(ITrackableType).IsAssignableFrom(typeof(T))
                && !typeof(IntegrationAudit).IsAssignableFrom(typeof(T)))
            {
                DoAuditMany(entityList, "Insert");
            }

            foreach (var entity in entityList)
            {
                entity.Id = entity.Id == default ? Guid.NewGuid() : entity.Id;
                entity.TenantId = _tenantId;
                // TODO: Global change to Utc.
                entity.InsertedDate = DateTime.Now;
            }

            entities.AddRange(entityList);
            context.SaveChanges();

            _domainEventService.NotifyCreate(_userId, entityList);

            return entityList;
        }

        public virtual T Update(T entity)
        {
            if (entity == null)
                throw new ArgumentNullException("entity");

            entity.UpdatedBy = _userId;

            // Notify update would get input values without this:
            entity.TenantId = entities.Entry(entity).Property(e => e.TenantId).OriginalValue;
            entity.InsertedDate = entities.Entry(entity).Property(e => e.InsertedDate).OriginalValue;

            //Populate Audit records
            if (typeof(ITrackableType).IsAssignableFrom(typeof(T)))
            {
                DoAudit(entity, "Update", entity);
            }
                
            entity.UpdatedDate = DateTime.Now;

            entities.Update(entity);
            // Do not update Inserted Date:
            entities.Entry(entity).Property(e => e.InsertedDate).IsModified = false;
            // Do not allow replacing or changing TenantId.
            entities.Entry(entity).Property(e => e.TenantId).IsModified = false;

            // Publish notification with correct data.
            _domainEventService.NotifyUpdate<T>(_userId, entity);

            context.SaveChanges();

            return entity;
        }

        public virtual void Delete(Guid id)
        {            
            T entity = entities.Where(e => e.TenantId == _tenantId).SingleOrDefault(s => s.Id == id);
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

        public virtual bool DoAudit(T entity, string changeType = "Update", T entityBefore = null)
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
                        RelatedId = entity.Id.ToString(),
                        TenantId = _tenantId
                    });
                    isValidChange = true;
                    break;
                case "Insert":
                    auditInsertRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = changeType,
                        Entity = tA.Name,
                        UserId = _userId,
                        RelatedId = entity.Id.ToString(),
                        TenantId = _tenantId
                    });
                    isValidChange = true;
                    break;
                default:
                    List<IntegrationAudit> changesList = new List<IntegrationAudit>();
                    foreach (var prop in tA.GetProperties())
                    {
                        Type propType = prop.PropertyType;
                        if (propType.IsPrimitive || (propType == typeof(string)) || (propType == typeof(System.Guid)) || propType.IsValueType && prop.Name != "UpdatedDate") //ignore navigation types due to lazyloading And do not flag UpdatedDate as Valid change
                        {
                            //Determine changes and convert all to string
                            string beforeValue = entities.Entry(entityBefore).Property(prop.Name).OriginalValue != null ? entities.Entry(entityBefore).Property(prop.Name).OriginalValue.ToString() : "";
                            string afterValue = prop.GetValue(entity, null) != null ? prop.GetValue(entity, null).ToString() : "";

                            if (beforeValue != afterValue)
                            {
                                //determine datatype and whether to exclude certain criteria from the change
                                if (prop.PropertyType == typeof(DateTime?) && (beforeValue != "" || afterValue != ""))
                                {
                                    if (beforeValue == "" && afterValue != "") 
                                    {
                                        isValidChange = true;
                                    }
                                    else
                                    {
                                        if (DateTime.Parse(beforeValue).Date != (string.IsNullOrEmpty(afterValue) ? null : DateTime.Parse(afterValue).Date))
                                        {
                                            isValidChange = true;
                                        }
                                    }
                                   
                                } else isValidChange = true;
                            }
                            if (isValidChange)
                            {                                                            
                                changesList.Add(new IntegrationAudit()
                                {
                                    ChangeType = changeType,
                                    Entity = tA.Name,
                                    Property = prop.Name,
                                    ValueBefore = beforeValue,
                                    ValueAfter = afterValue,
                                    UserId = _userId,
                                    RelatedId = entity.Id.ToString(),
                                    TenantId = _tenantId
                                });
                            }
                        }
                    }
                    
                    auditInsertRepo.InsertMany(changesList);
                    break;
            }
            return isValidChange;
        }

        public virtual bool DoAuditMany(IEnumerable<T> entityList, string changeType = "Update", IEnumerable<T> entitiesBefore = null, bool noAudit = false)
        {
            if (!(entityList?.Any() ?? false))
                return false;

            bool isValidChange = false;

            GenericRepositoryBase<IntegrationAudit> auditInsertRepo = new GenericRepositoryBase<IntegrationAudit>(context, _domainEventService);
            Type tA = typeof(T);

            //Populate Audit records
            switch (changeType)
            {
                case "Delete":
                    auditInsertRepo.InsertMany(
                        entityList.Select(e => new IntegrationAudit()
                        {
                            ChangeType = changeType,
                            Entity = tA.Name,
                            Property = "IsActive",
                            ValueAfter = "false",
                            ValueBefore = "true",
                            UserId = _userId,
                            RelatedId = e.Id.ToString()
                        }).ToList());
                    isValidChange = true;
                    break;
                case "Insert":
                    auditInsertRepo.InsertMany(
                        entityList.Select(e => new IntegrationAudit()
                        {
                            ChangeType = changeType,
                            Entity = tA.Name,
                            UserId = _userId,
                            RelatedId = e.Id.ToString()
                        }).ToList());
                    isValidChange = true;
                    break;
                default:
                    List<IntegrationAudit> changesList = new List<IntegrationAudit>();

                    foreach (var entity in entityList)
                    {
                        // TODO: Is this enough. Do we have entities with the same Id?
                        var beforeObj = entitiesBefore?.FirstOrDefault(b => b.Id == entity.Id);
                        if (beforeObj != null)
                            foreach (var prop in tA.GetProperties())
                            {
                                Type propType = prop.PropertyType;
                                if (propType.IsPrimitive || (propType == typeof(string)) || (propType == typeof(System.Guid)) || propType.IsValueType && prop.Name != "UpdatedDate") //ignore navigation types due to lazyloading And do not flag UpdatedDate as Valid change
                                {
                                    //Determine changes and convert all to string
                                    string beforeValue = entities.Entry(beforeObj).Property(prop.Name).OriginalValue != null ? entities.Entry(beforeObj).Property(prop.Name).OriginalValue.ToString() : "";
                                    string afterValue = prop.GetValue(entityList, null) != null ? prop.GetValue(entityList, null).ToString() : "";

                                    if (beforeValue != afterValue)
                                    {
                                        //determine datatype and whether to exclude certain criteria from the change
                                        if (prop.PropertyType == typeof(DateTime?) && (beforeValue != "" || afterValue != ""))
                                        {
                                            if (DateTime.Parse(beforeValue).Date != DateTime.Parse(afterValue).Date)
                                            {
                                                isValidChange = true;
                                            }
                                        }
                                        else isValidChange = true;
                                    }
                                    if (isValidChange)
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
                    }

                    auditInsertRepo.InsertMany(changesList);
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
