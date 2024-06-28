using ECDLink.DataAccessLayer.Entities.Community;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class FeedbackTypeModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Ordering { get; set; }
        
        public FeedbackTypeModel(FeedbackType type)
        {
            Id = type.Id;
            Name = type.Name;
            Description = type.Description;
            Ordering = type.Ordering;
        }

        public FeedbackTypeModel()
        {
        }
    }
    
}