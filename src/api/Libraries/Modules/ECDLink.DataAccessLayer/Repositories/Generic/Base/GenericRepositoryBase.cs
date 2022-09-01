using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Namotion.Reflection;
using System;
using System.Collections.Generic;
using System.Linq;

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
            return entities.AsQueryable();
        }

        public virtual T GetById(Guid id)
        {
            return entities.SingleOrDefault(s => s.Id == id);
        }

        public virtual T GetByUserId(string id)
        {            
            Type type = typeof(T);
            IQueryable<T> query = entities.AsQueryable();
            if (type.GetProperty("UserId") != null)
            {
                var result = entities.AsQueryable().Where(x => x.GetType().GetProperty("UserId").GetValue(type,null).Equals(id));
                return (T)result.AsQueryable().FirstOrDefault();
            } else return entities.SingleOrDefault(s => s.Id.Equals(id));
        }

        public virtual T Insert(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            if (entity.Id == default(Guid))
            {
                entity.Id = Guid.NewGuid();
            }

            entities.Add(entity);
            context.SaveChanges();

            _domainEventService.NotifyCreate<T>(_userId, entity);
            return entity;
        }

        public virtual T Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            if (Exists(entity.Id))
            {
                entity.InsertedDate = entity.InsertedDate;//do not update inserted date to Now                
                entity.UpdatedDate = DateTime.Now;
                entity.UpdatedBy = _userId;
                entities.Update(entity);
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
            T entity = entities.SingleOrDefault(s => s.Id == id);
            //entities.Remove(entity);
            //context.SaveChanges();
            //softdelete
            entities.Update(entity);
            entity.IsActive = false;
            entities.Update(entity);
            _domainEventService.NotifyUpdate<T>(_userId, entity);

            //_domainEventService.NotifyDelete<T>(_userId, entity);
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
            this.context = null;
            entities = null;
        }
    }
}
