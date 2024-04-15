using ECDLink.DataAccessLayer.Entities.Clinics;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal
{
    public class PortalClinicMeetingModel
    {
        public PortalClinicMeetingModel()
        {
        }

        public PortalClinicMeetingModel(ClinicMeeting clinicMeeting)
        {
            SetMeetingParticipantsOptedOut(clinicMeeting.ParticipantsOptedOut);
            SetMeetingParticipantsInField(clinicMeeting.ParticipantsInField);

            Id = clinicMeeting.Id;
            MeetingDate = clinicMeeting.MeetingDate.Date;
            MeetingTypeId = clinicMeeting.MeetingTypeId;
            TeamLeadId = clinicMeeting.TeamLeadId;
            PositiveStory = clinicMeeting.PositiveStory;
            ReportingIssue = clinicMeeting.ReportingIssue;
            TotalSupportVisits = clinicMeeting.TotalSupportVisits;
            TeamLeadName = clinicMeeting.TeamLead.User.FullName;
        }

        private void SetMeetingParticipantsOptedOut(ICollection<ClinicMeetingParticipantOptedOut> participantsOptedOut)
        {
            List<Participant> records = new List<Participant>();
            foreach (var item in participantsOptedOut)
            {
                records.Add(new Participant()
                {
                    HCWId = item.HealthCareWorkerId,
                    HCWName = item.HealthCareWorker.User.FullName
                });
            }
            this.ParticipantsOptedOut = records;
        }

        private void SetMeetingParticipantsInField(ICollection<ClinicMeetingParticipantInField> participantsInField)
        {
            List<Participant> records = new List<Participant>();
            foreach (var item in participantsInField)
            {
                records.Add(new Participant()
                {
                    HCWId = item.HealthCareWorkerId,
                    HCWName = item.HealthCareWorker.User.FullName
                });
            }
            this.ParticipantsInField = records;
        }

        public Guid Id { get; set; }
        public DateTime MeetingDate { get; set; }
        public Guid MeetingTypeId { get; set; }
        public Guid TeamLeadId { get; set; }
        public List<Participant> ParticipantsOptedOut { get; set; }
        public List<Participant> ParticipantsInField { get; set; }
        public string PositiveStory { get; set; }
        public string ReportingIssue { get; set; }
        public int TotalSupportVisits { get; set; }
        public string TeamLeadName{ get; set; }

    }

    public class Participant
    {
        public Guid HCWId { get; set; }
        public string HCWName { get; set; }

    }
}
