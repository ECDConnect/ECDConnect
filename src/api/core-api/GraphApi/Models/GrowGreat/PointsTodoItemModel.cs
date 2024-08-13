using ECDLink.DataAccessLayer.Entities.PointsEngine;
using Microsoft.EntityFrameworkCore.Metadata;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat
{
    public class PointsPointsTodoItemModel
    {
        public string Message { get; set; }
        public int Count { get; set; }
        public int Points { get; set; }
        public int PercentageComplete { get; set; }
    }
}
