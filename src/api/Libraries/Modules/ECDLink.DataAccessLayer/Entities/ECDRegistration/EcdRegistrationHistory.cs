#nullable enable

using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using HotChocolate;

[Table(nameof(EcdRegistrationHistory))]
[EntityPermission(PermissionGroups.ECDREGISTRATION)]
public class EcdRegistrationHistory : EcdRegistrationHistory<Guid>
{

}
public class EcdRegistrationHistory<TKey> : EntityBase<TKey>,
        ApplicationUserJoin
        where TKey : IEquatable<TKey>
{
    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; }
    public Guid? UserId { get; set; }

    public Guid EcdRegistrationId { get; set; }
    public virtual EcdRegistration EcdRegistration { get; set; } = null!;

    public string PropertyName { get; set; } = string.Empty;

    [GraphQLIgnore]
    public JsonDocument? OldValue { get; set; }
    [GraphQLIgnore]
    public JsonDocument? NewValue { get; set; }

    public string? ChangeReason { get; set; }
}