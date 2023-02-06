using Microsoft.AspNetCore.Identity;

namespace ECDLink.PostgresTenancy.Entities
{
    public class TenancyIdentityUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
