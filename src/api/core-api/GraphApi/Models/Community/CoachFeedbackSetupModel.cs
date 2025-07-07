using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.Community
{
    public class CoachFeedbackSetupModel
    {
        public List<FeedbackTypeModel> FeedbackTypes { get; set; }
        public List<SupportRatingModel> SupportRatings { get; set; }
    }
}

