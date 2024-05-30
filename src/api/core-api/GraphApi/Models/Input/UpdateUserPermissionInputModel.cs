using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Input
{
    public class UpdateUserPermissionInputModel
    {
        public Guid UserId { get; set; }
        public List<Guid> PermissionIds { get; set; }
    }
}
