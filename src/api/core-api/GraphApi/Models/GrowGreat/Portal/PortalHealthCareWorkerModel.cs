using System;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalHealthCareWorkerModel: ConnectUsageModel
    {
        public Guid HealthCareWorkerId { get; set; }
        public Guid UserId { get; set; }
        public string IdNumber { get; set; }
        public string Name { get; set; }
        public DateTime? DateInvited { get; set; }
        public bool IsActive { get; set; }

        public PortalHealthCareWorkerModel(
            Guid healthCareWorkerId, 
            Guid userId,
            string idNumber,
            string name,
            bool isActive, 
            bool isRegistered, 
            DateTime lastSeenDate, 
            DateTime? updatedDate, 
            DateTime? invitationDate) 
            : base (isActive, isRegistered, lastSeenDate, updatedDate, invitationDate)
        {
            HealthCareWorkerId = healthCareWorkerId;
            UserId = userId;
            IdNumber = idNumber;
            Name = name;
            IsActive = isActive;
            DateInvited = invitationDate;
        }
    }
}
