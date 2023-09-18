using System;

namespace ECDLink.DataAccessLayer.Entities.Integration.MappedEntities
{
    public class MappedPQA
    {
        public string Guid { get; set; }
        public string StatusOutcome { get; set; }
        public DateTime DateOfVisit { get; set; }
        public MappedCoach Coach { get; set; }
        public int StableAndNurturingScore { get; set; }
        public int StimulatingAndResourcedScore { get; set; }
        public int UseOfSmartStartRoutineScore { get; set; }
        public int InteractiveStoryTellingScore { get; set; }
        public int ChildOpportunitiesScore { get; set; }
        public int PositiveInteractionScore { get; set; }
        public int TotalScore { get; set; }
    }
}
