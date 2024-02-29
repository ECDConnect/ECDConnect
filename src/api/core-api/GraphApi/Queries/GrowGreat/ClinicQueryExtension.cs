using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClinicQueryExtension
    {
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClinicReportModel GetClinicReportData([Service] IClinicService clinicService, Guid clinicId)
        {
            return clinicService.GetClinicReportData(clinicId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public ClinicVisitReportModel GetClinicVisitReportData([Service] IClinicService clinicService, Guid clinicId, DateTime startDate, DateTime endDate)
        {
            return clinicService.GetClinicVisitReportData(clinicId, startDate, endDate);
        }
    }
}
