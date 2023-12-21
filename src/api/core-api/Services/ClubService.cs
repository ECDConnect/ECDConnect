using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Extensions;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Calendar;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Integration.IntegrationEntityMapping;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Entities.Visits;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using ECDLink.Tenancy.Context;
using HotChocolate;
using HotChocolate.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
        private readonly IGenericRepository<ClubMember, Guid> _clubMemberRepo;
        private readonly IGenericRepository<ClubLeader, Guid> _clubLeaderRepo;
        private readonly IGenericRepository<ClubSupport, Guid> _clubSupportRepo;
        private readonly IGenericRepository<Coach, Guid> _coachRepo;
        private readonly IGenericRepository<Practitioner, Guid> _practitionerRepo;
        private readonly IGenericRepository<League, Guid> _leagueRepo;
        private readonly IGenericRepository<ClubPointsLibrary, Guid> _clubPointsLibraryRepo;
        private readonly IGenericRepository<ClubPoints, Guid> _clubPointsRepo;
        private readonly IGenericRepository<ClubActivityUpload, Guid> _clubActivityUploadRepo;
        private readonly IGenericRepository<ClubActivityUploadType, Guid> _clubActivityUploadTypeRepo;
        private readonly IGenericRepository<IntegrationAudit, Guid> _integrationAuditRepo;
        private readonly IGenericRepository<Visit, Guid> _visitRepo;
        private readonly IGenericRepository<CalendarEvent, Guid> _calendarEventRepo;


        private readonly string _applicationUserId;

        INotificationService _notificationService;
        UserManager<ApplicationUser> _userManager;
        IPointsEngineService _pointsEngineService;
        DocumentManager _documentManager;

        public ClubService(
            IHttpContextAccessor contextAccessor,
            IGenericRepositoryFactory repositoryFactory,
            [Service] INotificationService notificationService,
            [Service] UserManager<ApplicationUser> userManager,
            [Service] IPointsEngineService pointsEngineService,
            [Service] DocumentManager documentManager
            )
        {
            _contextAccessor = contextAccessor;
            _repositoryFactory = repositoryFactory;
            _applicationUserId = _contextAccessor.HttpContext.GetUser()?.Id;

            _clubRepo = _repositoryFactory.CreateGenericRepository<Club>(userContext: _applicationUserId);
            _clubMeetingRepo = _repositoryFactory.CreateGenericRepository<ClubMeeting>(userContext: _applicationUserId);
            _clubMeetingRegisterRepo = _repositoryFactory.CreateGenericRepository<ClubMeetingRegister>(userContext: _applicationUserId);
            _meetingTypeRepo = _repositoryFactory.CreateGenericRepository<MeetingType>(userContext: _applicationUserId);
            _clubMemberRepo = _repositoryFactory.CreateGenericRepository<ClubMember>(userContext: _applicationUserId);
            _clubLeaderRepo = _repositoryFactory.CreateGenericRepository<ClubLeader>(userContext: _applicationUserId);
            _clubSupportRepo = _repositoryFactory.CreateGenericRepository<ClubSupport>(userContext: _applicationUserId);
            _coachRepo = _repositoryFactory.CreateGenericRepository<Coach>(userContext: _applicationUserId);
            _leagueRepo = _repositoryFactory.CreateGenericRepository<League>(userContext: _applicationUserId);
            _practitionerRepo = _repositoryFactory.CreateGenericRepository<Practitioner>(userContext: _applicationUserId);
            _clubPointsLibraryRepo = _repositoryFactory.CreateGenericRepository<ClubPointsLibrary>(userContext: _applicationUserId);
            _clubPointsRepo = _repositoryFactory.CreateGenericRepository<ClubPoints>(userContext: _applicationUserId);
            _clubActivityUploadRepo = _repositoryFactory.CreateGenericRepository<ClubActivityUpload>(userContext: _applicationUserId);
            _clubActivityUploadTypeRepo = _repositoryFactory.CreateGenericRepository<ClubActivityUploadType>(userContext: _applicationUserId);
            _integrationAuditRepo = _repositoryFactory.CreateRepository<IntegrationAudit>(userContext: _applicationUserId);
            _visitRepo = _repositoryFactory.CreateRepository<Visit>(userContext: _applicationUserId);
            _calendarEventRepo = _repositoryFactory.CreateRepository<CalendarEvent>(userContext: _applicationUserId);

            _notificationService = notificationService;
            _userManager = userManager;
            _pointsEngineService = pointsEngineService;
            _documentManager = documentManager;
        }

        public ClubMeeting AddClubMeeting(ClubMeetingModel input, string meetingType)
        {
            Guid meetingTypeId = _meetingTypeRepo.GetAll().Where(x => x.Name == meetingType).Select(x => x.Id).FirstOrDefault();
            List<ClubMeetingRegister> participants = new List<ClubMeetingRegister>();
            Club club = _clubRepo.GetById(input.ClubId);

            // insert club meeting
            ClubMeeting clubMeeting = _clubMeetingRepo.Insert(new ClubMeeting
            {
                Id = Guid.NewGuid(),
                IsActive = true,
                InsertedDate = DateTime.Now,
                UpdatedBy = _applicationUserId,
                MeetingDate = input.MeetingDate,
                Name = input.Name,
                ClubId = input.ClubId,
                ContentValueId = input.ContentValueId,
                MeetingTypeId = meetingTypeId,
                MeetingNotes = input.MeetingNotes,
                OtherDescription = input.OtherDescription == null ? "": input.OtherDescription,
                TotalCaregiversAttended = input.TotalCaregiversAttended == null ? 0 : input.TotalCaregiversAttended.Value,
                CoachAttended = input.CoachAttend == null ? false : true,
                EventId = input.EventId
            });
            
            // insert participants for club meeting
            foreach (var participant in input.ClubMeetingParticipants)
            {
                participants.Add(new ClubMeetingRegister {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId,
                    PractitionerId = participant.PractitionerId,
                    Attended = participant.Attended,
                    ClubMeetingId = clubMeeting.Id
                });
            }
            _clubMeetingRegisterRepo.InsertMany(participants);

            // Add club points if club has league
            if (meetingType == Constants.ClubSettings.meeting_type_club_meeting && club.LeagueId != null)
            {
                _pointsEngineService.CalculateMeetRegularly(input.ClubId, clubMeeting.Id);
            }

            // family day uploads and points
            if (meetingType == Constants.ClubSettings.meeting_type_play_day ||
                meetingType == Constants.ClubSettings.meeting_type_story_day ||
                meetingType == Constants.ClubSettings.meeting_type_end_of_year_celebration ||
                meetingType == Constants.ClubSettings.meeting_type_open_day ||
                meetingType == Constants.ClubSettings.meeting_type_other)
            {
                // upload the image
                if (input.ImageBase64 != "") { 
                    string fileName = input.MeetingDate.Date.ToString("MMM_yyyy") + "_" + meetingType + "_" + input.ClubId + input.FileType;
                    DocumentModel documentModel = new DocumentModel()
                    {
                        Reference = input.ImageBase64,
                        FileName = fileName,
                        UserId = _applicationUserId,
                        CreatedUserId = _applicationUserId
                    };
                    Document document = _documentManager.SaveActivityUploadDocument(documentModel).Result;
                    if (document != null)
                    {
                        ClubActivityUploadType uploadType = _clubActivityUploadTypeRepo.GetAll().Where(x => x.Name == Constants.ClubSettings.upload_type_family_days).FirstOrDefault();
                        ClubActivityUpload uploadedRecord = _clubActivityUploadRepo.Insert(new ClubActivityUpload()
                        {
                            Id = Guid.NewGuid(),
                            IsActive = true,
                            InsertedDate = DateTime.Now,
                            UpdatedDate = DateTime.Now,
                            UpdatedBy = _applicationUserId,
                            ClubId = input.ClubId,
                            DocumentId = document.Id,
                            ClubActivityUploadTypeId = uploadType.Id,
                            ImageApproved = false,
                            Month = input.MeetingDate.Month,
                            Year = input.MeetingDate.Year
                        });
                    }
                }

                // Points
                if (club.LeagueId != null)
                {
                    _pointsEngineService.CalculateHostFamilyDays(input.ClubId, _applicationUserId, input.MeetingDate.Date);
                }
            }
            return clubMeeting;
        }
        
        public void AddCaregiverReportBackMeeting(Guid clubId, string userId)
        {
            var practitionerId = _practitionerRepo.GetByUserId(userId).Id;

            var reportsMonth = DateTime.Now.Month < 8
                ? 7
                : 12;

            var meetingTypeId = _meetingTypeRepo.GetAll().Where(x => x.Name == Constants.ClubSettings.meeting_type_caregiver_meeting).Select(x => x.Id).FirstOrDefault();

            var lastCaregiverMeetingForClub = _clubMeetingRepo.GetAll()
                .Where(x => x.MeetingType.Name == Constants.ClubSettings.meeting_type_caregiver_meeting && x.ClubId == clubId)
                .OrderByDescending(x => x.MeetingDate)
                .Include(x => x.ClubMeetingRegister)
                .FirstOrDefault();

            //Check if we need to create a new meeting
            if (lastCaregiverMeetingForClub == null 
                || lastCaregiverMeetingForClub.MeetingDate.HasValue && lastCaregiverMeetingForClub.MeetingDate.Value.Year != DateTime.Now.Year
                || lastCaregiverMeetingForClub.MeetingDate.HasValue && lastCaregiverMeetingForClub.MeetingDate.Value.Month != reportsMonth)
            {
                var club = _clubRepo.GetAll().Where(x => x.Id == clubId).Include(x => x.ClubMembers).Include(x => x.ClubLeaders).Include(x => x.ClubSupport).FirstOrDefault();
                var members = new List<Guid>();
                members.AddRange(club.ClubMembers.Where(x => x.IsActive).Select(x => x.PractitionerId));
                members.AddRange(club.ClubLeaders.Where(x => x.IsActive).Select(x => x.PractitionerId));
                members.AddRange(club.ClubSupport.Where(x => x.IsActive).Select(x => x.PractitionerId));


                _clubMeetingRepo.Insert(new ClubMeeting
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId,
                    MeetingDate = new DateTime(DateTime.Now.Year, reportsMonth, 31),
                    Name = "Caregiver Report Back",
                    ClubId = clubId,
                    MeetingTypeId = meetingTypeId,
                    MeetingNotes = "",
                    OtherDescription = "",
                    CoachAttended = false,    
                    TotalCaregiversAttended = 0,
                    ClubMeetingRegister = members.Distinct().Select(x => new ClubMeetingRegister
                    {
                        PractitionerId = x,
                        Attended = x == practitionerId,
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId,
                    }).ToList()
                });
            }

            // Update attended for practitioner
            var registerForPractitioner = lastCaregiverMeetingForClub.ClubMeetingRegister.Where(x => x.PractitionerId == practitionerId).SingleOrDefault();

            if (registerForPractitioner != null)
            {
                registerForPractitioner.Attended = true;
            }
            else
            {
                lastCaregiverMeetingForClub.ClubMeetingRegister.Add(new ClubMeetingRegister
                {
                    PractitionerId = practitionerId,
                    Attended = true,
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId,
                });
            }

            _clubMeetingRepo.Update(lastCaregiverMeetingForClub);
        }

        public bool IsClubLeader(Guid practitionerId)
        {
            ClubLeader clubLeader = _clubLeaderRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive && x.DateAccepted.HasValue).FirstOrDefault();
            return clubLeader == null? false: true;
        }

        public bool IsClubSupport(Guid practitionerId)
        {
            ClubSupport clubSupport = _clubSupportRepo.GetAll().Where(x => x.PractitionerId == practitionerId).FirstOrDefault();
            return clubSupport == null ? false : true;
        }

        public List<ClubLeader> GetLeadersForClub(Guid clubId)
        {
            return _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive).OrderBy(x => x.DateAssigned).ToList();
        }

        public ClubSupport GetSupportForClub(Guid clubId)
        {
            return _clubSupportRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive).FirstOrDefault();
        }

        public ClubMember GetClubForPractitioner(Guid practitionerId)
        {
            return _clubMemberRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive == true).Include(x => x.Club).FirstOrDefault();
        }

        private int GetLeagueMaxPoints(string name)
        {
            int maxPoints = Constants.ClubSettings.non_purple_club_max_points;
            if (name == Constants.ClubSettings.name_purple)
            {
                maxPoints = Constants.ClubSettings.purple_club_max_points;
            }
            return maxPoints;
        }

        private bool ValidateClubFirstPositionInLeague(Club club, DateTime date)
        {
            // sum all points for all library items for year
            int clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == club.Id && x.Year == date.Year && x.IsActive).Select(x => x.Points).Sum();

            // get all clubs in same league
            List<Guid> clubIds = _clubRepo.GetAll().Where(x => x.LeagueId == club.LeagueId && x.IsActive && x.Id != club.Id).Select(x => x.Id).ToList();

            // get all points for these club ids
            List<ClubPoints> otherPoints = _clubPointsRepo.GetAll().Where(x => clubIds.Contains(x.ClubId) && x.Year == date.Year && x.IsActive).ToList();
            
            foreach (var item in clubIds)
            {
                int otherClubPoints = otherPoints.Where(x => x.ClubId == item).Select(x => x.Points).Sum();
                if (otherClubPoints > clubPoints)
                {
                    return false;
                }
            }
            if (clubPoints == 0)
            {
                return false;
            }
            return true;
        }

        private double GetClubEarningsPercForMonth(Club club, DateTime date)
        {
            int maxPoints = GetLeagueMaxPoints(club?.League?.LeagueType?.Name);
            int clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == club.Id && x.Year == date.Year && x.Month == date.Month).Select(x => x.Points).Sum();
            return Math.Round( (double)clubPoints / (double)maxPoints * 100, 0);
        }

        private int GetClubLeagueRankPosition(Club club, DateTime date)
        {
            int rank = 0;
            int maxPoints = GetLeagueMaxPoints(club?.League?.LeagueType?.Name);

            // get all clubs in same league
            List<Guid> clubIds = _clubRepo.GetAll().Where(x => x.LeagueId == club.LeagueId && x.IsActive).Select(x => x.Id).ToList();
            // get all points for these club ids
            List<ClubPoints> allClubsPoints = _clubPointsRepo.GetAll().Where(x => clubIds.Contains(x.ClubId) && x.Year == date.Year && x.IsActive).ToList();

            List<ClubRank> clubRanks = new List<ClubRank>();
            ClubRank clubRank = new ClubRank();
            double clubPoint = 0.0;
            foreach (var clubId in clubIds)
            {
                clubPoint = allClubsPoints.Where(x => x.ClubId == clubId).Select(x => x.Points).Sum();
                if (clubPoint != 0)
                {
                    clubRank = new ClubRank();
                    clubRank.Id = clubId;
                    clubRank.Score = Math.Round((double)clubPoint / (double)maxPoints * 100, 0);
                    clubRanks.Add(clubRank);
                }
            }
            // order the list of objects from low to high and set the index according to score
            clubRanks = clubRanks.OrderBy(x => x.Score).ToList();
            var i = 1;
            foreach (var item in clubRanks)
            {
                item.RankNr = i;
                i++;
            }

            rank = clubRanks.Where(x => x.Id == club.Id).Select(x => x.RankNr).FirstOrDefault();
            return rank;
        }

        public PractitionerAttendance GetPractitionerAttendance(Guid practitionerId, DateTime date, string meetingType)
        {
            List<ClubMeetingRegister> practitionerAttendance = _clubMeetingRegisterRepo.GetAll().Where(x => x.PractitionerId == practitionerId &&
                                                                                                       x.ClubMeeting.MeetingDate.Value.Year == date.Year &&
                                                                                                       x.ClubMeeting.MeetingType.Name == meetingType)
                                                                                                    .OrderByDescending(x => x.ClubMeeting.MeetingDate).ToList();
            PractitionerAttendance attendance = new PractitionerAttendance();
            if (practitionerAttendance.Count > 0)
            {
                attendance.TotalMeetings = practitionerAttendance.Select(x => x.ClubMeeting.Id).Distinct().Count();
                attendance.TotalPresent = practitionerAttendance.Where(x => x.Attended == true).Count();
                attendance.PercAttended = (double)attendance.TotalPresent / (double)attendance.TotalMeetings * 100;
                if (attendance.TotalPresent > 0)
                {
                    attendance.AttendanceText = practitionerAttendance.GetItemByIndex(0).ClubMeeting.MeetingDate.Value.ToString();
                    // setting the color on parent from where this is called, because different rules are implemented for different meeting types
                    attendance.AttendanceColor = "";
                }
                attendance.MeetingRegister = practitionerAttendance;
            }

            return attendance;
        }

        public List<ClubMember> GetClubMembers(Guid clubId)
        {
            return _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).ToList();
        }

        public List<ClubMember> GetClubsMembers(Guid[] clubIds)
        {
            return _clubMemberRepo.GetAll().Where(x => clubIds.Contains(x.ClubId) && x.IsActive == true).ToList();
        }

        private double GetClubAttendancePercForMonth(int totalMembers, Guid clubId, DateTime date)
        {
            double attendance = 0.0;
            int totalAttended = _clubMeetingRegisterRepo.GetAll().Where(x => x.ClubMeeting.ClubId == clubId &&
                                                                            x.ClubMeeting.MeetingDate.Value.Year == date.Year &&
                                                                            x.ClubMeeting.MeetingDate.Value.Month == date.Month &&
                                                                            x.ClubMeeting.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting &&
                                                                            x.IsActive == true && x.Attended == true).Count();

            if (totalMembers > 0) {
                attendance = ((double) totalAttended / (double) totalMembers) * 100;
            }
            
            return attendance;
        }

        private bool HasAttendanceRegisterForMonth(List<ClubMeeting> clubMeetings, DateTime date)
        {
            int totalRegister = clubMeetings.Where(x => x.MeetingDate.Value.Month == date.Month &&
                                                        x.ClubMeetingRegister.Count > 0).Count();
            return totalRegister > 0;
        }

        public ClubMeetingCoachInfo GetCoachMeetingAttendance(List<ClubMeeting> clubMeetings)
        {
            DateTime today = new DateTime();
            DateTime past3Months = today.AddMonths(-3);

            int missedMeetings = clubMeetings.Where(x => x.MeetingDate.Value.Date >= past3Months.Date && x.MeetingDate.Value.Date <= today.Date && x.CoachAttended == false).OrderByDescending(x => x.MeetingDate).Count();
            ClubMeeting lastMeetingAttended = clubMeetings.Where(x => x.CoachAttended == true).OrderByDescending(x => x.MeetingDate).FirstOrDefault();

            return new ClubMeetingCoachInfo { 
                HasMissed3MonthsMeetings = missedMeetings > 0, 
                LastMeetingAttended = lastMeetingAttended != null ? lastMeetingAttended.MeetingDate.Value.ToString("d MMM") : ""
            };
        }

        public Club ChangeClubName(Guid clubId, string clubName)
        {
            Club club = _clubRepo.GetById(clubId);
            club.Name = clubName;
            return _clubRepo.Update(club);
        }

        public ClubLeader AddNewClubLeader(Guid clubId, Guid practitionerId)
        {
            // The coach can change the next leader before they accept it. 

            // Notification information
            Practitioner practitioner = _practitionerRepo.GetById(practitionerId);
            var userToSend = _userManager.FindByIdAsync(practitioner.UserId).Result;
            Club club = _clubRepo.GetById(clubId);

            List<TagsReplacements> replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "ClubName",
                    ReplacementValue = club.Name
                }
            };

            // Set pending leader in-active if available
            ClubLeader pendingClubLeader = _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && 
                                                                          x.IsActive == true && 
                                                                          x.DateAssigned.HasValue && 
                                                                          !x.DateAccepted.HasValue).FirstOrDefault();
            if (pendingClubLeader != null)
            {
                pendingClubLeader.IsActive = false;
                pendingClubLeader.DateAccepted = null;
                pendingClubLeader.DateAssigned = null;

                _clubLeaderRepo.Update(pendingClubLeader);
                // Expire notification for pending club leader
                _notificationService.ExpireNotificationsTypesForUser(pendingClubLeader.Practitioner.UserId.ToString(), TemplateTypeConstants.ClubLeaderRoleAssigned);
            }

            // Add new leader
            ClubLeader clubLeader = _clubLeaderRepo.Insert(
                new ClubLeader()
                {
                    Id = Guid.NewGuid(),
                    ClubId = clubId,
                    PractitionerId = practitionerId,
                    InsertedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    UpdatedBy = _applicationUserId,
                    DateAssigned = DateTime.Now,
                    IsActive = true
                });

            // Expire notification for user if exist
            _notificationService.ExpireNotificationsTypesForUser(userToSend.Id, TemplateTypeConstants.ClubLeaderRoleAssigned);

            // Add new notification for new club leader assignment
            _notificationService.SendNotificationAsync(null, TemplateTypeConstants.ClubLeaderRoleAssigned, DateTime.Now, userToSend, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(14));

            // Archive leader in member table
            ClubMember clubMember = _clubMemberRepo.GetAll().Where(x => x.PractitionerId == practitionerId).FirstOrDefault();
            if (clubMember == null)
            {
                clubMember.IsActive = false;
                clubMember.UpdatedDate = DateTime.Now;
                clubMember.UpdatedBy = _applicationUserId;
                _clubMemberRepo.Update(clubMember);
            }

            return clubLeader;
        }

        public bool AddNewClubMembers(NewClubMember input)
        {
            List<ClubMember> members = new List<ClubMember>();
            foreach (Guid Id in input.PractitionerIds)
            {
                members.Add(new ClubMember
                {
                    Id = Guid.NewGuid(),
                    IsActive = true,
                    InsertedDate = DateTime.Now,
                    DateClubJoined = DateTime.Now,
                    UpdatedBy = _applicationUserId,
                    Practitioner = _practitionerRepo.GetById(Id),
                    PractitionerId = Id,
                    ClubId = input.ClubId,
                    IsNewInClub = true
                });
               
            }
            _clubMemberRepo.InsertMany(members);
            SendNewClubMemberNotifications(input.ClubId, members);

            return true;
        }

        public bool MoveClubMembers(NewClubMember input)
        {
            ClubMember clubMember = new ClubMember();
            List<ClubMember> clubMembers = new List<ClubMember>();
            foreach (var Id in input.PractitionerIds)
            {
                clubMember = _clubMemberRepo.GetAll().Where(x => x.PractitionerId == Id).FirstOrDefault();
                clubMember.IsNewInClub = true;
                clubMember.ClubId = input.ClubId;
                clubMember.UpdatedBy = _applicationUserId;
                clubMember.UpdatedDate = DateTime.Now;
                clubMember.DateClubJoined = DateTime.Now;

                clubMembers.Add(clubMember);
                _clubMemberRepo.Update(clubMember);
            }

            // Notify club members that they are in a new club
            return SendNewClubMemberNotifications(input.ClubId, clubMembers) ;
        }

        private bool SendNewClubMemberNotifications(Guid clubId, List<ClubMember> clubMembers)
        {
            // Notifications
            Club club = _clubRepo.GetById(clubId);
            ApplicationUser user = null;
            List<TagsReplacements> replacements = new List<TagsReplacements>
            {
                new TagsReplacements()
                {
                    FindValue = "ClubName",
                    ReplacementValue = club.Name
                }
            };

            foreach(ClubMember clubMember in clubMembers)
            {
                // Expire notification for user if exist
                _notificationService.ExpireNotificationsTypesForUser(clubMember.Practitioner.UserId, TemplateTypeConstants.UserAddedToClub);

                // Add notification to show user is new to club
                user = _userManager.FindByIdAsync(clubMember.Practitioner.UserId).Result;
                _notificationService.SendNotificationAsync(null, TemplateTypeConstants.UserAddedToClub, DateTime.Now, user, "", MessageStatusConstants.Amber, replacements, DateTime.Now.AddDays(14));
            }

            return true;
        }

        public bool AcceptNewClubLeaderRole(Guid clubId, Guid practitionerId, Guid clubSupportPractitionerId)
        {
            List<ClubLeader> clubLeaders = _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId).OrderBy(x => x.InsertedDate).ToList();
            ClubLeader newClubLeader = clubLeaders.Where(x => x.ClubId == clubId && x.IsActive == true && x.PractitionerId == practitionerId && !x.DateAccepted.HasValue).FirstOrDefault();
            ClubLeader oldClubLeader = clubLeaders.Where(x => x.ClubId == clubId && x.IsActive == true && x.DateAccepted.HasValue).OrderBy(x => x.DateAccepted).FirstOrDefault();

            // Set new club leader
            if (newClubLeader != null)
            {
                newClubLeader.DateAccepted = DateTime.Now;
                newClubLeader.IsActive = true;
                newClubLeader.UpdatedDate = DateTime.Now;
                newClubLeader.UpdatedBy = _applicationUserId;
                _clubLeaderRepo.Update(newClubLeader);
            }

            // Archive other club leader
            if (oldClubLeader != null)
            {
                oldClubLeader.UpdatedDate = DateTime.Now;
                oldClubLeader.UpdatedBy = _applicationUserId;
                oldClubLeader.IsActive = false;
                _clubLeaderRepo.Update(oldClubLeader);
            }

            // Assistant update
            if (clubSupportPractitionerId != Guid.Empty)
            {
                ChangeClubSupportRole(clubId, clubSupportPractitionerId);
            }

            return newClubLeader != null;
        }

        public bool RejectNewClubLeaderRole(Guid clubId, Guid practitionerId)
        {
            ClubLeader clubLeader = _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true && x.PractitionerId == practitionerId && !x.DateAccepted.HasValue).FirstOrDefault();
            if (clubLeader != null)
            {
                clubLeader.UpdatedDate = DateTime.Now;
                clubLeader.UpdatedBy = _applicationUserId;
                clubLeader.IsActive = false;
                clubLeader.DateAssigned = null;
                clubLeader.DateAccepted = null;
                _clubLeaderRepo.Update(clubLeader);
                return true;
            }
            return false;
        }

        public bool ChangeClubSupportRole(Guid clubId, Guid practitionerId)
        {
            if (practitionerId != Guid.Empty)
            {
                // First archive previous club support
                List<ClubSupport> clubSupports = _clubSupportRepo.GetAll().Where(x => x.ClubId == clubId && !x.IsActive).ToList();
                foreach (var item in clubSupports)
                {
                    item.IsActive = false;
                    item.UpdatedBy = _applicationUserId;
                    item.UpdatedDate = DateTime.Now;
                    _clubSupportRepo.Update(item);
                }

                ClubSupport clubSupport = _clubSupportRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.ClubId == clubId).FirstOrDefault();
                if (clubSupport == null)
                {
                    _clubSupportRepo.Insert(new ClubSupport()
                    {
                        Id = Guid.NewGuid(),
                        IsNewInSupportRole = true,
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId,
                        PractitionerId = practitionerId,
                        ClubId = clubId,
                        DateAssigned = DateTime.Now
                    });
                    return true;
                }
                
            }
            return false;
        }

        public Club AddNewClub(NewClubInput input)
        {
            Club newClub = new Club()
            {
                Id = Guid.NewGuid(),
                Name = input.Name,
                UserId = input.UserId,
                InsertedDate = DateTime.Now,
                UpdatedDate = DateTime.Now,
                UpdatedBy = _applicationUserId,
                IsActive = true
            };
            Club club = _clubRepo.Insert(newClub);

            List<ClubMember> newMembers = new List<ClubMember>();
            if (input.NewClubMembers.Count > 0)
            {
                foreach (var Id in input.NewClubMembers)
                {
                    newMembers.Add(new ClubMember
                    {
                        Id = Guid.NewGuid(),
                        IsActive = true,
                        InsertedDate = DateTime.Now,
                        UpdatedDate = DateTime.Now,
                        UpdatedBy = _applicationUserId,
                        ClubId = club.Id,
                        PractitionerId = new Guid(Id),
                        IsNewInClub = true,
                        DateClubJoined = DateTime.Now
                    });
                }
                _clubMemberRepo.InsertMany(newMembers);
            }

            // TODO! I think this should mark old club memberships as in active and create new club members!
            if (input.TransferredClubMembers.Count > 0)
            {
                ClubMember clubMember = new ClubMember();
                foreach (var Id in input.TransferredClubMembers)
                {
                    clubMember = _clubMemberRepo.GetAll().Where(x => x.PractitionerId.ToString() == Id).FirstOrDefault();

                    clubMember.IsNewInClub = true;
                    clubMember.ClubId = club.Id;
                    clubMember.DateClubJoined = DateTime.Now;
                    clubMember.UpdatedDate = DateTime.Now;
                    clubMember.UpdatedBy = _applicationUserId;
                    _clubMemberRepo.Update(clubMember);
                }
             }

            return club;
        }

        public bool SaveWelcomeMessage(Guid clubId, Guid practitionerId, string welcomeMessage, bool shareContactInfo)
        {
            ClubMember clubMember = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.PractitionerId == practitionerId).FirstOrDefault();
            if (clubMember != null)
            {
                clubMember.WelcomeMessage = welcomeMessage;
                clubMember.UpdatedDate = DateTime.Now;
                clubMember.UpdatedBy = _applicationUserId;
                clubMember.IsNewInClub = false;
                clubMember.ShareContactInfo = shareContactInfo;
                _clubMemberRepo.Update(clubMember);
                return true;
            }
            return false;
        }
        
        public bool UpdateNewMemberStatus(Guid clubId, Guid practitionerId)
        {
            ClubMember clubMember = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.PractitionerId == practitionerId).FirstOrDefault();
            if (clubMember != null)
            {
                clubMember.IsNewInClub = false;
                clubMember.UpdatedDate = DateTime.Now;
                clubMember.UpdatedBy = _applicationUserId;
                _clubMemberRepo.Update(clubMember);
                return true;
            }
            return false;
        }

        public List<CoachingClubBase> GetAllClubsForCoachSimple(string userId)
        {
            return _clubRepo
                .GetAll()
                .Where(x => x.UserId == userId && x.IsActive == true)
                .OrderBy(x => x.Name)
                .Select(club => new CoachingClubBase
                {
                    Id = club.Id,
                    Name = club.Name,
                    UserId = club.UserId,
                })
                .ToList();
        }

        public ActivityMeetRegular GetActivityMeetRegularDetails(Guid clubId, int month, int year)
        {
            ActivityMeetRegular activityMeetRegular = new ActivityMeetRegular();
            List<ActivityMeetRegularDetail> pastMeetings = new List<ActivityMeetRegularDetail>();
            List<ActivityMeetRegularDetail> upcomingMeetings = new List<ActivityMeetRegularDetail>();
            List<ClubUser> meetingParticipants = new List<ClubUser>();
            List<ClubUser> meetingAbsentees = new List<ClubUser>();
            ClubPointsLibrary libraryItem = new ClubPointsLibrary();

            Club club = _clubRepo.GetAll()
                .Where(x => x.Id == clubId)
                .Include(x => x.ClubPoints.Where(x => x.Year == year))
                .Include(x => x.ClubMembers.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubLeaders.Where(x => x.IsActive && x.DateAccepted.HasValue)).ThenInclude(x => x.Practitioner)
                .Include(x => x.ClubSupport.Where(x => x.IsActive)).ThenInclude(x => x.Practitioner)
                .FirstOrDefault();

            if (club?.League?.LeagueType?.Name == Constants.ClubSettings.name_purple)
            {
                libraryItem = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.meet_regularly && x.Type == Constants.ClubSettings.name_purple).FirstOrDefault();
            }
            else
            {
                libraryItem = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.meet_regularly && x.Type != Constants.ClubSettings.name_purple).FirstOrDefault();
            }

            List<ClubMeeting> allMeetings = _clubMeetingRepo.GetAll()
                .Where(x => x.ClubId == clubId && x.IsActive && x.MeetingDate.HasValue &&
                      x.MeetingDate.Value.Year == year &&
                      x.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting)
                .Include(x => x.ClubMeetingRegister.Where(x => x.IsActive))
                .ToList();

            var clubPoints = club.ClubPoints.Where(x => x.ClubPointsLibraryId == libraryItem.Id).Select(x => x.Points).Sum();

            if (month != 0)
            {
                clubPoints = club.ClubPoints.Where(x => x.Month == month && x.ClubPointsLibraryId == libraryItem.Id).Select(x => x.Points).Sum();
                allMeetings = allMeetings.Where(x => x.MeetingDate.Value.Month <= month).ToList();
            }
            
            activityMeetRegular.Points = clubPoints;
            activityMeetRegular.PointsColor = MetricsColorEnum.Error.ToString();
            
            // set the color for points
            if (activityMeetRegular.Points >= Constants.ClubSettings.warning_start_800 && activityMeetRegular.Points <= Constants.ClubSettings.warning_end_800)
            {
                activityMeetRegular.PointsColor = MetricsColorEnum.Warning.ToString();
            } 
            else if (activityMeetRegular.Points >= Constants.ClubSettings.success_start_800 && activityMeetRegular.Points <= Constants.ClubSettings.success_end_800)
            {
                activityMeetRegular.PointsColor = MetricsColorEnum.Success.ToString();
            }

            List<string> absentIds = new List<string>();
            List<string> participantIds = new List<string>();
            int totalAttended = 0;
            string meetingAttendanceColor = "";
            double meetingAttendancePerc = 0.0;
            // set meetings
            foreach (var item in allMeetings)
            {
                totalAttended = item.ClubMeetingRegister.Where(x => x.Attended && x.IsActive).Count();
                absentIds = item.ClubMeetingRegister.Where(x => x.Attended == false && x.IsActive).Select(x => x.PractitionerId.ToString()).ToList();
                meetingAttendanceColor = MetricsColorEnum.Error.ToString();
                meetingAttendancePerc = (totalAttended + absentIds.Count) == 0 ? 0 :((double)totalAttended / (double)(totalAttended+absentIds.Count)) * 100;

                if (meetingAttendancePerc >= 80)
                {
                    meetingAttendanceColor = MetricsColorEnum.Success.ToString();
                } else if (meetingAttendancePerc > 60 && meetingAttendancePerc <= 79) {
                    meetingAttendanceColor = MetricsColorEnum.Warning.ToString();
                }
                meetingParticipants = item.ClubMeetingRegister
                    .Where(x => x.Attended == true)
                    .Select(x => new ClubUser { UserId = x.Practitioner.UserId, FirstName = x.Practitioner.User.FirstName, Surname = x.Practitioner.User.Surname, ProfileImageUrl = x.Practitioner.User.ProfileImageUrl})
                    .OrderBy(x => x.FirstName).ToList();

                meetingAbsentees = item.ClubMeetingRegister
                    .Where(x => x.Attended == false)
                    .Select(x => new ClubUser { UserId = x.Practitioner.UserId, FirstName = x.Practitioner.User.FirstName, Surname = x.Practitioner.User.Surname, ProfileImageUrl = x.Practitioner.User.ProfileImageUrl })
                    .OrderBy(x => x.FirstName).ToList();
                
                if (item.MeetingDate <= DateTime.Now.Date)
                {
                    pastMeetings.Add(new ActivityMeetRegularDetail()
                    {
                        MeetingDate = (DateTime)item.MeetingDate,
                        MeetingAttendancePerc = Math.Round(meetingAttendancePerc, 0),
                        MeetingAttendanceColor = meetingAttendanceColor,
                        MeetingNotes = item.MeetingNotes,
                        MeetingParticipants = meetingParticipants,
                        MeetingAbsentees = meetingAbsentees,
                        Points = club.ClubPoints.Where(x => x.Month == item.MeetingDate.Value.Month && x.ClubPointsLibraryId == libraryItem.Id).Select(x => x.Points).FirstOrDefault()
                    });
                } else
                {
                    upcomingMeetings.Add(new ActivityMeetRegularDetail()
                    {
                        EventId = item.EventId,
                        Name = item.Name,
                        MeetingDate = (DateTime)item.MeetingDate,
                        MeetingAttendancePerc = Math.Round(meetingAttendancePerc, 0),
                        MeetingAttendanceColor = meetingAttendanceColor,
                        MeetingNotes = item.MeetingNotes,
                        MeetingParticipants = meetingParticipants,
                        MeetingAbsentees = meetingAbsentees,
                        Points = club.ClubPoints.Where(x => x.Month == item.MeetingDate.Value.Month && x.ClubPointsLibraryId == libraryItem.Id).Select(x => x.Points).FirstOrDefault()
                    });
                }
            }

            // get user ids to fetch calendar events
            List<string> allUserIds = new List<string>();
            allUserIds.AddRange(club.ClubLeaders.Select(x => x.Practitioner.UserId).Distinct());
            allUserIds.AddRange(club.ClubSupport.Select(x => x.Practitioner.UserId).Distinct());
            allUserIds = allUserIds.Distinct().ToList();

            // get linked event ids to exclude from upcoming meetings
            List<Guid> linkedEventIds = allMeetings.Where(x => x.EventId.HasValue).Select(x => (Guid)x.EventId).Distinct().ToList();

            upcomingMeetings = _calendarEventRepo.GetAll().Where(x => allUserIds.Contains(x.UserId) && !linkedEventIds.Contains(x.Id) &&
                                                                x.EventType == Constants.ClubSettings.calendar_club_monthly_meeting &&
                                                                x.Start.Date > DateTime.Now.Date)
                                                          .Select(x => new ActivityMeetRegularDetail { EventId = x.Id, Name = x.Name, MeetingNotes = x.Description, MeetingDate = x.Start, 
                                                                MeetingAbsentees = meetingAbsentees, MeetingParticipants = meetingParticipants})
                                                          .ToList();

            activityMeetRegular.PastMeetings = pastMeetings;
            activityMeetRegular.UpcomingMeetings = upcomingMeetings;
            
            return activityMeetRegular;
        }

        public ActivityBeCreative GetActivityBeCreativeDetails(Guid clubId)
        {
            DateTime today = DateTime.Now;
            List<DateTime> yearMonths = new List<DateTime>();
            ActivityBeCreative activityBeCreative = new ActivityBeCreative();
            activityBeCreative.MonthlyRecords = new List<ActivityBeCreativeDetail>();

            var club = _clubRepo.GetAll()
                .Where(x => x.Id == clubId && x.IsActive)
                .Include(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year && x.ClubPointsLibrary.Activity == Constants.ClubSettings.be_creative))
                .SingleOrDefault();

            if (club.LeagueId.HasValue)
            {
                int points = club.ClubPoints.Select(x => x.Points).Sum();
                activityBeCreative.Points = points;
                activityBeCreative.PointsColor = MetricsColorEnum.Error.ToString();
            
                if (activityBeCreative.Points >= Constants.ClubSettings.warning_start_800 && activityBeCreative.Points <= Constants.ClubSettings.warning_end_800)
                {
                    activityBeCreative.PointsColor = MetricsColorEnum.Warning.ToString();
                }
                else if (activityBeCreative.Points >= Constants.ClubSettings.success_start_800 && activityBeCreative.Points <= Constants.ClubSettings.success_end_800)
                {
                    activityBeCreative.PointsColor = MetricsColorEnum.Success.ToString();
                }
            }

            // Populate months for year
            for (int i = 1; i <= today.Month; i++)
            {
                if (i > 4 && i <= 12)
                {
                    yearMonths.Add(new DateTime(today.Year, i, 1));
                }
            }

            ClubActivityUpload clubBeCreative = new ClubActivityUpload();
            List<ClubActivityUpload> clubActivities = _clubActivityUploadRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive && x.Year == today.Year).ToList();
            string documentStatus = Constants.ClubSettings.not_completed;
            string documentColor = MetricsColorEnum.Error.ToString();
            IntegrationAudit documentSubmitted = new IntegrationAudit();
            foreach (DateTime date in yearMonths)
            {
                clubBeCreative = clubActivities.Where(x => x.Year == date.Year && x.Month == date.Month).FirstOrDefault();

                if (clubBeCreative == null)
                {
                    //i) if no image was submitted for the month, show red ""Not completed"" with 0 points - league or no league clubs
                    activityBeCreative.MonthlyRecords.Add(
                        new ActivityBeCreativeDetail()
                        {
                            MonthName = date.ToString("MMMM"),
                            DocumentStatusColor = MetricsColorEnum.Error.ToString(),
                            DocumentStatus = Constants.ClubSettings.not_completed,
                            Points = 0,
                            ImageRating = 0
                        }
                    );
                } 
                else
                {

                    if (club.LeagueId.HasValue)
                    {
                        if (clubBeCreative.ImageRating == 0)
                        {
                            //if the image was uploaded to Funda App but has not been scored yet, show ""Image uploaded, waiting for verification"", blue.
                            documentStatus = Constants.ClubSettings.document_waiting_verified;
                            documentColor = MetricsColorEnum.None.ToString();
                        } else if (clubBeCreative.ImageRating > 0 && clubBeCreative.ImageRating < 100)
                        {
                            //if the image was submitted but the score was less than 100, show ""Image incomplete"", amber, and the number of points awarded;
                            documentStatus = Constants.ClubSettings.document_in_complete;
                            documentColor = MetricsColorEnum.Warning.ToString();
                        }
                        else if (clubBeCreative.ImageRating >= 100)
                        {
                            //if the image was submitted and the club received 100 points for the item, show ""Image verified"", green;
                            documentStatus = Constants.ClubSettings.document_verified;
                            documentColor = MetricsColorEnum.Success.ToString();
                        }

                    } else
                    {
                        // green(if form in use case 14 was submitted) -"Images added"
                        documentStatus = Constants.ClubSettings.document_images_add;
                        documentColor = MetricsColorEnum.Success.ToString();
                    }

                    activityBeCreative.MonthlyRecords.Add(
                        new ActivityBeCreativeDetail()
                        {
                            MonthName = date.ToString("MMMM"),
                            Description = clubBeCreative?.Description,
                            DocumentName = clubBeCreative?.Document?.Name,
                            ImageApproved = clubBeCreative?.ImageApproved,
                            DocumentStatusColor = documentColor,
                            DocumentStatus = documentStatus,
                            Points = 0, // pending - will implemented when integration is done
                            ImageRating = clubBeCreative.ImageRating
                        }
                    );
                }
            }

            return activityBeCreative;
        }

        public ActivityHostFamilyDays GetActivityHostFamilyDetails(Guid clubId)
        {
            DateTime today = DateTime.Now;
            
            DateTime term1Start = new DateTime(today.Year, 01, 01);
            DateTime term1End = new DateTime(today.Year, 04, 30);

            DateTime term2Start = new DateTime(today.Year, 05, 01);
            DateTime term2End = new DateTime(today.Year, 07, 31);

            DateTime term3Start = new DateTime(today.Year, 08, 01);
            DateTime term3End = new DateTime(today.Year, 12, 31); // TODO: reset date after testing!!! SUPPRESS

            ActivityHostFamilyDays activityHostFamilyDays = new ActivityHostFamilyDays();
            List<ActivityHostFamilyDaysDetail> terms = new List<ActivityHostFamilyDaysDetail>
            {
                new ActivityHostFamilyDaysDetail() { TermNr = 1, TermName = "Term 1: January to April" },
                new ActivityHostFamilyDaysDetail() { TermNr = 2, TermName = "Term 2: May to July" },
                new ActivityHostFamilyDaysDetail() { TermNr = 3, TermName = "Term 3: August to October" }
            };

            int points = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.host_family_days).Select(x => x.Points).Sum();

            activityHostFamilyDays.Points = points;
            activityHostFamilyDays.PointsColor = MetricsColorEnum.Error.ToString();
            // set the color for points
            if (points > 0 && points <= 599)
            {
                activityHostFamilyDays.PointsColor = MetricsColorEnum.Warning.ToString();
            }
            else if (points > 599 && points <= 800)
            {
                activityHostFamilyDays.PointsColor = MetricsColorEnum.Success.ToString();
            }

            List<ClubMeeting> clubMeetings = _clubMeetingRepo.GetAll()
                .Where(x => x.ClubId == clubId && x.IsActive && x.MeetingDate.Value.Year == today.Year &&
                      (x.MeetingType.Name == Constants.ClubSettings.meeting_type_play_day ||
                      x.MeetingType.Name == Constants.ClubSettings.meeting_type_story_day ||
                      x.MeetingType.Name == Constants.ClubSettings.meeting_type_end_of_year_celebration ||
                      x.MeetingType.Name == Constants.ClubSettings.meeting_type_open_day ||
                      x.MeetingType.Name == Constants.ClubSettings.meeting_type_other))
                .OrderBy(x => x.MeetingDate).ToList();

            List<ClubActivityUpload> clubUploads = _clubActivityUploadRepo.GetAll()
               .Where(x => x.IsActive && x.ClubId == clubId &&
                      x.ClubActivityUploadType.Name == Constants.ClubSettings.upload_type_family_days &&
                      x.Year == today.Year).ToList();

            ActivityHostFamilyDaysDetail term = new ActivityHostFamilyDaysDetail();
            ClubActivityUpload clubActivityUpload;
            var documentStatus = "";
            var documentStatusColor = "";
            var termPoints = 0;
            foreach (var meeting in clubMeetings)
            {
                clubActivityUpload = clubUploads.Where(x => x.Month == meeting.MeetingDate.Value.Month && x.Year == meeting.MeetingDate.Value.Year).FirstOrDefault();
                documentStatus = clubActivityUpload != null ? "Attendance register uploaded" : "Not completed";
                documentStatusColor = clubActivityUpload != null ? MetricsColorEnum.Success.ToString() : MetricsColorEnum.Error.ToString();
                termPoints = clubActivityUpload != null ? 100 : 0;

                if (meeting.MeetingDate >= term1Start && meeting.MeetingDate <= term1End)
                {
                    term = terms.GetItemByIndex(0);
                    term.EventName = meeting.MeetingType.NormalizedName;
                    term.Description = meeting.MeetingNotes;
                    term.Points = termPoints;
                    term.DocumentStatus = documentStatus;
                    term.DocumentStatusColor = documentStatusColor;
                    term.MeetingParticipantsPractitionerIds = meeting.ClubMeetingRegister.Where(x => x.Attended && x.PractitionerId != null).Select(x => x.PractitionerId.Value).ToList();

                } 
                else if (meeting.MeetingDate >= term2Start && meeting.MeetingDate <= term2End)
                {
                    term = terms.GetItemByIndex(1);
                    term.EventName = meeting.MeetingType.NormalizedName;
                    term.Description = meeting.MeetingNotes;
                    term.Points = termPoints;
                    term.DocumentStatus = documentStatus;
                    term.DocumentStatusColor = documentStatusColor;
                }
                else if (meeting.MeetingDate >= term3Start && meeting.MeetingDate <= term3End)
                {
                    term = terms.GetItemByIndex(2);
                    term.EventName = meeting.MeetingType.NormalizedName;
                    term.Description = meeting.MeetingNotes;
                    term.Points = termPoints;
                    term.DocumentStatus = documentStatus;
                    term.DocumentStatusColor = documentStatusColor;
                }
            }
            activityHostFamilyDays.Terms = terms;
            return activityHostFamilyDays;
        }

        public ActivityLeaveNoOneBehind GetActivityLeaveNoOneBehindDetails(Guid clubId)
        {
            DateTime today = DateTime.Now;
            DateTime startOfYear = today.GetStartOfYear();
            DateTime endNovember = new DateTime(today.Year, 11, 30);
            DateTime prevYearStartDate = new DateTime(DateTime.Now.Year - 1, 11, 1);


            ActivityLeaveNoOneBehind activityLeaveNoOneBehind = new ActivityLeaveNoOneBehind();
            activityLeaveNoOneBehind.GreenUsers = new List<ClubUser>();
            activityLeaveNoOneBehind.RedUsers = new List<ClubUser>();
            activityLeaveNoOneBehind.OrangeUsers = new List<ClubUser>();
            activityLeaveNoOneBehind.BlueUsers = new List<ClubUser>();

            Club club = _clubRepo.GetAll()
                .Where(x => x.Id == clubId)
                .Include(x => x.ClubPoints.Where(x => x.Year == today.Year && x.ClubPointsLibrary.Activity == Constants.ClubSettings.leave_no_one_behind))
                .Include(x => x.ClubMembers.Where(x => x.IsActive))
                .Include(x => x.ClubLeaders.Where(x => x.IsActive && x.DateAccepted.HasValue))
                .Include(x => x.ClubSupport.Where(x => x.IsActive))
                .FirstOrDefault();

            // get all ids for pqa calculations
            List<Guid> allPractitionerIds = new List<Guid>();
            allPractitionerIds.AddRange(club.ClubMembers.Select(x => x.PractitionerId).ToList());
            allPractitionerIds.AddRange(club.ClubLeaders.Select(x => x.PractitionerId).ToList());
            allPractitionerIds.AddRange(club.ClubSupport.Select(x => x.PractitionerId).ToList());
            allPractitionerIds = allPractitionerIds.Distinct().ToList();

            List<Visit> allVisits = _visitRepo.GetAll()
                            .Where(x => allPractitionerIds.Contains((Guid)x.PractitionerId) && x.IsActive &&
                                   x.VisitType.Type == Constants.SSSettings.client_practitioner &&
                                   (x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 || x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1) &&
                                   ((x.Attended && x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= prevYearStartDate.Date) ||
                                   (!x.Attended && (x.PlannedVisitDate.Year == today.Year || x.DueDate.HasValue && x.DueDate.Value.Year == today.Year))))
                            .Include(x => x.PQARating)
                            .OrderByDescending(x => x.DueDate)
                            .ToList();

            // Points for the year
            activityLeaveNoOneBehind.Points = club.ClubPoints.Select(x => x.Points).Sum();
            activityLeaveNoOneBehind.PointsColor = MetricsColorEnum.Error.ToString();

            // set the color for points
            if (activityLeaveNoOneBehind.Points > 0 && activityLeaveNoOneBehind.Points <= 74)
            {
                activityLeaveNoOneBehind.PointsColor = MetricsColorEnum.Warning.ToString();
            }
            else if (activityLeaveNoOneBehind.Points > 75 && activityLeaveNoOneBehind.Points <= 100)
            {
                activityLeaveNoOneBehind.PointsColor = MetricsColorEnum.Success.ToString();
            }

            int totalPractitioners = allPractitionerIds.Count;
            var attended_visit = new Visit();
            var pending_visit = new Visit();

            var greenText = "";
            var orangeText = "";
            var redText = "";
            var blueText = "";
            ClubUser clubUser = new ClubUser();

            if (!club.LeagueId.HasValue)
            {
                greenText = "club members have green PQA or re-accreditation";
                orangeText = "club members have orange PQA or re-accreditation";
                redText = "club members have red PQA or re-accreditation";
                blueText = "club members have PQA or re-accreditation coming up later this year";

                foreach (var Id in allPractitionerIds)
                {

                    attended_visit = allVisits.Where(x => x.Attended && x.PractitionerId == Id &&
                                                     x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= prevYearStartDate.Date)
                                            .OrderByDescending(x => x.ActualVisitDate).FirstOrDefault();
                    // EC-1525 Comment out the deadline date for blue users for Kim to test
                    /*pending_visit = allVisits.Where(x => !x.Attended && x.PractitionerId == Id &&
                                                    (x.PlannedVisitDate.Date >= startOfYear.Date || x.DueDate.HasValue && x.DueDate.Value.Date >= startOfYear.Date) &&
                                                    (x.PlannedVisitDate.Date <= endNovember.Date || x.DueDate.HasValue && x.DueDate.Value.Date <= endNovember.Date))
                                            .OrderByDescending(x => x.DueDate).FirstOrDefault();*/
                    pending_visit = allVisits.Where(x => !x.Attended && x.PractitionerId == Id &&
                                                    (x.PlannedVisitDate.Date.Year >= today.Year || x.DueDate.HasValue && x.DueDate.Value.Year >= today.Year))
                                            .OrderByDescending(x => x.DueDate).FirstOrDefault();


                    if (attended_visit != null && attended_visit.PQARating != null)
                    {
                        clubUser = new ClubUser
                        {
                            UserId = attended_visit.Practitioner.UserId,
                            FirstName = attended_visit.Practitioner.User.FirstName,
                            Surname = attended_visit.Practitioner.User.Surname,
                            ProfileImageUrl = attended_visit.Practitioner.User.ProfileImageUrl
                        };

                        if (attended_visit.PQARating.OverallRatingColor == MetricsColorEnum.Success.ToString())
                        {
                            activityLeaveNoOneBehind.GreenUsers.Add(clubUser);
                        }
                        else if (attended_visit.PQARating.OverallRatingColor == MetricsColorEnum.Warning.ToString())
                        {
                            activityLeaveNoOneBehind.OrangeUsers.Add(clubUser);
                        }
                        else if (attended_visit.PQARating.OverallRatingColor == MetricsColorEnum.Error.ToString())
                        {
                            activityLeaveNoOneBehind.RedUsers.Add(clubUser);
                        }
                    }
                    if (pending_visit != null)
                    {
                        clubUser = new ClubUser
                        {
                            UserId = pending_visit.Practitioner.UserId,
                            FirstName = pending_visit.Practitioner.User.FirstName,
                            Surname = pending_visit.Practitioner.User.Surname,
                            ProfileImageUrl = pending_visit.Practitioner.User.ProfileImageUrl
                        };
                        activityLeaveNoOneBehind.BlueUsers.Add(clubUser);
                    }
                }
            }
            else
            {
                if (club.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                {
                    greenText = "club members have green re-accreditation ratings";
                    orangeText = "club members have orange re-accreditation ratings";
                    redText = "club members have red re-accreditation ratings";
                    blueText = "club members have re-accreditation ratings coming up later this year";

                    activityLeaveNoOneBehind.GreenUsers.AddRange(allVisits.Where(x => x.Attended &&
                                                    x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 &&
                                                    x.PQARating != null && x.PQARating.OverallRatingColor == MetricsColorEnum.Success.ToString() &&
                                                    x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Year == today.Year).Select(x => new ClubUser
                                                    {
                                                        UserId = x.Practitioner.UserId,
                                                        FirstName = x.Practitioner.User.FirstName,
                                                        Surname = x.Practitioner.User.Surname,
                                                        ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                    }).Distinct().ToList());

                    activityLeaveNoOneBehind.OrangeUsers.AddRange(allVisits.Where(x => x.Attended &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 &&
                                                        x.PQARating != null && x.PQARating.OverallRatingColor == MetricsColorEnum.Warning.ToString() &&
                                                        x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Year == today.Year).Select(x => new ClubUser
                                                        {
                                                            UserId = x.Practitioner.UserId,
                                                            FirstName = x.Practitioner.User.FirstName,
                                                            Surname = x.Practitioner.User.Surname,
                                                            ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                        }).Distinct().ToList());

                    activityLeaveNoOneBehind.RedUsers.AddRange(allVisits.Where(x => x.Attended &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 &&
                                                        x.PQARating != null && x.PQARating.OverallRatingColor == MetricsColorEnum.Error.ToString() &&
                                                        x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Year == today.Year).Select(x => new ClubUser
                                                        {
                                                            UserId = x.Practitioner.UserId,
                                                            FirstName = x.Practitioner.User.FirstName,
                                                            Surname = x.Practitioner.User.Surname,
                                                            ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                        }).Distinct().ToList());

                    // EC-1525 Comment out the deadline date for blue users for Kim to test
                    activityLeaveNoOneBehind.BlueUsers.AddRange(allVisits.Where(x => !x.Attended &&
                                                                        x.VisitType.Name == Constants.SSSettings.visitType_re_accreditation_1 &&
                                                                        (x.PlannedVisitDate.Year >= today.Year || x.DueDate.HasValue && x.DueDate.Value.Year >= today.Year)
                                                                        //(x.PlannedVisitDate.Date >= startOfYear || x.DueDate.HasValue && x.DueDate.Value.Date >= startOfYear) &&
                                                                        //(x.PlannedVisitDate.Date <= endNovember.Date || x.DueDate.HasValue && x.DueDate.Value.Date <= endNovember.Date)
                                                                        )
                                                                        .Select(x => new ClubUser
                                                                        {
                                                                            UserId = x.Practitioner.UserId,
                                                                            FirstName = x.Practitioner.User.FirstName,
                                                                            Surname = x.Practitioner.User.Surname,
                                                                            ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                                        }).Distinct().ToList());
                }
                else
                {
                    greenText = "club members have green PQAs";
                    orangeText = "club members have orange PQAs";
                    redText = "club members have red PQAs";
                    blueText = "club members have PQAs coming up later this year";


                    activityLeaveNoOneBehind.GreenUsers.AddRange(allVisits.Where(x => x.Attended &&
                                                    x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 &&
                                                    x.PQARating != null && x.PQARating.OverallRatingColor == MetricsColorEnum.Success.ToString() &&
                                                    x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= prevYearStartDate.Date).Select(x => new ClubUser
                                                    {
                                                        UserId = x.Practitioner.UserId,
                                                        FirstName = x.Practitioner.User.FirstName,
                                                        Surname = x.Practitioner.User.Surname,
                                                        ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                    }).Distinct().ToList());

                    activityLeaveNoOneBehind.OrangeUsers.AddRange(allVisits.Where(x => x.Attended &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 &&
                                                        x.PQARating != null && x.PQARating.OverallRatingColor == MetricsColorEnum.Warning.ToString() &&
                                                        x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= prevYearStartDate.Date).Select(x => new ClubUser
                                                        {
                                                            UserId = x.Practitioner.UserId,
                                                            FirstName = x.Practitioner.User.FirstName,
                                                            Surname = x.Practitioner.User.Surname,
                                                            ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                        }).Distinct().ToList());

                    activityLeaveNoOneBehind.RedUsers.AddRange(allVisits.Where(x => x.Attended &&
                                                        x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 &&
                                                        x.PQARating != null && x.PQARating.OverallRatingColor == MetricsColorEnum.Error.ToString() &&
                                                        x.ActualVisitDate.HasValue && x.ActualVisitDate.Value.Date >= prevYearStartDate.Date).Select(x => new ClubUser
                                                        {
                                                            UserId = x.Practitioner.UserId,
                                                            FirstName = x.Practitioner.User.FirstName,
                                                            Surname = x.Practitioner.User.Surname,
                                                            ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                        }).Distinct().ToList());

                    // EC-1525 Comment out the deadline date for blue users for Kim to test
                    activityLeaveNoOneBehind.BlueUsers.AddRange(allVisits.Where(x => !x.Attended &&
                                                                        x.VisitType.Name == Constants.SSSettings.visitType_pqa_visit_1 &&
                                                                        (x.PlannedVisitDate.Year >= today.Year || x.DueDate.HasValue && x.DueDate.Value.Year >= today.Year)
                                                                        //(x.PlannedVisitDate.Date >= startOfYear || x.DueDate.HasValue && x.DueDate.Value.Date >= startOfYear) &&
                                                                        //(x.PlannedVisitDate.Date <= endNovember.Date || x.DueDate.HasValue && x.DueDate.Value.Date <= endNovember.Date)
                                                                        )
                                                                        .Select(x => new ClubUser
                                                                        {
                                                                            UserId = x.Practitioner.UserId,
                                                                            FirstName = x.Practitioner.User.FirstName,
                                                                            Surname = x.Practitioner.User.Surname,
                                                                            ProfileImageUrl = x.Practitioner.User.ProfileImageUrl
                                                                        }).Distinct().ToList());
                }
            }

            if (totalPractitioners != 0)
            {
                activityLeaveNoOneBehind.GreenPerc = Math.Round((double)activityLeaveNoOneBehind.GreenUsers.Count / (double)totalPractitioners * 100);
                activityLeaveNoOneBehind.RedPerc = Math.Round((double)activityLeaveNoOneBehind.RedUsers.Count / (double)totalPractitioners * 100);
                activityLeaveNoOneBehind.OrangePerc = Math.Round((double)activityLeaveNoOneBehind.OrangeUsers.Count / (double)totalPractitioners * 100);
                activityLeaveNoOneBehind.BluePerc = Math.Round((double)activityLeaveNoOneBehind.BlueUsers.Count / (double)totalPractitioners * 100);
                activityLeaveNoOneBehind.GreenText = greenText;
                activityLeaveNoOneBehind.RedText = redText;
                activityLeaveNoOneBehind.OrangeText = orangeText;
                activityLeaveNoOneBehind.BlueText = blueText;
            }

            return activityLeaveNoOneBehind;
        }

        public ActivityChildAttendance GetActivityChildAttendance(Guid clubId)
        {
            DateTime today = DateTime.Now;
            ActivityChildAttendance activityChildAttendance = new ActivityChildAttendance();
            activityChildAttendance.MonthlyRecords = new List<ActivityChildAttendanceDetail>();

            List<ClubPoints> clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.capture_child_attendance).ToList();

            activityChildAttendance.Points = clubPoints.Select(x => x.Points).Sum();
            activityChildAttendance.PointsColor = MetricsColorEnum.Error.ToString();
            // set the color for points
            if (activityChildAttendance.Points >= Constants.ClubSettings.warning_start_800 && activityChildAttendance.Points <= Constants.ClubSettings.warning_end_800)
            {
                activityChildAttendance.PointsColor = MetricsColorEnum.Warning.ToString();
            }
            else if (activityChildAttendance.Points >= Constants.ClubSettings.success_start_800 && activityChildAttendance.Points <= Constants.ClubSettings.success_end_800)
            {
                activityChildAttendance.PointsColor = MetricsColorEnum.Success.ToString();
            }

            var months = clubPoints.Select(x => x.Month).Distinct().ToList();
            var monthPoints = 0;
            var percPoints = 0.0;
            var pointsColor = MetricsColorEnum.Error.ToString();
            foreach (var item in months)
            {
                monthPoints = clubPoints.Where(x => x.Month == item).Select(x => x.Points).Sum();
                percPoints = (double)monthPoints / (double)Constants.ClubSettings.success_end_800 * 100;

                if (percPoints > 0 && percPoints < 75)
                {
                    pointsColor = MetricsColorEnum.Warning.ToString();
                } else if (percPoints >= 75)
                {
                    pointsColor = MetricsColorEnum.Success.ToString();
                }

                activityChildAttendance.MonthlyRecords.Add(new ActivityChildAttendanceDetail()
                {
                    MonthName = new DateTime(today.Year, item, 1).ToString("MMM yyyy"),
                    Points = monthPoints,
                    PointsColor = pointsColor,
                });
            }

            return activityChildAttendance;
        }

        public ActivityChildProgress GetActivityChildProgress(Guid clubId)
        {
            DateTime today = DateTime.Now;
            ActivityChildProgress activityChildProgress = new ActivityChildProgress();
            activityChildProgress.MonthlyRecords = new List<ActivityChildProgressDetail>();

            List<ClubPoints> clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.child_progress_reports).ToList();

            activityChildProgress.Points = clubPoints.Select(x => x.Points).Sum();
            activityChildProgress.PointsColor = MetricsColorEnum.Error.ToString();
            // set the color for points
            if (activityChildProgress.Points >= 1 && activityChildProgress.Points <= 149)
            {
                activityChildProgress.PointsColor = MetricsColorEnum.Warning.ToString();
            }
            else if (activityChildProgress.Points >= 150)
            {
                activityChildProgress.PointsColor = MetricsColorEnum.Success.ToString();
            }

            var clubPointsLibraryItems = _clubPointsLibraryRepo.GetAll().Where(x => x.Activity == Constants.ClubSettings.child_progress_reports).ToList();
            var maxCaregiverTotal = clubPointsLibraryItems.Where(x => x.SubActivity == Constants.ClubSettings.sub_caregiver_meeting).Select(x => x.MaxPointsYearly).First();
            var maxProgressTotal = clubPointsLibraryItems.Where(x => x.SubActivity == Constants.ClubSettings.sub_progress_tracking).Select(x => x.MaxPointsYearly).First();

            // Rollup scores for November - any points earned from August on
            if (today > new DateTime(DateTime.Now.Year, 11, 1))
            {
                var caregiverPoints = clubPoints.Where(x => x.Month > 7 && x.ClubPointsLibrary.SubActivity == Constants.ClubSettings.sub_caregiver_meeting).Select(x => x.Points).Sum();
                var progressPoints = clubPoints.Where(x => x.Month > 7 && x.ClubPointsLibrary.SubActivity == Constants.ClubSettings.sub_progress_tracking).Select(x => x.Points).Sum();

                activityChildProgress.MonthlyRecords.Add(new ActivityChildProgressDetail()
                {
                    MonthName = new DateTime(today.Year, 11, 1).ToString("MMMM") + " reports",
                    ProgressPoints = progressPoints,
                    ProgressPerc = (int)Math.Round(progressPoints / (double)maxProgressTotal * 100),
                    ProgressPointsColor = progressPoints == 0
                        ? MetricsColorEnum.Error.ToString()
                        : progressPoints < 38
                            ? MetricsColorEnum.Warning.ToString()
                            : MetricsColorEnum.Success.ToString(),

                    CaregiverPoints = caregiverPoints,
                    CaregiverPerc = (int)Math.Round(caregiverPoints / (double)maxCaregiverTotal * 100),
                    CaregiverPointsColor = caregiverPoints == 0
                        ? MetricsColorEnum.Error.ToString()
                        : caregiverPoints < 38
                            ? MetricsColorEnum.Warning.ToString()
                            : MetricsColorEnum.Success.ToString()
                });
            }

            // Rollup scores for June Section, any points up until 31 July
            if (today > new DateTime(DateTime.Now.Year, 4, 1))
            {
                var caregiverPoints = clubPoints.Where(x => x.Month < 8 && x.ClubPointsLibrary.SubActivity == Constants.ClubSettings.sub_caregiver_meeting).Select(x => x.Points).Sum();
                var progressPoints = clubPoints.Where(x => x.Month < 8 && x.ClubPointsLibrary.SubActivity == Constants.ClubSettings.sub_progress_tracking).Select(x => x.Points).Sum();

                activityChildProgress.MonthlyRecords.Add(new ActivityChildProgressDetail()
                {
                    MonthName = new DateTime(today.Year, 6, 1).ToString("MMMM") + " reports",
                    ProgressPoints = progressPoints,
                    ProgressPerc = (int)Math.Round(progressPoints / (double)maxProgressTotal * 100),
                    ProgressPointsColor = progressPoints == 0
                        ? MetricsColorEnum.Error.ToString()
                        : progressPoints < 38
                            ? MetricsColorEnum.Warning.ToString()
                            : MetricsColorEnum.Success.ToString(),

                    CaregiverPoints = caregiverPoints,
                    CaregiverPerc = (int)Math.Round(caregiverPoints / (double)maxCaregiverTotal * 100),
                    CaregiverPointsColor = caregiverPoints == 0
                        ? MetricsColorEnum.Error.ToString()
                        : caregiverPoints < 38
                            ? MetricsColorEnum.Warning.ToString()
                            : MetricsColorEnum.Success.ToString()
                });
            }

            return activityChildProgress;
        }

        public DetailClubModel GetClubForUser(string userId)
        {
            // Get practitioner since we need the practitioner id (TODO remove this once we are set up to use userId everywhere)
            var practitioner = _practitionerRepo.GetByUserId(userId);

            var clubMembership = _clubMemberRepo.GetAll()
                .Where(x => x.PractitionerId == practitioner.Id && x.IsActive) 
                .FirstOrDefault();

            if (clubMembership == null)
            {
                return null;
            }

            return GetClubById(clubMembership.Club.Id);
        }

        public DetailClubModel GetClubById(Guid clubId)
        {
            var club = _clubRepo.GetAll()
                .Where(x => x.Id == clubId && x.IsActive) // Do we need to check the club is active too?
                //Points
                .Include(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year))
                //League
                .Include(x => x.League)
                .ThenInclude(x => x.LeagueType)
                //Club Members
                .Include(x => x.ClubMembers.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                //Club leaders
                .Include(x => x.ClubLeaders.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                // Club Support
                .Include(x => x.ClubSupport.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                .FirstOrDefault();

            if (club == null) return null;

            var coach = _coachRepo.GetAll().Include(x => x.User).First(x => x.UserId == club.UserId);

            // Get points total for club
            var pointsTotal = club.ClubPoints.Select(x => x.Points).Sum();

            var maxPointsTotal = club.League == null
                ? 0
                : club.League?.LeagueType?.Name == Constants.ClubSettings.name_purple
                    ? Constants.ClubSettings.purple_club_max_points
                    : Constants.ClubSettings.non_purple_club_max_points;

            var clubsInLeague = 0;
            if (club.LeagueId.HasValue)
            {
                clubsInLeague = _clubRepo.GetAll().Where(x => x.LeagueId == club.LeagueId).Count();
            }

            var rank = GetClubLeagueRankPosition(club, DateTime.Now);

            return new DetailClubModel(
                club, 
                coach,
                pointsTotal, 
                maxPointsTotal,
                rank,
                clubsInLeague,
                GetTasksForClub(club, rank, pointsTotal, maxPointsTotal),
                GetClubActivities(club, DateTime.Now.Year));
        }

        public IEnumerable<DetailClubModel> GetClubsForCoach(string coachUserId)
        {
            var leaguesForCoach = GetLeaguesForCoach(coachUserId);

            var clubs = _clubRepo.GetAll()
                .Where(x => x.UserId == coachUserId && x.IsActive) // Do we need to check the club is active too?
                //Points
                .Include(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year))
                //League
                .Include(x => x.League)
                .ThenInclude(x => x.LeagueType)
                //Club Members
                .Include(x => x.ClubMembers.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                //Club leaders
                .Include(x => x.ClubLeaders.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                // Club Support
                .Include(x => x.ClubSupport.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                .AsNoTracking()
                .ToList();

            var coach = _coachRepo.GetAll().Include(x => x.User).First(x => x.UserId == coachUserId);

            foreach (var club in clubs)
            {
                // Get points total for club
                var pointsTotal = club.ClubPoints.Select(x => x.Points).Sum();

                var maxPointsTotal = club.League == null
                    ? 0
                    : club.League?.LeagueType?.Name == Constants.ClubSettings.name_purple
                        ? Constants.ClubSettings.purple_club_max_points
                        : Constants.ClubSettings.non_purple_club_max_points;

                // Rank
                var rank = 0;
                var clubsInLeague = 0;
                if (club.LeagueId != null)
                {
                    var league = leaguesForCoach.Where(x => x.Id == club.LeagueId).FirstOrDefault();
                    rank = league.Clubs.First(x => x.ClubId == club.Id).LeagueRank;
                    clubsInLeague = league.Clubs.Count();
                }

                yield return new DetailClubModel(
                    club,
                    coach,
                    pointsTotal,
                    maxPointsTotal,
                    rank,
                    clubsInLeague,
                    GetTasksForClub(club, rank, pointsTotal, maxPointsTotal),
                    club.League != null ? GetClubActivities(club, DateTime.Now.Year) : new List<ClubActivity>());
            }
        }

        public IEnumerable<LeagueClubsModel> GetLeaguesForCoach(string coachUserId)
        {
            var leaguesForCoach = _clubRepo.GetAll()
                .Where(x => x.UserId == coachUserId && x.LeagueId != null)
                .Select(x => x.LeagueId.Value)
                .Distinct()
                .ToList();

            var clubsForCoach = _clubRepo.GetAll()
                .Where(x => x.LeagueId.HasValue && leaguesForCoach.Contains(x.LeagueId.Value))
                .Include(x => x.League)
                .Include(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year))
                .Include(x => x.User)
                .ToList();

            foreach(var league in clubsForCoach.Select(x => x.League).Distinct())
            {
                var clubs = clubsForCoach.Where(x => x.LeagueId == league.Id);
                yield return MapToLeagueClubsModel(league, clubs);
            }
        }

        public LeagueClubsModel GetLeagueForUser(string userId)
        {
            var practitioner = _practitionerRepo.GetByUserId(userId);
            var userLeague = _clubMemberRepo.GetAll()
                .Where(x => x.PractitionerId == practitioner.Id)
                .Include(x => x.Club.League.LeagueType)
                .Select(x => x.Club.League)
                .FirstOrDefault();

            var clubs = _clubRepo.GetAll()
               .Where(x => x.LeagueId == userLeague.Id && x.IsActive)
               //Points
               .Include(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year))
               .ToList();

            return MapToLeagueClubsModel(userLeague, clubs);
        }

        private LeagueClubsModel MapToLeagueClubsModel(League league, IEnumerable<Club> clubs)
        {
            var leagueModel = new LeagueClubsModel
            {
                Id = league.Id,
                Name = league.Name,
                LeagueTypeId = league.LeagueTypeId,
                LeagueTypeName = league.LeagueType.Name,
                Clubs = new List<ClubPointsSummaryModel>()
            };

            foreach (var club in clubs)
            {
                // Get points total for club
                var pointsTotal = club.ClubPoints.Select(x => x.Points).Sum();

                leagueModel.Clubs.Add(
                    new ClubPointsSummaryModel()
                    {
                        ClubId = club.Id,
                        ClubName = club.Name,
                        PointsTotal = pointsTotal,
                        CoachName = $"{club.User.FirstName} {club.User.Surname}",
                        LeagueRank = 0
                    });
            }

            leagueModel.Clubs.Sort(CompareClubsByPoints);

            // Set league ranks, keeping highest rank for all that have equal points
            leagueModel.Clubs[0].LeagueRank = 1;
            for (int i = 1; i < leagueModel.Clubs.Count; i++)
            {
                if (leagueModel.Clubs[i].PointsTotal == leagueModel.Clubs[i - 1].PointsTotal)
                {
                    leagueModel.Clubs[i].LeagueRank = leagueModel.Clubs[i - 1].LeagueRank;
                }
                else
                {
                    leagueModel.Clubs[i].LeagueRank = i + 1;
                }
            }

            return leagueModel;
        }

        private List<IssueTask> GetTasksForClub(Club club, int rank, int pointsTotal, int maxPointsTotal)
        {
            var prevMonth = DateTime.Now.AddMonths(-1);
            var monthName = prevMonth.ToString("MMM");

            var tasks = new List<IssueTask>();
            var secondaryText = "";
            var secondaryTextColor = "";
            var secondaryDescription = "";

            // Get meeting attendance details for last month
            var attendance = 0.0;
            int totalMembers = club.ClubMembers.Count();
            var attendanceRecords = _clubMeetingRegisterRepo.GetAll().Where(x =>
                x.ClubMeeting.ClubId == club.Id &&
                (x.ClubMeeting.MeetingDate.HasValue && x.ClubMeeting.MeetingDate.Value.Year == prevMonth.Year) &&
                (x.ClubMeeting.MeetingDate.HasValue && x.ClubMeeting.MeetingDate.Value.Month == prevMonth.Month) &&
                x.ClubMeeting.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting &&
                x.IsActive == true).Select(x => new { x.PractitionerId, x.Attended }).ToList();

            var hasAttendanceRegister = attendanceRecords.Any();
            var totalAttended = attendanceRecords.Where(x => x.Attended).Select(x => x.PractitionerId).Distinct().Count();

            if (totalMembers > 0)
            {
                attendance = ((double)totalAttended / (double)totalMembers) * 100;
            }

            // meetings
            DateTime past3Months = DateTime.Now.AddMonths(-3);
            List<ClubMeeting> clubMeetings = _clubMeetingRepo.GetAll().Where(x => x.ClubId == club.Id && x.MeetingDate.Value.Year == DateTime.Now.Year &&
                                                                             x.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting)
                                                                      .OrderBy(x => x.MeetingDate).ToList();

            DateTime lastCoachMeetingDate = clubMeetings.Where(x => x.CoachAttended == true).Select(x => (DateTime)x.MeetingDate).LastOrDefault();
            int missedCoachMeetings = clubMeetings.Where(x => x.MeetingDate.Value.Date >= past3Months.Date && x.MeetingDate.Value.Date <= DateTime.Now.Date && x.CoachAttended == false).Count();

            // Get list of user ids for club to fetch club calendar events
            List<string> userIds = new List<string>();
            userIds.AddRange(club.ClubSupport.Where(x => x.IsActive).Select(x => x?.Practitioner.UserId).ToList());
            userIds.AddRange(club.ClubLeaders.Where(x => x.IsActive).Select(x => x?.Practitioner.UserId).ToList());
            userIds = userIds.Distinct().ToList();

            List<CalendarEvent> clubCalendarEvents = _calendarEventRepo.GetAll().Where(x => x.EventType == Constants.ClubSettings.calendar_club_monthly_meeting &&
                                                                                      x.Start.Year == DateTime.Now.Year &&
                                                                                      userIds.Contains(x.UserId) &&
                                                                                      x.IsActive).OrderBy(x => x.Start).ToList();

            // Priority 16 - Club not in league->show this if the club is not currently assigned to a league(acc.to SmartLink);
            if (club.LeagueId != null)
            {
                secondaryText = Constants.ClubSettings.club_not_in_league;
                secondaryTextColor = MetricsColorEnum.None.ToString();
            }

            // Priority 15 - Purple club->show if the club is a ""purple club""(acc.to SmartLink)
            if (club.LeagueId != null && club.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                secondaryText = Constants.ClubSettings.club_purple;
                secondaryTextColor = MetricsColorEnum.None.ToString();
            }

            // Priority 14 - Top of the league! ->show this if the club has position #1 in the league they are in.
            if (rank == 1)
            {
                secondaryText = Constants.ClubSettings.top_of_the_league;
                secondaryTextColor = MetricsColorEnum.Success.ToString();
            }

            // Priority 13 - X % club attendance in Nov(green)->show if the club's meeting attendance was 80% or more in the previous month;
            if (attendance >= 80)
            {
                secondaryText = $"{attendance} {Constants.ClubSettings.club_attendance} {monthName}";
                secondaryTextColor = MetricsColorEnum.Success.ToString();
            }

            var percPointsEarned = Math.Round((double)pointsTotal / (double)maxPointsTotal * 100, 0);
            // Priority 12 - X points earned in Nov(green)->show if the club earned 80 % or more of the monthly max points for the club (see club points tab for detail) ;
            if (club.LeagueId != null && percPointsEarned >= 80)
            {
                secondaryText = $"{percPointsEarned} {Constants.ClubSettings.points_earned} {monthName}";
                secondaryTextColor = MetricsColorEnum.Success.ToString();
            }

            // Priority 11 - New club -> show if the club was created within the past 3 months
            DateTime threeMonthsBack = DateTime.Now.AddMonths(-3);
            if (club.InsertedDate.Date >= threeMonthsBack.Date && club.InsertedDate.Date <= DateTime.Now.Date)
            {
                secondaryText = Constants.ClubSettings.new_club;
                secondaryTextColor = MetricsColorEnum.Success.ToString();
            }

            // Priority 10 - X % club attendance in Nov(amber)->show if the club's meeting attendance was 60 to 79%, inclusive in the previous month;
            if (attendance >= 60 && attendance < 80)
            {
                secondaryText = $"{attendance} {Constants.ClubSettings.club_attendance} {monthName}";
                secondaryTextColor = MetricsColorEnum.Warning.ToString();
                secondaryDescription = Constants.ClubSettings.contact_club_members;
            }
            
            // Priority 9 - X points earned in Nov(amber)->show if the club earned less than 80 % of the max points for the club (see club points tab for detail) ;
            if (club.LeagueId != null && percPointsEarned < 80)
            {
                secondaryText = $"{percPointsEarned} {Constants.ClubSettings.points_earned} {monthName}";
                secondaryTextColor = MetricsColorEnum.Warning.ToString();
            }

            // Priority 8 - 2 Jan, Attend club meeting->show if the coach has not attended a club meeting for the club in 3 months
            if (clubMeetings.Count > 2 && missedCoachMeetings == 3)
            {
                secondaryText = $"{lastCoachMeetingDate}{Constants.ClubSettings.coach_meeting_attended}";
                secondaryTextColor = MetricsColorEnum.Warning.ToString();
            }

            // Priority 7
            //30 Jan, Attend first club meeting -> show if there is an upcoming first club meeting is scheduled in Funda App for sometime within the next 30 day;
            //show if there has never previously been a club meeting hosted by this club; 30 Jan = the date the first meeting is scheduled for (is this possible ? we can restrict this only to clubs that were created within Funda App;
            //if the club was created and a meeting was scheduled for a future date; then this secondary text becomes relevant)
            if ((clubMeetings.Count > 0) || (clubCalendarEvents.Count > 0))
            {
                var firstScheduledMeeting = clubCalendarEvents.Count != 0 ? clubCalendarEvents.First() : null;
                var next30Days = DateTime.Now.AddDays(30);

                // show if there is an upcoming first club meeting is scheduled in Funda App for sometime within the next 30 day;  
                if (firstScheduledMeeting?.Start.Date <= next30Days)
                {
                    secondaryText = $"{firstScheduledMeeting.Start.ToString("d MMM")}{Constants.ClubSettings.coach_attend_first_meeting}";
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                }

                //show if there has never previously been a club meeting hosted by this club
                if (clubMeetings.Count == 0 && firstScheduledMeeting != null)
                {
                    secondaryText = $"{firstScheduledMeeting.Start.ToString("d MMM")}{Constants.ClubSettings.coach_attend_first_meeting}";
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                }

                //if the club was created and a meeting was scheduled for a future date; then this secondary text becomes relevant)
                if (clubMeetings.Count == 0 && clubCalendarEvents.Count != 0 && firstScheduledMeeting.Start > DateTime.Now)
                {
                    secondaryText = $"{firstScheduledMeeting.Start.ToString("d MMM")}{Constants.ClubSettings.coach_attend_first_meeting}";
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                }
            }

            // Priority 6 - X % club attendance in Nov(red)->show if the club's meeting attendance was less than 60% in the previous month
            if (attendance < 60)
            {
                secondaryText = $"{attendance} {Constants.ClubSettings.club_attendance} {monthName}";
                secondaryTextColor = MetricsColorEnum.Error.ToString();
                secondaryDescription = Constants.ClubSettings.contact_club_members;
            }

            // Priority 5 - Missing club meeting register->attendance register was not submitted for the previous month
            if (!hasAttendanceRegister)
            {
                secondaryText = Constants.ClubSettings.missing_register;
                secondaryTextColor = MetricsColorEnum.Error.ToString();
                secondaryDescription = Constants.ClubSettings.contact_club_leader;
            }

            var activeClubLeader = club.ClubLeaders.FirstOrDefault(x => x.IsActive && x.DateAccepted.HasValue && x.DateAssigned.HasValue);
            // Priority 4 - Choose a new club leader->If a practitioner has been a club leader of the club for more than 6 months
            if (activeClubLeader != null)
            {
                var clubLeaderLengthDate = activeClubLeader.DateAccepted.Value.AddMonths(6);
                if (DateTime.Now.Date >= clubLeaderLengthDate.Date)
                {
                    secondaryText = Constants.ClubSettings.choose_club_leader;
                    secondaryTextColor = MetricsColorEnum.Warning.ToString();
                    secondaryDescription = activeClubLeader.Practitioner.User.FirstName + Constants.ClubSettings.club_leader_months;
                }
            }

            // Priority 3 - Too many club members -> show if there are more than 17 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
            if (club.ClubMembers.Count() > 17)
            {
                secondaryText = Constants.ClubSettings.too_many_club_members;
                secondaryTextColor = MetricsColorEnum.Error.ToString();
                secondaryDescription = Constants.ClubSettings.create_club;
            }

            // Priority 2 - Not enough club members->show if there are less than 4 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
            if (club.ClubMembers.Count() < 4)
            {
                secondaryText = Constants.ClubSettings.not_enough_club_members;
                secondaryTextColor = MetricsColorEnum.Error.ToString();
                secondaryDescription = Constants.ClubSettings.add_members;
            }
            
            // Priority 1 - No club leader->IF the club does not have a club leader assigned
            if (activeClubLeader == null)
            {
                secondaryText = Constants.ClubSettings.no_club_leader;
                secondaryTextColor = MetricsColorEnum.Error.ToString();
                secondaryDescription = Constants.ClubSettings.assign_club_leader;
            }
            else
            {
                var pendingClubLeader = club.ClubLeaders.FirstOrDefault(x => x.IsActive && !x.DateAccepted.HasValue && x.DateAssigned.HasValue);
                if (pendingClubLeader != null)
                {
                    secondaryText = Constants.ClubSettings.not_accepted_club_leader;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                    secondaryDescription = Constants.ClubSettings.contact_club_leader_name + pendingClubLeader.Practitioner.User.FirstName;
                }
            }
            // Do we need to return the attendance also as with previous function?
            // Only one priority can be shipped to front-end
            tasks.Add(new IssueTask()
            {
                SecondaryText = secondaryText,
                SecondaryTextColor = secondaryTextColor,
                SecondaryDescription = secondaryDescription
            });

            return tasks;
        }

        private List<ClubActivity> GetClubActivities(Club club, int year)
        {
            var clubActivities = new List<ClubActivity>();

            if (club.League != null) { 
                
                var activities = _clubPointsLibraryRepo.GetAll().OrderBy(x => x.Activity).ToList();
                var clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == club.Id && x.Year == year).ToList();
            
                if (club.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                {
                    activities = activities.Where(x => x.Type == Constants.ClubSettings.name_purple).OrderBy(x => x.Activity).ToList();
                    foreach (ClubPointsLibrary pl in activities)
                    {
                        var points = clubPoints.Where(x => x.ClubPointsLibraryId == pl.Id).Select(x => x.Points).Sum();
                        clubActivities.Add(new ClubActivity() { Name = pl.Activity, Points = points });
                    }
                }
                else
                {
                    activities = activities.Where(x => x.Type != Constants.ClubSettings.name_purple).OrderBy(x => x.Activity).ToList();
                    foreach (ClubPointsLibrary pl in activities)
                    {
                        var points = clubPoints.Where(x => x.ClubPointsLibraryId == pl.Id).Select(x => x.Points).Sum();
                        clubActivities.Add(new ClubActivity() { Name = pl.Activity, Points = points });
                    }
                }
            }

            return clubActivities;
        }

        public bool AddBeCreativeActivity(BeCreativeUpload input)
        {
            string fileName = input.DateUploaded.Date.ToString("MMM_yyyy") + "_be_creative_" + input.ClubId + input.FileType;
            DocumentModel documentModel = new DocumentModel()
            {
                Reference = input.ImageBase64,
                FileName = fileName,
                UserId = _applicationUserId,
                CreatedUserId = _applicationUserId
            };
            Document document = _documentManager.SaveActivityUploadDocument(documentModel).Result;
            if (document != null)
            {
                ClubActivityUploadType uploadType = _clubActivityUploadTypeRepo.GetAll().Where(x => x.Name == Constants.ClubSettings.upload_type_be_creative).FirstOrDefault();
                ClubActivityUpload uploadedRecord = _clubActivityUploadRepo.Insert(new ClubActivityUpload()
                                                                                    {
                                                                                        Id = Guid.NewGuid(),
                                                                                        IsActive = true,
                                                                                        InsertedDate = DateTime.Now,
                                                                                        UpdatedDate = DateTime.Now,
                                                                                        UpdatedBy = _applicationUserId,
                                                                                        ClubId = input.ClubId,
                                                                                        Description = input.Description,
                                                                                        DocumentId = document.Id,
                                                                                        ClubActivityUploadTypeId = uploadType.Id,
                                                                                        ImageApproved = false,
                                                                                        Month = input.DateUploaded.Month,
                                                                                        Year = input.DateUploaded.Year
                                                                                    });
                Club club = _clubRepo.GetById(input.ClubId);
                if (club.LeagueId.HasValue)
                {
                    // Add integration record
                    _integrationAuditRepo.Insert(new IntegrationAudit()
                    {
                        ChangeType = "Insert",
                        Entity = "ClubActivityUpload",
                        UserId = _applicationUserId,
                        RelatedId = uploadedRecord.Id.ToString(),
                        TenantId = TenantExecutionContext.Tenant.Id
                    });

                }
                return true;
            }

            return false;
        }

        // Called from PersonnelServices
        public void ArchiveClubUser(Guid practitionerId)
        {
            var clubMemberships = _clubMemberRepo.GetAll().Where(x => x.PractitionerId == practitionerId).ToList();
            foreach (var membership in clubMemberships)
            {
                membership.IsActive = false;
                membership.UpdatedBy = _applicationUserId;
                membership.UpdatedDate = DateTime.Now;
                _clubMemberRepo.Update(membership);
            }

            var clubLeaderships = _clubLeaderRepo.GetAll().Where(x => x.PractitionerId == practitionerId).ToList();
            foreach (var membership in clubLeaderships)
            {
                membership.IsActive = false;
                membership.UpdatedBy = _applicationUserId;
                membership.UpdatedDate = DateTime.Now;
                _clubLeaderRepo.Update(membership);
            }

            var clubSupportRoles = _clubSupportRepo.GetAll().Where(x => x.PractitionerId == practitionerId).ToList();
            foreach (var membership in clubSupportRoles)
            {
                membership.IsActive = false;
                membership.UpdatedBy = _applicationUserId;
                membership.UpdatedDate = DateTime.Now;
                _clubSupportRepo.Update(membership);
            }
        }

        public ClubSupport UpdateClubSupportStatus(Guid practitionerId)
        {
            var clubSupport = _clubSupportRepo.GetAll().Where(x => x.PractitionerId == practitionerId).FirstOrDefault();

            if (clubSupport == null)
            {
                return null;
            }

            clubSupport.IsNewInSupportRole = false;
            clubSupport.UpdatedBy = _applicationUserId;
            clubSupport.UpdatedDate = DateTime.Now;
            return _clubSupportRepo.Update(clubSupport);
        }

        private static int CompareClubsByPoints(ClubPointsSummaryModel x, ClubPointsSummaryModel y)
        {
            if (x.PointsTotal == y.PointsTotal)
            {
                return 0;
            }
            if (x.PointsTotal > y.PointsTotal)
            {
                return -1;
            }
            return 1;
        }
    }
}
