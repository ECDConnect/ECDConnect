using EcdLink.Api.CoreApi.GraphApi.Models;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Models;
using ECDLink.DataAccessLayer.Context;
using ECDLink.DataAccessLayer.Managers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace EcdLink.Api.CoreApi.GraphApi.Mutations
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class EcdRegistrationMutationExtension
    {

        [Permission(PermissionGroups.ECDREGISTRATION, GraphActionEnum.Create)]
        public async Task<EcdRegistration> CreateEcdRegistration(
         [Service] IHttpContextAccessor contextAccessor,
         AuthenticationDbContext dbContext,
        EcdRegistrationInputModel input,
        CancellationToken cancellationToken)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var normalizedChallenge = input.Challenges?.Replace("_", "") ?? string.Empty;
            if (!Enum.TryParse<ChallengeType>(normalizedChallenge, true, out var parsedChallenge))
            {
                throw new GraphQLException($"Invalid challenge type '{input.Challenges}'.");
            }

            var registration = new EcdRegistration
            {
                PractitionerId = input.PractitionerId,
                UserId = uId,
                Subsidy = input.Subsidy,
                RegistrationType = input.RegistrationType,
                Challenges = parsedChallenge,
                ChallengesOtherReason = input.ChallengesOtherReason != "" ? input.ChallengesOtherReason : null,
                ProblemDescription = input.ProblemDescription?.Trim(),
                UpdatedBy = contextAccessor.HttpContext.GetUser().UserName ?? contextAccessor.HttpContext.GetUser().Id.ToString()
            };

            bool hasAnyCertificate = input.HasBronzeCertificate || input.HasSilverCertificate || input.HasGoldCertificate;
            bool isRegistered = input.RegistrationType == NonSubsidyRegistrationType.FullyRegistered || input.RegistrationType == NonSubsidyRegistrationType.PartiallyRegistered;

            if (!hasAnyCertificate)
            {
                registration.HasBronzeCertificate = false;
                registration.HasSilverCertificate = false;
                registration.HasGoldCertificate = false;
            }
            else
            {
                registration.HasBronzeCertificate = input.HasBronzeCertificate;
                registration.HasSilverCertificate = input.HasSilverCertificate;
                registration.HasGoldCertificate = input.HasGoldCertificate;
            }

            if (input.Subsidy == SubsidyStatus.Yes || (input.Subsidy == SubsidyStatus.NotSure && isRegistered))
            {
                registration.InitialCertificates = "N/A";
            }
            else if (!hasAnyCertificate)
            {
                registration.InitialCertificates = "None";
            }
            else
            {
                var certs = new List<string>();
                if (input.HasBronzeCertificate) certs.Add("bronze");
                if (input.HasSilverCertificate) certs.Add("silver");
                if (input.HasGoldCertificate) certs.Add("gold");
                registration.InitialCertificates = string.Join(", ", certs);
            }

            dbContext.EcdRegistrations.Add(registration);

            var history = new EcdRegistrationHistory
            {
                EcdRegistration = registration,
                UserId = uId,
                PropertyName = "FullRegistrationCreated",
                OldValue = null,
                NewValue = JsonSerializer.SerializeToDocument(new
                {
                    Subsidy = registration.Subsidy,
                    RegistrationType = registration.RegistrationType,
                    Challenges = registration.Challenges,
                    ChallengesOtherReason = registration.ChallengesOtherReason,
                    ProblemDescription = registration.ProblemDescription,
                    HasBronzeCertificate = registration.HasBronzeCertificate,
                    HasSilverCertificate = registration.HasSilverCertificate,
                    HasGoldCertificate = registration.HasGoldCertificate
                }),
                ChangeReason =  "Initial registration creation",
                InsertedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow,
                UpdatedBy = registration.UpdatedBy,
                TenantId = registration.TenantId
            };

            dbContext.EcdRegistrationHistory.Add(history);

            await dbContext.SaveChangesAsync(cancellationToken);

            return registration;
        }

        [Permission(PermissionGroups.ECDREGISTRATION, GraphActionEnum.Update)]
        public async Task<EcdRegistration> UpdateEcdRegistration(
            [Service] IHttpContextAccessor contextAccessor,
            AuthenticationDbContext dbContext,
            EcdRegistrationUpdateInputModel input,
            CancellationToken cancellationToken)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            var registration = await dbContext.EcdRegistrations.FindAsync(input.Id);

            if (registration == null || !registration.IsActive)
                throw new GraphQLException($"ECD registration '{input.Id}' not found.");

            var changes = new System.Collections.Generic.Dictionary<string, (object OldValue, object NewValue)>();

            if (input.Subsidy.HasValue && input.Subsidy.Value != registration.Subsidy)
            {
                changes["Subsidy"] = (registration.Subsidy, input.Subsidy.Value);
                registration.Subsidy = input.Subsidy.Value;
            }

            if (input.RegistrationType != registration.RegistrationType)
            {
                changes["RegistrationType"] = (registration.RegistrationType, input.RegistrationType);
                registration.RegistrationType = input.RegistrationType;
            }

            if (input.Challenges != null)
            {
                var normalizedChallenge = input.Challenges.Replace("_", "");
                if (!Enum.TryParse<ChallengeType>(normalizedChallenge, true, out var parsedChallenge))
                    throw new GraphQLException($"Invalid challenge type '{input.Challenges}'.");

                if (parsedChallenge != registration.Challenges)
                {
                    changes["Challenges"] = (registration.Challenges, parsedChallenge);
                    registration.Challenges = parsedChallenge;
                }
            }

            if (input.ChallengesOtherReason != null)
            {
                var newReason = input.ChallengesOtherReason != "" ? input.ChallengesOtherReason : null;
                if (newReason != registration.ChallengesOtherReason)
                {
                    changes["ChallengesOtherReason"] = (registration.ChallengesOtherReason, newReason);
                    registration.ChallengesOtherReason = newReason;
                }
            }

            if (input.ProblemDescription != null)
            {
                var newDesc = input.ProblemDescription.Trim();
                if (newDesc != registration.ProblemDescription)
                {
                    changes["ProblemDescription"] = (registration.ProblemDescription, newDesc);
                    registration.ProblemDescription = newDesc;
                }
            }

            if (input.HasBronzeCertificate.HasValue && input.HasBronzeCertificate.Value != registration.HasBronzeCertificate)
            {
                changes["HasBronzeCertificate"] = (registration.HasBronzeCertificate, input.HasBronzeCertificate.Value);
                registration.HasBronzeCertificate = input.HasBronzeCertificate.Value;
            }

            if (input.HasSilverCertificate.HasValue && input.HasSilverCertificate.Value != registration.HasSilverCertificate)
            {
                changes["HasSilverCertificate"] = (registration.HasSilverCertificate, input.HasSilverCertificate.Value);
                registration.HasSilverCertificate = input.HasSilverCertificate.Value;
            }

            if (input.HasGoldCertificate.HasValue && input.HasGoldCertificate.Value != registration.HasGoldCertificate)
            {
                changes["HasGoldCertificate"] = (registration.HasGoldCertificate, input.HasGoldCertificate.Value);
                registration.HasGoldCertificate = input.HasGoldCertificate.Value;
            }

            if (changes.Count == 0)
                return registration;

            registration.UpdatedBy = contextAccessor.HttpContext.GetUser().UserName
                ?? contextAccessor.HttpContext.GetUser().Id.ToString();
            registration.UpdatedDate = DateTime.UtcNow;

            foreach (var change in changes)
            {
                dbContext.EcdRegistrationHistory.Add(new EcdRegistrationHistory
                {
                    EcdRegistrationId = registration.Id,
                    UserId = uId,
                    PropertyName = change.Key,
                    OldValue = JsonSerializer.SerializeToDocument(change.Value.OldValue),
                    NewValue = JsonSerializer.SerializeToDocument(change.Value.NewValue),
                    ChangeReason = "Field updated",
                    InsertedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow,
                    UpdatedBy = registration.UpdatedBy,
                    TenantId = registration.TenantId
                });
            }

            await dbContext.SaveChangesAsync(cancellationToken);

            return registration;
        }
    }
}