using ECDLink.DataAccessLayer.Entities.Base;
using ECDLink.Security;
using ECDLink.Security.Attributes;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    /// <summary>
    /// A one-off milestone for a single user: a walkthrough they finished, a
    /// prompt they dismissed. Replaces the browser localStorage keys that used
    /// to hold these, which were lost whenever a user cleared their cache or
    /// moved to another device, and were shared by everyone on a shared phone.
    ///
    /// Deliberately permissioned under <see cref="PermissionGroups.USERFLAG"/>,
    /// which no role is granted. Every entity gets generic GetAll/create/update
    /// resolvers built for it (see GenericQueryBuilder), and those take an
    /// arbitrary UserId. Leaving that group ungranted denies the generic
    /// resolvers for everyone, so the only way in is userFlags / setUserFlag,
    /// which are scoped to the calling user.
    /// </summary>
    [Table(nameof(UserFlag))]
    [EntityPermission(PermissionGroups.USERFLAG)]
    public class UserFlag : UserFlag<Guid>
    {
    }

    public class UserFlag<TKey> : EntityBase<TKey>
         where TKey : IEquatable<TKey>
    {
        public Guid UserId { get; set; }

        /// <summary>
        /// Identifies the milestone, e.g. "attendanceTutorialComplete". Flags
        /// that repeat per period carry the period in the key rather than in a
        /// separate column, e.g. "programmePlanningPrompt:{reportPeriodId}".
        /// </summary>
        public string FlagKey { get; set; }

        /// <summary>
        /// Optional payload. A flag that exists is set; most callers never need
        /// more than that, so this stays null for them.
        /// </summary>
        public string FlagValue { get; set; }
    }
}
