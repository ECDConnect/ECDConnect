using ECDLink.Security;
using ECDLink.Security.Attributes;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class PractitionerUserAndNote
    {
        public ApplicationUser AppUser { get; set; }
        public bool? IsRegistered { get; set; }

        public bool? BelongsToPreschool { get; set; }

        public string Note { get; set; }
    }
}
