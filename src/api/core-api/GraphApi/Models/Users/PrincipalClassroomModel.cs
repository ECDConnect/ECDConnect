using ECDLink.DataAccessLayer.Entities;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Users
{
    public class PrincipalClassroomModel
    {
        public Guid ClassroomId { get; set; }
        public string ClassroomName { get; set; }
        public ApplicationUser User { get; set; }

        public PrincipalClassroomModel(Guid classroomId, string classroomName, ApplicationUser user) {
            ClassroomId = classroomId;
            ClassroomName = classroomName;
            User = user;
        }
    }

    
}