using System;
using ECDLink.DataAccessLayer.Entities.Users;

namespace EcdLink.Api.CoreApi.GraphApi.Models
{
    public class InfantModel
    {
        public string UserId { get; set; }
        public Guid? CaregiverId { get; set; }
        public CaregiverModel Caregiver { get; set; }
        public Guid? GenderId { get; set; }
        public string FirstName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public decimal? WeightAtBirth { get; set; }
        public decimal? LengthAtBirth { get; set; }
    }
}

