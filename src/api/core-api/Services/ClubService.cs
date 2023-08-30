using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using System;
using System.Collections.Generic;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        private readonly IGenericRepository<ClubMember, Guid> _clubMemberRepo;

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
            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _uId);
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

        public List<ClubMember> GetClubMembers(Guid clubId)
        {
            return _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).ToList();
        }

        public double GetClubAttendanceForMonth(Guid clubId, DateTime date)
        {
            double attendance = 0.0;
            int totalMembers = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).Count();
            int totalAttended = _clubMeetingRegisterRepo.GetAll().Where(x => x.ClubMeeting.MeetingDate.Value.Year == date.Year &&
                                                                            x.ClubMeeting.MeetingDate.Value.Month == date.Month &&
                                                                            x.ClubMeeting.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting &&
                                                                            x.IsActive == true && x.Attended == true).Count();

            if (totalMembers > 0) {
                attendance = ((double) totalAttended / (double) totalMembers) * 100;
            }
            
            return attendance;
        }

        public bool HasAttendanceRegisterForMonth(Guid clubId, DateTime date)
        {
            int totalRegister = _clubMeetingRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true &&
                                                                x.MeetingDate.Value.Year == date.Year &&
                                                                x.MeetingDate.Value.Month == date.Month &&
                                                                x.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting &&
                                                                x.ClubMeetingRegister.Count > 0).Count();


            return totalRegister > 0;

        }


    }
}
