using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.ContentManagement.Repositories;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries.GrowGreat
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class ClinicMeetingQueryExtension
    {

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public PortalClinicMeetingModel GetClinicMeetingForMonth([Service] IClinicService clinicService, Guid clinicId)
        {
            return clinicService.GetClinicMeetingForMonth(clinicId);
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PortalClinicMeetingModel> GetAllClinicMeetings([Service] IClinicService clinicService)
        {
            return clinicService.GetAllClinicMeetings();
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        [GraphQLType("[Topic]!")]
        public IEnumerable<object> GetCMSTopicForMonth([Service] ContentManagementRepository contentRepo, Guid localeId)
        {
            var title = DateTime.Now.Date.ToString("MMMM yyyy");
            return  contentRepo.GetByValueKey("Topic", "title", title, localeId);
        }

    }
}
