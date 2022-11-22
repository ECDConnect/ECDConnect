//using ECDLink.PostgresJWT.Entities;
using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.Tenancy.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using NPOI.POIFS.FileSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ECDLink.PostgresTenancy.Repository
{
    public class JWTRepository : IJWTRepository
    {
        private PostgresTenancyContext _context;
        private DbSet<JWTUserTokensEntity> entities;

        protected string _userId;

        protected string errorMessage = string.Empty;

        public JWTRepository(PostgresTenancyContext context)
        {
            _context = context;
            entities = context.Set<JWTUserTokensEntity>();
        }

        public bool dbCreated()
        {
            return _context.Database.GetService<IRelationalDatabaseCreator>().Exists();
        }

        public bool Exists(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
            {
                return false;
            }

            return entities.Any(e => string.Equals(e.TokenKey, key));
        }

        public IQueryable<JWTUserTokensEntity> GetAll()
        {
            return entities;
        }

        public virtual JWTUserTokensEntity GetByUserId(string id)
        {
            return entities
                    .Where(e => string.Equals(e.UserId, id))
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity GetByKey(string key)
        {
            return entities
                    .Where(e => string.Equals(e.TokenKey, key))
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity GetByToken(string token)
        {
            return entities
                    .Where(e => string.Equals(e.Token, token))
                    .FirstOrDefault();
        }

        public virtual JWTUserTokensEntity Insert(JWTUserTokensEntity entity)
        {
            if (entity == null) throw new ArgumentNullException("entity");

            entities.Add(entity);
            _context.SaveChanges();

            return entity;
        }

        //public virtual JWTUserTokensEntity Update(JWTUserTokensEntity entity)
        //{
        //    if (entity == null)
        //    {
        //        throw new ArgumentNullException("entity");
        //    }

        //    entities.Update(entity);

        //    _context.SaveChanges();

        //    return entity;
        //}

        public void Delete(string key)
        {
            if (key == null) throw new ArgumentNullException("entity");
            JWTUserTokensEntity entity = entities.Where(x => x.TokenKey.Equals(key)).FirstOrDefault();
            entities.Remove(entity);
            _context.SaveChanges();

        }
    }
}
