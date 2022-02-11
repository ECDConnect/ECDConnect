using ECDLink.PostgresTenancy.Entities;
using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ECDLink.PostgresTenancy.Repository
{
    public interface ITenancyRepository
    {
        IQueryable<TenantEntity> GetAll();

        TenantEntity GetById(string id);
        TenantEntity Insert(TenantEntity entity);
        TenantEntity Update(TenantEntity entity);

        void Delete(string id);
        bool Exists(string id);
        bool dbCreated();
    }
}
