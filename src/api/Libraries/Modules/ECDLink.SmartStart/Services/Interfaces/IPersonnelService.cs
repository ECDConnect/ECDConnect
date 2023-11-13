using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECDLink.SmartStart.Services.Interfaces
{
    public interface IPersonnelService
    {
        #region Practitioners
        //public List<PractitionerModel> GetAllPractitioners();
        //public PractitionerModel GetPractitionerDetails(Practitioner practitioner);
        public List<Practitioner> GetPractitionerPeers(string practitionerId);
        public List<Child> GetAllChildrenForPractitioner(string practitionerId);
        public Practitioner GetPractitionerForChild(string childUserId);
        public List<ClassroomGroup> GetAllClassroomGroupsForPractitioner(string practitionerId);
        public List<Classroom> GetAllClassroomsForPractitioner(string userIdOfPractitioner);
        //public PrincipalClassroom GetClassroomDetailsForPractitioner(string userId);
        public List<Practitioner> GetAllPractitionersForPrincipal(string userId);
        public string GetSiteNameForPractitioner(string userId);
        public Practitioner SwitchPrincipal(string oldPrincipalUserId, string newPrincipalUserId);
        public Practitioner PromotePractitionerToPrincipal(string userId);
        public Practitioner DemotePractitionerAsPrincipal(string userId);
        public Principal MapPractitionerToPrincipal(Practitioner practitioner);
        //public Trainee GetTraineeByUserId(
        //        [Service] UserLicenseManager userLicenseManager,
        //        string userId);
        public PractitionerTimeline GetPractitionerTimeline(string userId);
        public Task<bool> DeActivatePractitionerAsync(string userId, string leavingComment, string reasonForPractitionerLeavingId, string reasonDetails);
        public bool UpdatePractitionerBusinessWalkthrough(string userId);
        #endregion

        #region Trainees
        public Trainee ScheduleConsolidationMeetingDate(string userId, DateTime? scheduledDate);
        public Trainee UpdateCommunitySupport(string userId, bool? haveCommunitySupport);
        public TraineeOnBoardTimeline GetOnBoardTraineeTimeline(string userId);
        #endregion

        public string GetUserSignature(string userId);
        public string GetUserSiteAddress(string userId);
        public bool RemovePractitionerClassrooms(List<Guid> classroomIds);
    }


}
