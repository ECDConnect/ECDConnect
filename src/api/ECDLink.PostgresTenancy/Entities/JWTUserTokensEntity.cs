using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("JWTUserTokens")]
    public class JWTUserTokensEntity
    {
        [Key]
        public Guid UserId { get; set; }
        public string TokenKey { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
        public Guid TenantId { get; set; }
        public string ExpiresIn { get; set; }
        public DateTime InsertedDate { get; set; }
    }
}
