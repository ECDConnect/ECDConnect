using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECDLink.DataAccessLayer.Managers
{
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        private IGenericRepositoryFactory _repoFactory;

        public ApplicationUserManager(IUserStore<ApplicationUser> store,
            IOptions<IdentityOptions> optionsAccessor,
            IPasswordHasher<ApplicationUser> passwordHasher,
            IEnumerable<IUserValidator<ApplicationUser>> userValidators,
            IEnumerable<IPasswordValidator<ApplicationUser>> passwordValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            IServiceProvider services,
            ILogger<ApplicationUserManager> logger,
            IGenericRepositoryFactory repoFactory)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
            _repoFactory = repoFactory;
        }

        public async Task<ApplicationUser> FindByIdAsync(Guid? userId)
        {
            if (!userId.HasValue) return null;
            var user = await base.FindByIdAsync(userId.Value.ToString());
            if (user != null) await SetObjectDataAsync(user);
            return user;
        }

        public async Task<ApplicationUser> FindByIdAsync(Guid userId)
        {
            var user = await base.FindByIdAsync(userId.ToString());
            if (user != null) await SetObjectDataAsync(user);
            return user;
        }

        public async override Task<ApplicationUser> FindByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId)) return null;
            var user = await base.FindByIdAsync(userId);
            if (user != null) await SetObjectDataAsync(user);
            return user;
        }

        public async Task SetObjectDataAsync(ApplicationUser user, Guid? tenantId = null)
        {
            if (user is null) return;

            var roles = await base.GetRolesAsync(user);

            //Coach
            if (roles.Any(x => x.Contains(Roles.COACH)))
            {
                var coachRepo = _repoFactory.CreateGenericRepository<Coach>(userContext: user.Id);
                user.coachObjectData = coachRepo.GetByUserId(user.Id);
            }
            //Principal or Practitioner - Principal is just a Practitioner with IsPrincipal as true
            if (roles.Any(x => x.Contains(Roles.PRINCIPAL) || x.Contains(Roles.PRACTITIONER)))
            {
                var practiRepo = _repoFactory.CreateGenericRepository<Practitioner>(userContext: user.Id, tenantContext: user.TenantId);

                var userData = practiRepo.GetByUserId(user.Id);
                if (userData != null)
                {
                    if (userData.IsPrincipal.HasValue && userData.IsPrincipal == true)
                    {
                        user.practitionerObjectData = null;
                        user.principalObjectData = userData;
                    }
                    else
                    {
                        user.principalObjectData = null;
                        user.practitionerObjectData = userData;
                    }
                }
            }
        }
    }
}
