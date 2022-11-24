//using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ECDLink.PostgresTenancy.Entities;
//using ECDLink.PostgresJWT.Entities;

namespace ECDLink.PostgresTenancy.Services
{
    public interface IJWTService
    {
        public JWTUserTokensEntity GetByKey(string key);

        //public JWTUserTokensEntity GetTokenByName(string url);
        JWTUserTokensEntity GetByToken(string token);

        public JWTUserTokensEntity InsertToken(JWTUserTokensEntity model);

    }
}
