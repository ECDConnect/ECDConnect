using ECDLink.DataAccessLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECDLink.DataAccessLayer.Context.Extensions
{
    public static class ModelBuilderExtensions
    {
        //public static ModelBuilder AddApplicationUserOneToManyForeignKey<TForeignEntity>(this ModelBuilder builder, DeleteBehavior deleteBehavior) where TForeignEntity : class
        //{
        //    builder.Entity<TForeignEntity>(x =>
        //    {
        //        x.HasOne<ApplicationUser>("User").WithMany().HasForeignKey("UserId").HasPrincipalKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
        //    });
        //    return builder;
        //}
    }
}
