using ECDLink.PostgresTenancy.Entities;
using System;

namespace ECDLink.PostgresTenancy.Repository
{
    public interface IJWTRepository
    {
        JWTUserTokensEntity GetByKey(string key);
        JWTUserTokensEntity GetByUserId(Guid id);
        JWTUserTokensEntity GetByToken(string token);
        JWTUserTokensEntity Insert(JWTUserTokensEntity entity);
        bool DeleteAllTokensById(Guid id);

        void Delete(string key);
        bool Exists(string key);
        bool dbCreated();
    }
}
