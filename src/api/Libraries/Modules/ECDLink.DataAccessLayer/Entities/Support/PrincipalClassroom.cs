using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;

namespace ECDLink.DataAccessLayer.Entities
{
    [EntityPermission(PermissionGroups.CLASSROOM)]
    public class PrincipalClassroom
    {
        public string PrincipalName { get; set; }

        public string Name { get; set; }

        public string ClassroomGroupName { get; set; }

        public string Id { get; set; }

        public string ClassroomGroupId { get; set; }

        public DateTime InsertedDate { get; set; }
        public string ProgrammeTypeName { get; set; }

        public string ClassSiteAddress { get; set; }

        public double? PreschoolFeeAmount { get; set; }
        public DateTime? PreschoolFeeAmountLastUpdateDate { get; set; }

        public string ClassSiteAddressId { get; set; }

        public string ProgrammeTypeId { get; set; }
    }
}
