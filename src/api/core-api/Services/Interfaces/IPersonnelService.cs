using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECDLink.Core.Services.Interfaces
{
    public interface IPersonnelService
    {
        #region Practitioners
        public List<Practitioner> GetPractitionerPeers(string practitionerId);
        public Practitioner GetPractitionerForChild(string childUserId);        
        public string GetSiteNameForPractitioner(string userId);
        public Practitioner SwitchPrincipal(string oldPrincipalUserId, string newPrincipalUserId);
        public Practitioner PromotePractitionerToPrincipal(string userId,bool sendComm = false);
        public Practitioner DemotePractitionerAsPrincipal(string userId);
        public Principal MapPractitionerToPrincipal(Practitioner practitioner);
        public PractitionerTimeline GetPractitionerTimeline(string userId);
        public Task<bool> DeActivatePractitionerAsync(string userId, string leavingComment, string reasonForPractitionerLeavingId, string reasonDetails);
        public bool UpdatePractitionerBusinessWalkthrough();
        public bool UpdatePractitioneProgressWalkthrough();
        #endregion
        public string GetUserSignature(string userId);
        public string GetUserSiteAddress(string userId);
        public bool RemovePractitionerClassrooms(List<Guid> classroomIds);
    }


}
