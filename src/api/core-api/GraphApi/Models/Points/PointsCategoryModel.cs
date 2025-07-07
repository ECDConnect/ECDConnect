using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Points
{
    public class PointsCategoryModel
    {
        public Guid PointsCategoryId { get; set; }
        public int PointsTotal { get; set; }
        public string CategoryName { get; set; }
    }
}
