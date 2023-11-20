using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.Core.Models
{
    public class ApplicationIdentityRole : IdentityRole
    {
        public ApplicationIdentityRole()
        {
            Id = Guid.NewGuid().ToString();
        }

        public ApplicationIdentityRole(string roleName) : this()
        {
            Name = roleName;
        }

        public Guid? TenantId { get; set; }
    }
}
