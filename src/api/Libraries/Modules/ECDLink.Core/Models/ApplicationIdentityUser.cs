using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.Core.Models
{
    public class ApplicationIdentityUser : IdentityUser
    {
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
    }
}
