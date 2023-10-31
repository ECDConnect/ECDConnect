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
        public virtual ICollection<ClubMeeting> ClubMeetings { get; set; }
        public virtual ICollection<ClubMember> ClubMembers { get; set; }
        // there can be 2 active club leaders.  One appointed and then a newly appointed one who has not accepted yet. 
        public ClubLeader CurrentClubLeader { get; set; }
        public ClubLeader NewClubLeader { get; set; }
        public virtual ClubSupport ClubSupport { get; set; }
        public virtual League League { get; set; }
        public virtual Coach Coach { get; set; }
        public bool FirstInLeague { get; set; }
        public int LeagueRankNr { get; set; }
        public int TotalClubPoints { get; set; }
        public string TotalClubPointsColor { get; set; }
        public int MaxClubPoints { get; set; }
        public virtual ICollection<ClubActivity> ClubActivities { get; set; }
        public virtual ICollection<IssueTask> IssuesTasks { get; set; }
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
        public virtual List<ClubMeeting> UpcomingMeetings { get; set; }
        public virtual List<ActivityMeetRegularDetail> PastMeetings { get; set; }
    }

    public class ActivityMeetRegularDetail
    {
        public DateTime MeetingDate { get; set; }
        public double MeetingAttendancePerc { get; set; }
        public string MeetingAttendanceColor { get; set; }
        public string MeetingNotes { get; set; }
        public virtual List<ClubMeetingRegister> MeetingParticipants { get; set; }
        public virtual List<ClubMember> MeetingAbsentees { get; set; }
        public int Points { get; set; }
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
    }
    public class ActivityHostFamilyDays
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
    }

    public class ActivityLeaveNoOneBehind
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
    }

    public class ActivityChildAttendance
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
    }

    public class ActivityChildProgress
    {
        public int Points { get; set; }
        public string PointsColor { get; set; }
    }


}
