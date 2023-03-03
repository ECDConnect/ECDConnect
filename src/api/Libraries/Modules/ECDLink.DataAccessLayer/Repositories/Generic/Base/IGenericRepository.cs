using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ECDLink.DataAccessLayer.Repositories.Generic.Base
{
    public interface IGenericRepository<T, TKey> : IDisposable
        where T : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        void SetUserContext(string userId);
        IQueryable<T> GetAll();
        T GetById(TKey id);
        T GetByUserId(string id);
        List<T> GetListByUserId(string id);
        IQueryable<T> GetAllLocale();
        T Insert(T entity);
        T Update(T entity);
        void Delete(TKey id);
        bool Exists(TKey id);
        bool dbCreated();
        void SetCustomScope<context>(context dbContext);
    }
}
