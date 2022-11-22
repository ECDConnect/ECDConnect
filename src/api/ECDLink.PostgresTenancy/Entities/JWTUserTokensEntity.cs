using ECDLink.PostgresTenancy.Entities.Base;
using ECDLink.Tenancy.Enums;
using ECDLink.Tenancy.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECDLink.PostgresTenancy.Entities
{
    [Table("JWTUserTokens")]
    public class JWTUserTokensEntity
    {
        [Key]
        public string UserId { get; set; }
        public string TokenKey { get; set; }
        public string Token { get; set; }
        public string JWTToken { get; set; }
        public Guid TenantId { get; set; }
        public string ExpiresIn { get; set; }
        public DateTime InsertedDate { get; set; }
    }
}
