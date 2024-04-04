using Microsoft.AspNetCore.Identity;
using System;

namespace ECDLink.PostgresTenancy.Entities
{
    public class TenancyIdentityUser : IdentityUser<Guid>
    {
        public TenancyIdentityUser() 
        { 
            this.Id = Guid.NewGuid();
            this.SecurityStamp = Guid.NewGuid().ToString();
        }
        public string Name { get; set; }
    }
}
