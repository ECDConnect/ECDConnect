using ECDLink.Core.Helpers;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.AuditLog;
using ECDLink.DataAccessLayer.Entities.Caregiver;
using ECDLink.DataAccessLayer.Entities.Classroom;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Navigation;
using ECDLink.DataAccessLayer.Entities.Notes;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Reports;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Workflow;
using ECDLink.DataAccessLayer.Hierarchy.Entities;
using ECDLink.DataAccessLayer.Jobs;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ECDLink.Security.JwtSecurity;

namespace ECDLink.DataAccessLayer.Context
{
    public class AuthenticationDbContext : IdentityDbContext<ApplicationUser> //AuditIdentityDbContext<ApplicationUser>
    {
        public DbSet<MessageTemplate> MessageTemplates { get; set; }
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
        public DbSet<ShortenUrlEntity> ShortUrls { get; set; }
        public DbSet<UserConsent> UserConsents { get; set; }
        public DbSet<Absentees> Absents { get; set; }

        // Notes
        public DbSet<Note> Notes { get; set; }
        public DbSet<NoteType> NoteTypes { get; set; }

        // Classroom
        public DbSet<Classroom> Classrooms { get; set; }
        public DbSet<ClassProgramme> ClassProgrammes { get; set; }
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
        public DbSet<ProgrammeType> ProgrammeTypes { get; set; }
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

        //Reports
        public DbSet<ChildProgressReport> ChildProgressReports { get; set; }

        // WORKFLOW
        public DbSet<WorkflowStatus> WorkflowStatuses { get; set; }

        public DbSet<WorkflowStatusType> WorkflowStatusTypes { get; set; }

        // SETTINGS
        public DbSet<SystemSetting> SystemSettings { get; set; }

        //JOBS
        public DbSet<JobNotification> JobNotifications { get; set; }


        public AuthenticationDbContext(DbContextOptions<AuthenticationDbContext> options)
               : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // optionsBuilder.LogTo(System.Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information);
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

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
                x.HasKey(e => new { e.ClassroomProgrammeId, e.UserId, e.WeekOfYear });
            });

            builder.Entity<AuditLog>(x =>
            {
                x.HasNoKey();
            });

            builder.Entity<Learner>(x =>
            {
                x.HasKey(e => new { e.ClassroomGroupId, e.UserId });
            });

            builder.Entity<ChildProgressReport>(x =>
            {
                x.HasKey(e => new { e.ClassroomGroupId, e.ChildId, e.Id });
            });
        }
    }
}
