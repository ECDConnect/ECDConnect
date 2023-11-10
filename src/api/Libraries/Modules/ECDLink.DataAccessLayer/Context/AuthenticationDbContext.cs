using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.DataIngestion;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.EventRecords;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Licenses;
using ECDLink.DataAccessLayer.Entities.Navigation;
using ECDLink.DataAccessLayer.Entities.Notes;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.PQA;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.SmartSpaceVisit;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Jobs;
using ECDLink.PostgresTenancy.Entities;
using ECDLink.Security.JwtSecurity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ECDLink.DataAccessLayer.Context
{
    public class AuthenticationDbContext : IdentityDbContext<ApplicationUser> //AuditIdentityDbContext<ApplicationUser>
    {
        public DbSet<MessageTemplate> MessageTemplates { get; set; }
        public DbSet<MessageLog> MessageLogs { get; set; }
        public DbSet<UserGrant> UserGrants { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<DocumentType> DocumentTypes { get; set; }
        public DbSet<Education> Education { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<Grant> Grants { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<Race> Races { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ReasonForLeaving> ReasonsForLeaving { get; set; }
        public DbSet<ReasonForPractitionerLeaving> ReasonsForPractionerLeaving { get; set; }
        public DbSet<ReasonForPractitionerLeavingProgramme> ReasonsForPractionerLeavingProgramme { get; set; }
        public DbSet<ShortenUrlEntity> ShortUrls { get; set; }
        public DbSet<UserConsent> UserConsents { get; set; }
        public DbSet<Absentees> Absents { get; set; }
        public DbSet<ProgrammeType> ProgrammeTypes { get; set; }
        public DbSet<SL_Ingestion_User> SL_Ingestion_Users { get; set; }
        public DbSet<SL_Ingestion_User_Update> SL_Ingestion_Users_Update { get; set; }
        public DbSet<SystemLog> SystemLogs { get; set; }
        public DbSet<PractitionerRemovalHistory> PractitionerRemovalHistories { get; set; }

        // Notes
        public DbSet<Note> Notes { get; set; }
        public DbSet<NoteType> NoteTypes { get; set; }

        // Classroom
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<ClassProgramme> ClassProgrammes { get; set; }
        public DbSet<ClassroomGroup> ClassroomGroupss { get; set; }
        public DbSet<Learner> Learners { get; set; }
        public DbSet<ProgrammeAttendanceReason> ProgrammeAttendanceReasons { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        public DbSet<Programme> Programmes { get; set; }

        public DbSet<DailyProgramme> DailyProgrammes { get; set; }
        public DbSet<ClassReassignmentHistory> ClassReassignmentHistories { get; set; }


        // Security
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserHierarchyEntity> UserHierarchy { get; set; }
        public DbSet<HierarchyEntity> Hierarchy { get; set; }
        public DbSet<AspNetJWTSession> AspNetJWTSession { get; set; }

        // Navigation
        public DbSet<NavigationPermission> NavigationPermissions { get; set; }
        public DbSet<Navigation> Navigations { get; set; }

        //User Types
        public DbSet<Child> Children { get; set; }
        public DbSet<Practitioner> Practitioners { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<Caregiver> Caregivers { get; set; }
        public DbSet<Franchisor> Franchisors { get; set; }
        public DbSet<HealthCareWorker> HealthCareWorkers { get; set; }
        public DbSet<Mother> Mothers { get; set; }
        public DbSet<Infant> Infants { get; set; }
        public DbSet<Trainee> Trainees { get; set; }

        //Reports
        public DbSet<ChildProgressReport> ChildProgressReports { get; set; }

        // WORKFLOW
        public DbSet<WorkflowStatus> WorkflowStatuses { get; set; }

        public DbSet<WorkflowStatusType> WorkflowStatusTypes { get; set; }

        // SETTINGS
        public DbSet<SystemSetting> SystemSettings { get; set; }

        //JOBS
        public DbSet<JobNotification> JobNotifications { get; set; }

        // Integration
        public DbSet<IntegrationEntityMapping> IntegrationEntityMappings { get; set; }
        public DbSet<IntegrationColumnMapping> IntegrationColumnMappings { get; set; }
        public DbSet<IntegrationAudit> IntegrationAudits { get; set; }
        public DbSet<IntegrationLog> IntegrationLogs { get; set; }

        // Income Statements
        public DbSet<StatementsContributionType> StatementsContributionTypes { get; set; }
        public DbSet<StatementsExpenses> StatementsExpenses { get; set; }
        public DbSet<StatementsExpenseType> StatementsExpenseTypes { get; set; }
        public DbSet<StatementsFeeType> StatementsFeeTypes { get; set; }
        public DbSet<StatementsIncome> StatementsIncomes { get; set; }
        public DbSet<StatementsIncomeStatement> StatementsIncomeStatements { get; set; }
        public DbSet<StatementsIncomeType> StatementsIncomeTypes { get; set; }
        public DbSet<StatementsPayType> StatementsPayTypes { get; set; }
        public DbSet<StatementsStartupSupport> StatementsStartupSupports { get; set; }

        // Visits
        public DbSet<VisitType> VisitTypes { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<VisitData> VisitData { get; set; }
        public DbSet<VisitDataStatus> VisitDataStatus { get; set; }
        public DbSet<VisitGrowthDataDay> VisitGrowthDataDay { get; set; }
        public DbSet<VisitGrowthDataHeight> VisitGrowthDataHeight { get; set; }
        public DbSet<VisitBackReferral> VisitBackReferral { get; set; }

        // Licenses
        public DbSet<LicenseType> LicenseType { get; set; }
        public DbSet<License> License { get; set; }


        // Event Records
        public DbSet<EventRecordType> EventRecordTypes { get; set; }
        public DbSet<EventRecord> EventRecords { get; set; }

        // Clubs
        public DbSet<Club> Clubs { get; set; }
        public DbSet<ClubMeeting> ClubMeetings { get; set; }
        public DbSet<ClubMeetingRegister> ClubMeetingRegisters { get; set; }
        public DbSet<MeetingType> MeetingType { get; set; }
        public DbSet<ClubMember> ClubMember { get; set; }
        public DbSet<ClubLeader> ClubLeader { get; set; }
        public DbSet<ClubSupport> ClubSupport { get; set; }
        public DbSet<ClubPointsLibrary> ClubPointsLibrary { get; set; }
        public DbSet<ClubPoints> ClubPoints { get; set; }
        public DbSet<ClubActivityUpload> ClubActivityUpload { get; set; }
        public DbSet<ClubActivityUploadType> ClubActivityUploadType { get; set; }

        // Leagues
        public DbSet<LeagueType> LeagueType { get; set; }
        public DbSet<League> League { get; set; }

        // PQA
        public DbSet<PQA> PQAs { get; set; } // TODO - I think we can remove this now, it was old integration stuff
        public DbSet<PQARating> PQARatings { get; set; }
        
        // SmartSpaceVisit
        public DbSet<SmartSpaceVisit> SmartSpaceVisits { get; set; }

        // Calendar
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<CalendarEventParticipant> CalendarEventParticipants { get; set; }

        // Points library
        public DbSet<PointsLibrary> PointsLibrary { get; set; }
        public DbSet<PointsUser> PointsUser { get; set; }
        public DbSet<PointsUserSummary> PointsUserSummary { get; set; }

        public AuthenticationDbContext(DbContextOptions<AuthenticationDbContext> options)
               : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.EnableSensitiveDataLogging();
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>(x =>
            {
                x.Property(p => p.PhoneNumber).HasConversion(
                          v => UserHelper.NormalizePhoneNumber(v),
                          v => v);
            });

            builder.Entity<RolePermission>(x =>
            {
                x.HasKey(c => new { c.PermissionId, c.RoleId });
            });

            builder.Entity<NavigationPermission>(x =>
            {
                x.HasKey(c => new { c.PermissionId, c.NavigationId });
            });

            builder.Entity<Permission>(entity =>
            {
                entity.Property(x => x.InsertedDate).HasDefaultValueSql("(now())");
            });

            builder.Entity<UserGrant>(x =>
            {
                x.HasKey(e => new { e.GrantId, e.UserId });
            });

            builder.Entity<UserConsent>(x =>
            {
                x.HasKey(e => new { e.ConsentId, e.UserId });
            });

            builder.Entity<CareGiverGrant>(x =>
            {
                x.HasKey(e => new { e.GrantId, e.Id });
            });
            builder.Entity<Attendance>(x =>
            {
                x.HasKey(e => new { e.ClassroomProgrammeId, e.UserId, e.WeekOfYear }).;
            });

            builder.Entity<AuditLog>(x =>
            {
                x.HasNoKey();
            });

            builder.Entity<Learner>(x =>
            {
                x.HasKey(e => new { e.ClassroomGroupId, e.UserId, e.Id });
            });

            builder.Entity<ChildProgressReport>(x =>
            {
                x.HasKey(e => new { e.Id });
            });

            builder.Entity<TenantEntity>(x =>
            {
                x.HasKey(e => new { e.Id, e.SiteAddress });
            });
        }
    }
}
