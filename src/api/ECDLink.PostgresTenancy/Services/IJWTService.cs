using System;
using System.Collections.Generic;
using ECDLink.PostgresTenancy.Entities;

namespace ECDLink.PostgresTenancy.Services
{
    public interface IJWTService
    {
        JWTUserTokensEntity GetByKey(string key);
        JWTUserTokensEntity GetById(Guid id);
        JWTUserTokensEntity GetByToken(string token);
        IList<JWTUserTokensEntity> GetAllActiveByUserId(Guid id);
        JWTUserTokensEntity InsertToken(JWTUserTokensEntity model);
        bool InvalidateExistingTokens(Guid id);
        void UpdateLastSeenByToken(string token);
        bool RevokeToken(string tokenKey);
    }
}
