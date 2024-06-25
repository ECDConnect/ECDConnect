using System;
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

        public JWTUserTokensEntity GetById(Guid id)
        {
            var entity = _repository.GetByUserId(id);

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

            try
            {
                _repository.Insert(entity);
            }
            catch(Exception)
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
    }
}
