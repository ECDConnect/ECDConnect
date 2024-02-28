using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class PointsActivityModel
    {
        public Guid PointsLibraryId { get; set; }
        public int PointsTotal { get; set; }
        public string ActivityName { get; set; }
        public string SubActivityName { get; set; }
    }
}
