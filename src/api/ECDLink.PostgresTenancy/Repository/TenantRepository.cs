using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Linq;

namespace ECDLink.PostgresTenancy.Repository
{
    public class TenantRepository : ITenancyRepository
    {
        private PostgresTenancyContext _context;
        private DbSet<TenantEntity> entities;

        protected string _userId;

        protected string errorMessage = string.Empty;

        public TenantRepository(PostgresTenancyContext context)
        {
            _context = context;
            entities = context.Set<TenantEntity>();
        }

        public bool dbCreated()
        {
            return _context.Database.GetService<IRelationalDatabaseCreator>().Exists();
        }

        public bool Exists(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return false;
            }

            return entities.Any(e => string.Equals(e.Id, id));
        }

        public IQueryable<TenantEntity> GetAll()
        {
            return entities;
        }

        public virtual TenantEntity GetById(string id)
        {
            return entities
                    .Where(e => string.Equals(e.Id, id))
                    .OrderBy(x => x.Id)
                    .FirstOrDefault();
        }

        public virtual TenantEntity Insert(TenantEntity entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            entities.Add(entity);
            _context.SaveChanges();

            return entity;
        }

        public virtual TenantEntity Update(TenantEntity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException("entity");
            }

            entities.Update(entity);

            _context.SaveChanges();

            return entity;
        }

        public void Delete(string id)
        {
            throw new NotImplementedException();
        }
    }
}
