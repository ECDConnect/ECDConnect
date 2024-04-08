using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using EcdLink.Api.CoreApi.Managers.Visits;
using EcdLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Abstractrions.GraphQL.Attributes;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Helpers;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using ECDLink.Security.Extensions;
using HotChocolate;
using HotChocolate.Data;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class VisitDataStatusQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<VisitDataStatus> GetReferralsForVisitId([Service] VisitDataStatusManager visitDataStatusManager, string visitId)
        {
            return visitDataStatusManager.GetReferralDataForVisitId(visitId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalReferralsSummaryModel> GetReferralsSummary(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IReferralService referralService,
            DateTime startDate,
            DateTime endDate,
            PagedQueryInput pagingInput = null,
            List<Guid> clinicIds = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            // Need to get list of relevant CHWs, for clinics or for the team leads clinics if none are provided
            List<PortalReferralsSummaryModel> referrals;
            if (clinicIds != null && clinicIds.Any())
            {
                referrals = referralService.GetReferralsSummaryForClinics(clinicIds, startDate, endDate);
            }
            else
            {
                referrals = referralService.GetReferralsSummaryForTeamLead(uId, startDate, endDate);
            }

            if (pagingInput == null)
            {
                return referrals;
            }

            var queryable = PaginationHelper.AddFiltering(pagingInput?.FilterBy, referrals.AsQueryable());

            if (pagingInput.PageSize is not null)
                queryable = PaginationHelper.AddPaging(pagingInput?.RowOffset ?? 0, pagingInput?.PageSize ?? 10, queryable);
            

            return queryable.ToList();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [UseFiltering]
        [UseSorting]
        public List<PortalReferralModel> GetReferrals(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IReferralService referralService,
            DateTime startDate,
            DateTime endDate,
            string type,
            PagedQueryInput pagingInput = null,
            List<Guid> clinicIds = null)
        {
            var uId = contextAccessor.HttpContext.GetUser().Id;

            // Need to get list of relevant CHWs, for clinics or for the team leads clinics if none are provided
            List<PortalReferralModel> referrals;
            if (clinicIds != null && clinicIds.Any())
            {
                referrals = referralService.GetReferralsForClinics(clinicIds, startDate, endDate);
            }
            else
            {
                referrals = referralService.GetReferralsForTeamLead(uId, startDate, endDate);
            }

            if (!string.IsNullOrWhiteSpace(type)) 
            {
                referrals = referrals.Where(x => x.Type == type).ToList();
            }

            if (pagingInput == null)
            {
                return referrals;
            }

            var queryable = PaginationHelper.AddFiltering(pagingInput?.FilterBy, referrals.AsQueryable());

            if (pagingInput.PageSize is not null)
                queryable = PaginationHelper.AddPaging(pagingInput?.RowOffset ?? 0, pagingInput?.PageSize ?? 10, queryable);


            return queryable.ToList();
        }
    }
}