using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities.Interfaces;
using ECDLink.DataAccessLayer.Entities.Notes;
using ECDLink.DataAccessLayer.Entities.Training;
using ECDLink.DataAccessLayer.Entities.Users;
using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECDLink.DataAccessLayer.Entities
{
    [PrimaryKey(nameof(Id))]
    public class ApplicationUser : ApplicationIdentityUser, IMultiUserType, ITrackableType, RaceJoin<Guid?>, GenderJoin<Guid?>
    {
        [ForeignKey(nameof(RaceId))]
        public virtual Race Race { get; set; }

        public Guid? RaceId { get; set; }

        [ForeignKey(nameof(GenderId))]
        public virtual Gender Gender { get; set; }

        public Guid? GenderId { get; set; }

        [GraphIgnoreInput]
        public virtual ICollection<Note> Notes { get; set; }

        [GraphIgnoreInput]
        public virtual ICollection<Documents.Document> Documents { get; set; }

        [GraphIgnoreInput]
        public override Guid Id { get => base.Id; set => base.Id = value; }
        public override string UserName { get => base.UserName; set => base.UserName = value; }
        public override string NormalizedUserName { get => base.NormalizedUserName; set => base.NormalizedUserName = value; }
        public override string Email { get => base.Email; set => base.Email = value; }
        public string PendingEmail { get; set; }
        public string PendingPhoneNumber { get; set; }
        public override string NormalizedEmail { get => base.NormalizedEmail; set => base.NormalizedEmail = value; }
        public override bool EmailConfirmed { get => base.EmailConfirmed; set => base.EmailConfirmed = value; }
        public override string PhoneNumber { get => base.PhoneNumber; set => base.PhoneNumber = value; }
        public override bool PhoneNumberConfirmed { get => base.PhoneNumberConfirmed; set => base.PhoneNumberConfirmed = value; }
        public override bool TwoFactorEnabled { get => base.TwoFactorEnabled; set => base.TwoFactorEnabled = value; }
        
        public string NickFirstName { get; set; }
        public string NickSurname { get; set; }
        public string NickFullName { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string EmergencyContactFirstName { get; set; }
        public string EmergencyContactSurname { get; set; }
        public string EmergencyContactFullName { get; set; }
        public string WhatsAppNumber { get; set; }
        public string PreferredCommunicationLanguage { get; set; }
        public string NextOfKinFirstName { get; set; }
        public string NextOfKinSurname { get; set; }
        public string NextOfKinContactNumber { get; set; }
        public bool? IsImported { get; set; }
        public bool? ResetData { get; set; }
        public string ReasonForLeaving { get; set; }
        public string ReasonForLeavingComments { get; set; }
        public string RegisterType { get; set; }
        public bool? ShareInfoPartners { get; set; }

        public virtual ICollection<UserPermission> UserPermissions { get; set; }

        [NotMapped]
        public bool isAdminRegistered { get; set; }

        [NotMapped]
        public virtual Coach coachObjectData { get; set; }
        [NotMapped]
        public virtual Practitioner principalObjectData { get; set; }
        [NotMapped] 
        public virtual Practitioner practitionerObjectData { get; set; }
        //[NotMapped] 
        //public virtual Child childObjectData { get; set; }
        public override DateTimeOffset? LockoutEnd { get => base.LockoutEnd; set => base.LockoutEnd = value; }

        [GraphQLIgnore]
        public override bool LockoutEnabled { get => base.LockoutEnabled; set => base.LockoutEnabled = value; }

        [GraphQLIgnore]
        public override int AccessFailedCount { get => base.AccessFailedCount; set => base.AccessFailedCount = value; }

        [GraphQLIgnore]
        public override string PasswordHash { get => base.PasswordHash; set => base.PasswordHash = value; }

        [GraphQLIgnore]
        public override string SecurityStamp { get => base.SecurityStamp; set => base.SecurityStamp = value; }

        [GraphQLIgnore]
        public override string ConcurrencyStamp { get => base.ConcurrencyStamp; set => base.ConcurrencyStamp = value; }

        [GraphQLIgnore]
        public int Age
        {
            get
            {
                if (DateOfBirth != default(DateTime))
                {
                    DateTime today = DateTime.Today;

                    int age = today.Year - DateOfBirth.Year;

                    if (DateOfBirth > today.AddYears(-age))
                    {
                        age--;
                    }

                    return age == -1 ? 0 : age;
                }

                return 0;
            }
        }

        public Guid? TenantId { get; set; }

        [ForeignKey(nameof(LanguageId))]
        public virtual Language Language { get; set; }
        public Guid? LanguageId { get; set; }

        [GraphIgnoreInput]
        public DateTime? InsertedDate { get; set; } = DateTime.Now;

        [GraphIgnoreInput]
        public DateTime? UpdatedDate { get; set; } = DateTime.Now;

        [GraphIgnoreInput]
        public virtual ICollection<UserTrainingCourse> TrainingCourses { get; set; }
    }

    public interface ApplicationUserJoin
    {
        [ForeignKey(nameof(UserId))]
        public ApplicationUser User { get; set; }
        public Guid? UserId { get; set; }
    }
}
