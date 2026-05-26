using System;
using System.Collections.Generic;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.PostgresTenancy.Repository;

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
            return _repository.GetByKey(key) ?? default;
        }

        public JWTUserTokensEntity GetByToken(string token)
        {
            return _repository.GetByToken(token) ?? default;
        }

        public JWTUserTokensEntity GetById(Guid id)
        {
            return _repository.GetByUserId(id) ?? default;
        }

        public IList<JWTUserTokensEntity> GetAllActiveByUserId(Guid id)
        {
            return _repository.GetAllActiveByUserId(id);
        }

        public JWTUserTokensEntity InsertToken(JWTUserTokensEntity entity)
        {
            if (entity == null) return default;

            try
            {
                _repository.Insert(entity);
            }
            catch (Exception)
            {
            }

            return entity;
        }

        public bool InvalidateExistingTokens(Guid id)
        {
            try
            {
                return _repository.DeleteAllTokensById(id);
            }
            catch (Exception)
            {
            }
            return true;
        }

        public void UpdateLastSeenByToken(string token)
        {
            if (string.IsNullOrWhiteSpace(token)) return;
            _repository.UpdateLastSeenByToken(token);
        }

        public bool RevokeToken(string tokenKey)
        {
            if (string.IsNullOrWhiteSpace(tokenKey)) return false;
            return _repository.Revoke(tokenKey);
        }
    }
}
