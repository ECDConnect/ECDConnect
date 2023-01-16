using System;

namespace ECDLink.Tenancy.Model
{
    public class AspNetUserTokensModel
    {
        public string UserId { get; set; }
        public string LoginProvider { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public Guid TenantId { get; set; }
        public DateTime InsertedDate { get; set; }
    }
}
