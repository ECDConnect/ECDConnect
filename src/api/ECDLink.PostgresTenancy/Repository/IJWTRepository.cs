using ECDLink.PostgresTenancy.Entities;
using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ECDLink.PostgresTenancy.Repository
{
    public interface IJWTRepository
    {
        JWTUserTokensEntity GetByKey(string key);
        JWTUserTokensEntity GetByUserId(string id);
        JWTUserTokensEntity GetByToken(string token);
        JWTUserTokensEntity Insert(JWTUserTokensEntity entity);
        bool DeleteAllTokensById(string id);

        void Delete(string key);
        bool Exists(string key);
        bool dbCreated();
    }
}
