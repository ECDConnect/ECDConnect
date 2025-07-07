namespace ECDLink.PostgresTenancy.Entities
{
    public class JWTUserTokensEntityReturn
    {
        public string id { get; set; }
        public string auth_token { get; set; }
        public string expires_in { get; set; }
    }
}
