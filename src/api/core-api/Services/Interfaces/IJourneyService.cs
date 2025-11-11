using System;
using EcdLink.Api.CoreApi.GraphApi.Models;

namespace EcdLink.Api.CoreApi.Services.Interfaces
{
    public interface IJourneyService
    {
        public AssessmentReport GetJourneyAssessmentReport(Guid visitId);
        
    }
}