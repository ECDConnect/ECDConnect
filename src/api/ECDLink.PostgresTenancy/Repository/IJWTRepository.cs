using ECDLink.PostgresTenancy.Entities;

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
