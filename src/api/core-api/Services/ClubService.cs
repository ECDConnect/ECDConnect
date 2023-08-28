using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace EcdLink.Api.CoreApi.Services
{
    public class ClubService : IClubService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IGenericRepositoryFactory _repositoryFactory;

        private readonly IGenericRepository<Club, Guid> _clubRepo;
        private readonly IGenericRepository<ClubMeeting, Guid> _clubMeetingRepo;
        private readonly IGenericRepository<ClubMeetingRegister, Guid> _clubMeetingRegisterRepo;
        private readonly IGenericRepository<MeetingType, Guid> _meetingTypeRepo;

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
            _meetingTypeRepo = _repositoryFactory.CreateGenericRepository<MeetingType>(userContext: _uId);
        }

        public ClubMeeting AddCoachCircleMeeting(ClubMeetingModel input)
        {
            Guid MeetingTypeId = _meetingTypeRepo.GetAll().Where(x => x.Name == Constants.CoachingCircleSettings.meeting_type_coach_circle).Select(x => x.Id).FirstOrDefault();
            List<ClubMeetingRegister> participants = new List<ClubMeetingRegister>();

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
                MeetingTypeId = MeetingTypeId,
                MeetingNotes = input.MeetingNotes
            });
            
            // insert participants for club  meeting
            foreach (var participant in input.ClubMeetingParticipants)
            {
                participants.Add(new ClubMeetingRegister {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedBy = _uId,
                    PractitionerId = participant.PractitionerId,
                    Attended = participant.Attended,
                    ClubMeetingId = clubMeeting.Id
                });
            }

            _clubMeetingRegisterRepo.InsertMany(participants);
            return clubMeeting;
        }

    }
}
