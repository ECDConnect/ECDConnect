using ECDLink.PostgresTenancy.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.PostgresTenancy.Context
{
    public class PostgresTenancyContext : IdentityDbContext<TenancyIdentityUser>
    {
        internal DbSet<TenantEntity> Tenants { get; set; }
        internal DbSet<JWTUserTokensEntity> JWTTokens { get; set; }

        public PostgresTenancyContext(DbContextOptions<PostgresTenancyContext> options)
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
                x.HasKey(e => new { e.Id, e.SiteAddress });
            });
        }
    }
}
