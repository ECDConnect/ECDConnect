using ECDLink.Core.Helpers;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Community;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.IncomeStatements;
using ECDLink.DataAccessLayer.Entities.Navigation;
using ECDLink.DataAccessLayer.Entities.Notes;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Training;
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
using System;

namespace ECDLink.DataAccessLayer.Context
{
    public class AuthenticationDbContext : IdentityDbContext<ApplicationUser, ApplicationIdentityRole, Guid>
    {
        public DbSet<TenantEntity> Tenants { get; set; }
        public DbSet<TenantSetupInfo> TenantSetupInfo { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<TenantHasModule> TenantHasModules { get; set; } 
        public DbSet<JWTUserTokensEntity> JWTTokens { get; set; }
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
 
        public DbSet<SystemLog> SystemLogs { get; set; }
        public DbSet<PractitionerRemovalHistory> PractitionerRemovalHistories { get; set; }

        // Notes
        public DbSet<Note> Notes { get; set; }
        public DbSet<NoteType> NoteTypes { get; set; }

        // Classroom
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<ClassProgramme> ClassProgrammes { get; set; }
        public DbSet<ClassroomGroup> ClassroomGroups { get; set; }
        public DbSet<Learner> Learners { get; set; }
        public DbSet<ProgrammeAttendanceReason> ProgrammeAttendanceReasons { get; set; }
        public DbSet<Attendance> Attendances { get; set; }

        public DbSet<Programme> Programmes { get; set; }

        public DbSet<DailyProgramme> DailyProgrammes { get; set; }
        public DbSet<ClassReassignmentHistory> ClassReassignmentHistories { get; set; }


        // Security
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
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

        //Reports
        public DbSet<ChildProgressReport> ChildProgressReports { get; set; }
        public DbSet<ChildProgressReportPeriod> ChildProgressReportPeriod { get; set; }

        // WORKFLOW
        public DbSet<WorkflowStatus> WorkflowStatuses { get; set; }

        public DbSet<WorkflowStatusType> WorkflowStatusTypes { get; set; }

        // SETTINGS
        public DbSet<SystemSetting> SystemSettings { get; set; }

        //JOBS
        public DbSet<JobNotification> JobNotifications { get; set; }

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
    
        // Calendar
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<CalendarEventParticipant> CalendarEventParticipants { get; set; }

        // Points library
        public DbSet<PointsLibrary> PointsLibrary { get; set; }
        public DbSet<PointsUserSummary> PointsUserSummary { get; set; }
        public DbSet<PointsClinicSummary> PointsClinicSummary { get; set; }

        // User Help
        public DbSet<UserHelp> UserHelp { get; set; }

        // Training
        public DbSet<UserTrainingCourse> UserTrainingCourses {  get; set; }

        // Community
        public DbSet<SupportRating> SupportRatings { get; set; }
        public DbSet<FeedbackType> FeedbackTypes { get; set; }
        public DbSet<CoachFeedback> CoachFeedback { get; set; }
        public DbSet<CoachFeedbackType> CoachFeedbackTypes { get; set; }
        public DbSet<CommunitySkill> CommunitySkills { get; set; }
        public DbSet<CommunityProfile> CommunityProfile { get; set; }
        public DbSet<CommunityProfileSkill> CommunityProfileSkill { get; set; }
        public DbSet<CommunityProfileConnection> CommunityProfileConnections { get; set; }

        public DbSet<UserResourceLikes> UserResourceLikes { get; set; }

        public DbSet<Holiday> Holidays { get; set; }

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

            builder.Entity<TenantEntity>(x =>
            {
                x.HasKey(e => new { e.Id, e.ApplicationName, e.SiteAddress });
            });
            builder.Entity<TenantHasModule>(x =>
            {
                x.HasKey(e => new { e.ModuleId, e.TenantId });
            });
            builder.Entity<Module>(x =>
            {
                x.HasKey(e => new { e.Id });
            });
            builder.Entity<ApplicationUser>(x =>
            {
                x.Property(p => p.PhoneNumber).HasConversion(
                          v => UserHelper.NormalizePhoneNumber(v),
                          v => v);
            });
            builder.Entity<Attendance>(x =>
            {
                x.HasKey(e => new { e.ClassroomProgrammeId, e.UserId, e.WeekOfYear });
            });
            builder.Entity<AuditLog>(x =>
            {
                x.HasNoKey();
            });
            builder.Entity<ChildProgressReport>(x =>
            {
                x.HasKey(e => new { e.Id });
            });
            builder.Entity<Learner>(x =>
            {
                x.HasKey(e => new { e.ClassroomGroupId, e.UserId, e.Id });
            });
            builder.Entity<NavigationPermission>(x =>
            {
                x.HasKey(c => new { c.PermissionId, c.NavigationId });
            });
            builder.Entity<NavigationPermission>(x =>
            {
                x.HasKey(c => new { c.PermissionId, c.NavigationId });
            });
            builder.Entity<Permission>(x =>
            {
                x.Property(p => p.InsertedDate).HasDefaultValueSql("(now())");
            });
            builder.Entity<Practitioner>(x =>
            {
                x.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).HasPrincipalKey(x => x.Id).OnDelete(DeleteBehavior.Cascade);
            });
            builder.Entity<RolePermission>(x =>
            {
                x.HasKey(c => new { c.PermissionId, c.RoleId });
            });
            builder.Entity<TenantEntity>(x =>
            {
                x.HasKey(e => new { e.Id, e.SiteAddress });
            });
            builder.Entity<UserGrant>(x =>
            {
                x.HasKey(e => new { e.GrantId, e.UserId });
            });
            builder.Entity<MessageLogRelatedTo>(x =>
            {
                x.HasKey(e => new { e.MessageLogId, e.RelatedEntityId });
            });
        }
    }
}
