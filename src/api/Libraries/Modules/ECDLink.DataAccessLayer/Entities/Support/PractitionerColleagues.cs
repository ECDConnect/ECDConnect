using ECDLink.Security;
using ECDLink.Security.Attributes;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class PractitionerColleagues
    {
        public string Name { get; set; }
        public string NickName { get; set; }
        public string ProfilePhoto { get; set; }
        public string ContactNumber { get; set; }
        public string ClassroomNames { get; set; }
        public string Title { get; set; }
        public string UserId { get; set; }
    }
}
