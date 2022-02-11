using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.PostgresTenancy.Entities
{
    public class TenancyIdentityUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
