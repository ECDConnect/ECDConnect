using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class LicenseModel
    {
        public DateTime? DelicensedDate { get; set; }
        public string DelicensedComment { get; set; }
        public string UserId { get; set; }

    }
}

