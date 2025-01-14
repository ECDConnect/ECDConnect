using ECDLink.ContentManagement.Entities;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.DataAccessLayer.Context
{
    public class ContentManagementDbContext : DbContext
    {
        public DbSet<ContentType> ContentTypes { get; set; }

        public DbSet<ContentTypeField> ContentTypeFields { get; set; }

        public DbSet<ContentValue> ContentValues { get; set; }

        public DbSet<FieldType> FieldTypes { get; set; }

        public DbSet<Content> Contents { get; set; }

        public DbSet<ContentStatus> ContentStatuses { get; set; }

        public DbSet<Language> Languages { get; set; }

        public DbSet<Holiday> Holiday { get; set; }

        public ContentManagementDbContext(DbContextOptions<ContentManagementDbContext> options)
          : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Content>(entity =>
            {
                entity.HasOne(c => c.ContentType)
                     .WithMany(ct => ct.Content)
                     .HasForeignKey(c => c.ContentTypeId)
                     .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<ContentValue>(entity =>
            {
                // Allow nulls in the TenantId Column (Unique Primary key removed)
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.ContentId, e.ContentTypeFieldId, e.LocaleId, e.TenantId })
                    .IsUnique();
                entity.HasOne(e => e.Content)
                    .WithMany(e => e.ContentValues)
                    .HasForeignKey(e => e.ContentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
