using ECDLink.PostgresTenancy.Entities;
using System;
using System.Collections.Generic;

namespace ECDLink.PostgresTenancy.Repository
{
    public interface IJWTRepository
    {
        JWTUserTokensEntity GetByKey(string key);
        JWTUserTokensEntity GetByUserId(Guid id);
        JWTUserTokensEntity GetByToken(string token);
        IList<JWTUserTokensEntity> GetAllActiveByUserId(Guid id);
        JWTUserTokensEntity Insert(JWTUserTokensEntity entity);
        bool DeleteAllTokensById(Guid id);
        void UpdateLastSeenByToken(string token);
        bool Revoke(string tokenKey);
        void Delete(string key);
        bool Exists(string key);
        bool dbCreated();
    }
}
