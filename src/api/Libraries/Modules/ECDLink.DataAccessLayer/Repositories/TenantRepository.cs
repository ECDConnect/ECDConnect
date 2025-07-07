using ECDLink.DataAccessLayer.Context;
using ECDLink.PostgresTenancy.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Linq;

namespace ECDLink.PostgresTenancy.Repository
{
    public class TenantRepository<T> : ITenancyRepository<T> where T: class
    {
        public readonly AuthenticationDbContext Context;
        private DbSet<T> entities;

        protected string _userId;

        protected string errorMessage = string.Empty;

        public TenantRepository(AuthenticationDbContext context)
        {
            Context = context;
            entities = context.Set<T>();
        }

        public DbSet<Y> GetSet<Y>() where Y : class
        {
            return Context.Set<Y>();
        }

        //public bool Exists(string id)
        //{
        //    if (string.IsNullOrWhiteSpace(id))
        //    {
        //        return false;
        //    }
        //    return entities.Any(e => e.Id == Guid.Parse(id));
        //}

        public IQueryable<T> GetAll()
        {
            return entities;
        }

        //public virtual TenantEntity GetById(string id)
        //{
        //    return entities
        //            .Where(e => e.Id == Guid.Parse(id))
        //            .OrderBy(x => x.Id)
        //            .FirstOrDefault();
        //}

        public virtual T Insert(T entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            entities.Add(entity);
            Context.SaveChanges();

            return entity;
        }

        public virtual T Update(T entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entities.Update(entity);

            Context.SaveChanges();

            return entity;
        }

        //public void Delete(string id)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
