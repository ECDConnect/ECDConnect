//using ECDLink.PostgresJWT.Entities;
using ECDLink.PostgresTenancy.Context;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;
using ECDLink.Tenancy.Enums;
using ECDLink.Tenancy.Model;
using ECDLink.Tenancy.Services;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace ECDLink.PostgresTenancy.Services
{
    public class JWTService : IJWTService
    {
        private readonly IJWTRepository _repository;

        public JWTService(IJWTRepository repository)
        {
            _repository = repository;
        }


        public JWTUserTokensEntity GetByKey(string key)
        {
            var entity = _repository.GetByKey(key);

            if (entity == null)
            {
                return default;
            }

            return entity;
        }

        public JWTUserTokensEntity GetByToken(string token)
        {
            var entity = _repository.GetByToken(token);

            if (entity == null)
            {
                return default;
            }

            return entity;
        }


        public JWTUserTokensEntity InsertToken(JWTUserTokensEntity entity)
        {
            if (entity == null)
            {
                return default;
            }

            //if (string.IsNullOrWhiteSpace(tenant.ConnectionString) && tenant.TenantType == Tenancy.Enums.TenantType.Tenant)
            //{
            //    throw new InvalidOperationException("No connection string provided");
            //}

            //var connection = new NpgsqlConnectionStringBuilder(tenant.ConnectionString);

            var tokenEntity = _repository.Insert(entity);

            return tokenEntity;
        }
    }
}
