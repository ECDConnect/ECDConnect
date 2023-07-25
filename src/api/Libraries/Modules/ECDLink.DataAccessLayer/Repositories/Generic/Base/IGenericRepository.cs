using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.DataAccessLayer.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Repositories.Generic.Base
{
    public interface IGenericRepository<T, TKey> : IDisposable
        where T : EntityBase<TKey>
        where TKey : IEquatable<TKey>
    {
        void SetUserContext(string userId);
        IQueryable<T> GetAll(PagedQueryInput pagingInput = null);
        int Count(PagedQueryInput pagingInput = null);
        T GetById(TKey id);
        Task<T> GetByIdAsync(TKey id);
        T GetByUserId(string id);
        List<T> GetListByUserId(string id);
        T Insert(T entity);
        IEnumerable<T> InsertMany(IEnumerable<T> entity);
        T Update(T entity);
        void Delete(TKey id);
        bool Exists(TKey id);
        bool dbCreated();
        void SetCustomScope<context>(context dbContext);
    }
}
