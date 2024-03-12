using Microsoft.AspNetCore.Identity;
using System;

namespace ECDLink.Core.Models
{
    public class ApplicationIdentityUser : IdentityUser<Guid>
    {
        public ApplicationIdentityUser()
        {
            Id = Guid.NewGuid();
            SecurityStamp = Guid.NewGuid().ToString();
        }
        public bool IsSouthAfricanCitizen { get; set; }

        public string IdNumber { get; set; }

        public bool VerifiedByHomeAffairs { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string FirstName { get; set; }

        public string Surname { get; set; }

        public string FullName { get; set; }

        public string ContactPreference { get; set; }

        public string ProfileImageUrl { get; set; }

        public bool IsActive { get; set; }

        public DateTime LastSeen { get; set; } = DateTime.UtcNow;

        public DateTime InsertedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
