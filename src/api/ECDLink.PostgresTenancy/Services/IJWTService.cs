using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ECDLink.PostgresTenancy.Entities;

namespace ECDLink.PostgresTenancy.Services
{
    public interface IJWTService
    {
        public JWTUserTokensEntity GetByKey(string key);

        public JWTUserTokensEntity GetById(string key);

        JWTUserTokensEntity GetByToken(string token);

        public JWTUserTokensEntity InsertToken(JWTUserTokensEntity model);

        bool InvalidateExistingTokens(string id);

    }
}
