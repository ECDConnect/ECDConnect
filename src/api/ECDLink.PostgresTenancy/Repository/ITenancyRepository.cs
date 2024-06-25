using ECDLink.PostgresTenancy.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ECDLink.PostgresTenancy.Repository
{
    public interface ITenancyRepository<T> where T : class
    {
        DbSet<Y> GetSet<Y>() where Y : class;

        IQueryable<T> GetAll();

        //T GetById(string id);
        T Insert(T entity);
        T Update(T entity);

        //void Delete(string id);
        //bool Exists(string id);
    }
}
