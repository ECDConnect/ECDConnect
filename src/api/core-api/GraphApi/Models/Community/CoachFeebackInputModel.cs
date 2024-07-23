using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CoachFeedbackInputModel
    {
        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }
        public Guid FeedbackTypeId { get; set; }
        public Guid SupportRatingId { get; set; }
        public string FeedbackDetails { get; set; }
    }
}
