using ECDLink.Abstractrions.Enums;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Users;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Models.SmartStart
{
    public class CoachingClub
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string SecondaryText { get; set; }
        public string SecondaryTextColor { get; set; }
        public int SecondaryTextPriority { get; set; }
        public ICollection<ClubMeeting> ClubMeetings { get; set; }
        public ICollection<ClubMember> ClubMembers { get; set; }
        // there can be 2 active club leaders.  One appointed and then a newly appointed one who has not accepted yet. 
        public ClubLeader CurrentClubLeader { get; set; }
        public ClubLeader NewClubLeader { get; set; }
        public ClubSupport ClubSupport { get; set; }
        public League League { get; set; }
        public Coach Coach { get; set; }
        public bool FirstInLeague { get; set; }
        public int LeagueRankNr { get; set; }
        public int TotalClubPoints { get; set; }
        public string TotalClubPointsColor { get; set; }
        public int MaxClubPoints { get; set; }
        public ICollection<ClubActivity> ClubActivities { get; set; }
        public ICollection<IssueTask> IssuesTasks { get; set; }
    }

    public class IssueTask
    {
        public string SecondaryText { get; set; }
        public string SecondaryTextColor { get; set; }
        public string SecondaryDescription { get; set; }
    }

    public class CoachingClubDetails
    {
        public virtual Coach Coach { get; set; }
        public virtual List<CoachingClub> CoachingClubs { get; set; }
    }

    public class ClubMeetingCoachInfo
    {
        public bool HasMissed3MonthsMeetings { get; set; }
        public string LastMeetingAttended { get; set; }
    }

    public class CoachingClubBase
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public string Name { get; set; }
        public string SecondaryText { get; set; }
        public string SecondaryTextColor { get; set; }
        public int SecondaryTextPriority { get; set; }
        public double MeetingAttendance { get; set; }
        public string MeetingAttendanceText { get; set; }
        public string MeetingAttendanceColor { get; set; }
    }

    public class ClubActivity
    {
        public string Name { get; set; }
        public double Points { get; set; }
    }

    public class ClubRank
    {
        public Guid Id { get; set; }
        public double Score { get; set; }
        public int RankNr { get; set; }
    }

    public class NewClubInput
    {
        public string Name { get; set; }
        public string UserId { get; set; }
        public virtual List<string> NewClubMembers { get; set; }
        public virtual List<string> TransferredClubMembers { get; set; }
    }

    public class NewClubMember
    {
        public Guid ClubId { get; set; }
        public virtual List<Guid> PractitionerIds { get; set; }
    }

    public class ActivityMeetRegular
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
        public virtual List<ActivityMeetRegularDetail> UpcomingMeetings { get; set; }
        public virtual List<ActivityMeetRegularDetail> PastMeetings { get; set; }
    }

    public class ActivityMeetRegularDetail
    {
        public DateTime MeetingDate { get; set; }
        public double MeetingAttendancePerc { get; set; }
        public string MeetingAttendanceColor { get; set; }
        public string MeetingNotes { get; set; }
        public List<ClubUser> MeetingParticipants { get; set; }
        public List<ClubUser> MeetingAbsentees { get; set; }
        public int Points { get; set; }
        public Guid? EventId { get; set; }
        public string Name { set; get; }
    }

    public class ClubUser
    {
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string ProfileImageUrl { get; set; }
    }

    public class ActivityBeCreative
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
        public virtual List<ActivityBeCreativeDetail> MonthlyRecords { get; set; }
    }

    public class ActivityBeCreativeDetail
    {
        public string MonthName { get; set; }
        public string Description { get; set; }
        public string DocumentName { get; set; }
        public string DocumentReference { get; set; }
        public bool? ImageApproved { get; set; }
        public string DocumentStatus { get; set; }
        public string DocumentStatusColor { get; set; }
        public int Points { get; set; }
        public double ImageRating { get; set; }
    }
    public class ActivityHostFamilyDays
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
        public List<ActivityHostFamilyDaysDetail> Terms { get; set; }
    }

    public class ActivityHostFamilyDaysDetail
    {
        public int TermNr { get; set; }
        public string TermName { get; set; }
        public string EventName { get; set; }
        public string Description { get; set; }
        public string DocumentStatus { get; set; } = "Not completed";
        public string DocumentStatusColor { get; set; } = MetricsColorEnum.Error.ToString();
        public int Points { get; set; } = 0;
        public List<Guid> MeetingParticipantsPractitionerIds { get; set; }
    }

    public class ActivityLeaveNoOneBehind
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
        public double GreenPerc { get; set; } = 0.0;
        public double RedPerc { get; set; } = 0.0;
        public double OrangePerc { get; set; } = 0.0;
        public double BluePerc { get; set; } = 0.0;
        public string GreenText { get; set; }
        public string RedText { get; set; }
        public string OrangeText { get; set; }
        public string BlueText { get; set; }
        public List<ClubUser> GreenUsers { get; set; }
        public List<ClubUser> RedUsers { get; set; }
        public List<ClubUser> OrangeUsers { get; set; }
        public List<ClubUser> BlueUsers { get; set; }
    }


        public class ActivityChildAttendance
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
        public virtual List<ActivityChildAttendanceDetail> MonthlyRecords { get; set; }
    }

    public class ActivityChildAttendanceDetail
    {
        public string MonthName { get; set; }
        public int PercentageMembersSubmittedAllRegisters { get; set; }
        public int Points { get; set; }
        public string PointsColor { get; set; }
    }

    public class ActivityChildProgress
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
        public virtual List<ActivityChildProgressDetail> MonthlyRecords { get; set; }
    }

    public class ActivityChildProgressDetail
    {
        public string MonthName { get; set; }
        public int ProgressPoints { get; set; }
        public int CaregiverPoints { get; set; }
        public int ProgressPerc { get; set; }
        public int CaregiverPerc { get; set; }
        public string ProgressPointsColor { get; set; }
        public string CaregiverPointsColor { get; set; }

    }

    public class BeCreativeUpload
    {
        public Guid ClubId { get; set; }
        public string Description { get; set; }
        public string ImageBase64 { get; set; }
        public string FileType { get; set; }
        public DateTime DateUploaded { get; set; }
    }


}
