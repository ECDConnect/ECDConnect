using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using static EcdLink.Api.CoreApi.Constants;

namespace EcdLink.Api.CoreApi.Managers.Users
{
    public class InvitationManager
    {
        private readonly IGenericRepository<Invite, Guid> _inviteRepo;

        private const string UserIDNull = "UserId is null";
        private const string PrincipalIDNull = "PrincipalId is null";

        public InvitationManager(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repoFactory)
        { 
            Guid? _applicationUserId = contextAccessor.HttpContext.GetUser()?.Id;
            _inviteRepo = repoFactory.CreateGenericRepository<Invite>(userContext: _applicationUserId);
        }

        public Invite CreateUserInvitation(Guid userId, Guid principalId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentNullException("userId", UserIDNull);
            }
            if (principalId == Guid.Empty)
            {
                throw new ArgumentNullException("principalId", PrincipalIDNull);
            }

            var newInvite = new Invite
            {
                IsAccepted = null,
                UserId = userId,
                PrincipalId = principalId,
                Status = InviteStatus.Pending
            };

            _inviteRepo.Insert(newInvite);
            return newInvite;
        }

        public Invite CreatePractitionerInvitation(Guid userId, Guid practitionerId, Guid principalId)
        {
             if (userId == Guid.Empty)
            {
                throw new ArgumentNullException("userId", UserIDNull);
            }
            if (practitionerId == Guid.Empty)
            {
                throw new ArgumentNullException("practitionerId", "PractitionerId is null");
            }
            if (principalId == Guid.Empty)
            {
                throw new ArgumentNullException("principalId", PrincipalIDNull);
            }

            var newInvite = new Invite
            {
                IsAccepted = null,
                PractitionerId = practitionerId,
                UserId = userId,
                PrincipalId = principalId,
                Status = InviteStatus.Pending
            };

            _inviteRepo.Insert(newInvite);
            return newInvite;
        }
        
        public bool RejectUserInvitation(Guid userId, Guid principalId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentNullException("userId", UserIDNull);
            }
            if (principalId == Guid.Empty)
            {
                throw new ArgumentNullException("principalId", PrincipalIDNull);
            }

            Invite invite = _inviteRepo.GetAll().Where((x) => x.IsActive && x.UserId == userId && x.PrincipalId == principalId && x.Status == InviteStatus.Pending).FirstOrDefault();

            if (invite != null)
            {
                invite.Status = InviteStatus.Rejected;
                invite.RejectedDate = DateTime.UtcNow;
                invite.IsAccepted = false;
                invite.IsActive = false;
                _inviteRepo.Update(invite);
            }
            return true;
        }

        public bool AcceptUserInvitation(Guid userId, Guid principalId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentNullException("userId", UserIDNull);
            }
            if (principalId == Guid.Empty)
            {
                throw new ArgumentNullException("principalId", PrincipalIDNull);
            }

            Invite invite = _inviteRepo.GetAll().Where((x) => x.IsActive && x.UserId == userId && x.PrincipalId == principalId && x.Status == InviteStatus.Pending).FirstOrDefault();

            if (invite != null)
            {
                invite.Status = InviteStatus.Accepted;
                invite.AcceptedDate = DateTime.UtcNow;
                invite.IsAccepted = true;
                invite.IsActive = false;
                _inviteRepo.Update(invite);
            }
            return true;
        }

        public bool AcceptPractitionerInvitation(Guid userId, Guid practitionerId, Guid principalId)
        {
            if (userId == Guid.Empty)
            {
                throw new ArgumentNullException("userId", UserIDNull);
            }
            if (practitionerId == Guid.Empty)
            {
                throw new ArgumentNullException("practitionerId", "PractitionerId is null");
            }
            if (principalId == Guid.Empty)
            {
                throw new ArgumentNullException("principalId", PrincipalIDNull);
            }

            Invite invite = _inviteRepo.GetAll().Where((x) => x.IsActive && x.PractitionerId == practitionerId && x.PrincipalId == principalId && x.Status == InviteStatus.Pending).FirstOrDefault();

            if (invite != null)
            {
                invite.Status = InviteStatus.Accepted;
                invite.AcceptedDate = DateTime.UtcNow;
                invite.IsAccepted = true;
                invite.IsActive = false;
                _inviteRepo.Update(invite);
            } else
            {
                var newInvite = new Invite
                {
                    IsAccepted = true,
                    AcceptedDate = DateTime.UtcNow,
                    UserId = userId,
                    PractitionerId = practitionerId,
                    PrincipalId = principalId,
                    Status = InviteStatus.Accepted_Preschool,
                    IsActive = false,
                };

                _inviteRepo.Insert(newInvite);
            }
                return true;
        }
    }
}

