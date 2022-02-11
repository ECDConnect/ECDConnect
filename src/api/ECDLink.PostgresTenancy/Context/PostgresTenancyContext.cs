using ECDLink.PostgresTenancy.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECDLink.PostgresTenancy.Context
{
    public class PostgresTenancyContext : IdentityDbContext<TenancyIdentityUser>
    {
        internal DbSet<TenantEntity> Tenants { get; set; }

        public PostgresTenancyContext(DbContextOptions<PostgresTenancyContext> options)
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
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
    }
}
