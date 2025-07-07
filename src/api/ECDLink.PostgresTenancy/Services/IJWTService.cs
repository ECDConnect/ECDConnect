using System;
using ECDLink.PostgresTenancy.Entities;

namespace ECDLink.PostgresTenancy.Services
{
    public interface IJWTService
    {
        public JWTUserTokensEntity GetByKey(string key);

        public JWTUserTokensEntity GetById(Guid key);

        JWTUserTokensEntity GetByToken(string token);

        public JWTUserTokensEntity InsertToken(JWTUserTokensEntity model);

        bool InvalidateExistingTokens(Guid id);

    }
}
