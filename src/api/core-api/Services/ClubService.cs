using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;

namespace EcdLink.Api.CoreApi.Services
{
    public class ClubService : IClubService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<Club, Guid> _clubRepo;
        private readonly IGenericRepository<ClubMeeting, Guid> _clubMeetingRepo;
        private readonly IGenericRepository<ClubMeetingRegister, Guid> _clubMeetingRegisterRepo;

        private readonly string _uId;

        public ClubService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _uId = _contextAccessor.HttpContext.GetUser()?.Id;

            _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _uId);
            _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _uId);
            _clubMeetingRegisterRepo = _repositoryFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: _uId);
        }

        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input)
        {
            // insert club meeting
            ClubMeeting clubMeeting = _clubMeetingRepo.Insert(new ClubMeeting
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedBy = _uId,
                MeetingDate = input.MeetingDate,
                Name = input.Name,
                ClubId = input.ClubId,
                ContentValueId = input.ContentValueId,
                MeetingType = Constants.CoachingCircleSettings.meeting_type_coach_circle,
                MeetingNotes = input.MeetingNotes
            });

            // insert participants for club  meeting
            foreach (var participant in input.ClubMeetingParticipants)
            {
                _clubMeetingRegisterRepo.Insert(new ClubMeetingRegister {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedBy = _uId,
                    PractitionerId = participant.PractitionerId,
                    Attended = participant.Attended,
                    ClubMeetingId = clubMeeting.Id
                });
            }
            return clubMeeting;
        }

    }
}
