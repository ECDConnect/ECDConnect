using EcdLink.Api.CoreApi.GraphApi.Models.GrowGreat.Portal;
using System;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface ITeamLeadService
    {
        PortalUsersTLModel GetTeamLeadById(Guid teamLeadId);
    }
}