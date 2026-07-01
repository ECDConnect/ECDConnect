using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("JWTUserTokens")]
    public class JWTUserTokensEntity
    {
        public Guid UserId { get; set; }
        [Key]
        [MaxLength(36)]
        public string TokenKey { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
        public Guid TenantId { get; set; }
        public string ExpiresIn { get; set; }
        public DateTime InsertedDate { get; set; }
        public DateTime LastSeenAt { get; set; }
        public string DeviceInfo { get; set; }
        public DateTime? RevokedAt { get; set; }
    }
}
