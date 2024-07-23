using ECDLink.DataAccessLayer.Entities.Community;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class SupportRatingModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string ImageName { get; set; }
        public int Ordering { get; set; }
        
        public SupportRatingModel(SupportRating rating)
        {
            Id = rating.Id;
            Name = rating.Name;
            ImageName = rating.ImageName;
            Ordering = rating.Ordering;
        }

        public SupportRatingModel()
        {
        }
    }
    
}