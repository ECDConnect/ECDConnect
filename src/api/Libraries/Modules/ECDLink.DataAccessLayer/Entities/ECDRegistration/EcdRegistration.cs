using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.Security;
using ECDLink.Security.Attributes;

[Table(nameof(EcdRegistration))]
[EntityPermission(PermissionGroups.ECDREGISTRATION)]
public class EcdRegistration : EcdRegistration<Guid>
{
}

public class EcdRegistration<TKey> : EntityBase<TKey>
 where TKey : IEquatable<TKey>
{

    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; }
    public Guid UserId { get; set; }

    public Guid? PractitionerId { get; set; }
    [ForeignKey(nameof(PractitionerId))]
    public virtual Practitioner Practitioner { get; set; } = null!;

    public SubsidyStatus Subsidy { get; set; }

    public NonSubsidyRegistrationType? RegistrationType { get; set; }

    public ChallengeType Challenges { get; set; }
    public string? ChallengesOtherReason { get; set; }              

    public string ProblemDescription { get; set; } = string.Empty;

    public bool HasBronzeCertificate { get; set; } = false;
    public bool HasSilverCertificate { get; set; } = false;
    public bool HasGoldCertificate { get; set; } = false;

    public virtual ICollection<EcdRegistrationHistory> History { get; set; }
        = new List<EcdRegistrationHistory>();
}