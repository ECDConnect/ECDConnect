using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{

    public class EcdRegistrationInputModel
    {
        public Guid PractitionerId { get; set; }

        public SubsidyStatus Subsidy { get; set; }

        public NonSubsidyRegistrationType? RegistrationType { get; set; }

        public string Challenges { get; set; }
        public string? ChallengesOtherReason { get; set; }

        public bool HasBronzeCertificate { get; set; } = false;
        public bool HasSilverCertificate { get; set; } = false;
        public bool HasGoldCertificate { get; set; } = false;

        public string ProblemDescription { get; set; } = string.Empty;

    }
}