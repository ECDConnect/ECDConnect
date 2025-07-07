using Microsoft.AspNetCore.Identity;
using System;

namespace ECDLink.Core.Models
{
    public class ApplicationIdentityRole : IdentityRole<Guid>
    {
        public ApplicationIdentityRole()
        {
            Id = Guid.NewGuid();
        }

        public ApplicationIdentityRole(string roleName) : this()
        {
            Name = roleName;
        }

        public Guid? TenantId { get; set; }
        public string SystemName { get; set; }
        public string TenantName { get; set; }
    }
}
