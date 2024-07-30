using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CoachFeedbackInputModel
    {
        public Guid FromUserId { get; set; }
        public Guid ToUserId { get; set; }
        public List<Guid> FeedbackTypeIds { get; set; }
        public Guid SupportRatingId { get; set; }
        public string FeedbackDetails { get; set; }
    }
}
