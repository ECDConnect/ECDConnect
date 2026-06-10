using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class EcdRegistrationUpdateInputModel
    {
        public Guid Id { get; set; }

        public SubsidyStatus? Subsidy { get; set; }

        public NonSubsidyRegistrationType? RegistrationType { get; set; }

        public string? Challenges { get; set; }
        public string? ChallengesOtherReason { get; set; }

        public bool? HasBronzeCertificate { get; set; }
        public bool? HasSilverCertificate { get; set; }
        public bool? HasGoldCertificate { get; set; }

        public string? ProblemDescription { get; set; }

        public SubsidyStatus? ECaresStatus { get; set; }
    }
}
