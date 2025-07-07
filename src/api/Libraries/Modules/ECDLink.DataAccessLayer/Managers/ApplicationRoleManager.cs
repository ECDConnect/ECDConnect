using ECDLink.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Managers
{
    public class ApplicationRoleManager : RoleManager<ApplicationIdentityRole>
    {
        public ApplicationRoleManager(IRoleStore<ApplicationIdentityRole> store,
            IEnumerable<IRoleValidator<ApplicationIdentityRole>> roleValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            ILogger<ApplicationRoleManager> logger)
            : base(store, roleValidators, keyNormalizer, errors, logger)
        {
        }
    }
}
