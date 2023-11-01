using AngleSharp.Common;
using EcdLink.Api.CoreApi.GraphApi.Models;
using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using EcdLink.Api.CoreApi.Managers;
using ECDLink.Abstractrions.Constants;
using ECDLink.Abstractrions.Enums;
using ECDLink.Api.CoreApi.Services.Interfaces;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer;
using ECDLink.DataAccessLayer.Entities;
using ECDLink.DataAccessLayer.Entities.Clubs;
using ECDLink.DataAccessLayer.Entities.Documents;
using ECDLink.DataAccessLayer.Entities.Leagues;
using ECDLink.DataAccessLayer.Entities.Notifications;
using ECDLink.DataAccessLayer.Entities.Users;
using ECDLink.DataAccessLayer.Entities.Users.Mapping;
using ECDLink.DataAccessLayer.Repositories.Factories;
using ECDLink.DataAccessLayer.Repositories.Generic.Base;
using ECDLink.Security.Extensions;
using HotChocolate;
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
                CoachAttended = input.CoachAttend == null ? false : true
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

            // Add club points if meeting is not in future
            if (meetingType == Constants.ClubSettings.meeting_type_club_meeting && club.LeagueId != null)
            {
                if (clubMeeting.MeetingDate.HasValue && clubMeeting.MeetingDate.Value.Date <= DateTime.Now.Date)
                {
                    _pointsEngineService.CalculateMeetRegularly(input.ClubId, _applicationUserId, DateTime.Now);
                }
            }
            return clubMeeting;
        }

        public bool IsClubLeader(Guid practitionerId)
        {
            ClubLeader clubLeader = _clubLeaderRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive && x.DateAccepted.HasValue).FirstOrDefault();
            return clubLeader == null? false: true;
        }

        public bool IsClubSupport(Guid practitionerId)
        {
            ClubSupport clubSupport = _clubSupportRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive && x.DateAccepted.HasValue).FirstOrDefault();
            return clubSupport == null ? false : true;
        }

        public List<ClubLeader> GetLeadersForClub(Guid clubId)
        {
            return _clubLeaderRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive).OrderBy(x => x.DateAssigned).ToList();
        }

        public ClubSupport GetSupportForClub(Guid clubId)
        {
            return _clubSupportRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive && x.DateAccepted.HasValue).FirstOrDefault();
        }

        public ClubMember GetClubForPractitioner(Guid practitionerId)
        {
            return _clubMemberRepo.GetAll().Where(x => x.PractitionerId == practitionerId && x.IsActive == true).Include(x => x.Club).FirstOrDefault();
        }

        private Coach GetCoachForClub(string userId)
        {
            return _coachRepo.GetByUserId(userId);
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

        private int GetClubEarningsForYear(Guid clubId, DateTime date)
        {
            return _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId && x.Year == date.Year).Select(x => x.Points).Sum();
            
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

        public double GetClubAttendancePercForMonth(Guid clubId, DateTime date)
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
            ChangeClubSupportRole(clubId, clubSupportPractitionerId);

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

        public bool SaveWelcomeMessage(Guid clubId, Guid practitionerId, string welcomeMessage)
        {
            ClubMember clubMember = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.PractitionerId == practitionerId).FirstOrDefault();
            if (clubMember != null)
            {
                clubMember.WelcomeMessage = welcomeMessage;
                clubMember.UpdatedDate = DateTime.Now;
                clubMember.UpdatedBy = _applicationUserId;
                clubMember.IsNewInClub = false;
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

        public List<LeagueClub> GetAllLeagues(string userId)
        {
            List<LeagueClub> leagueClubs = new List<LeagueClub>();

            // Get all league ids in use - must be restricted
            List<Guid?> activeLeagueIds = _clubRepo.GetAll().Where(x => x.IsActive && x.LeagueId != null && x.UserId != null).Select(x => x.LeagueId).Distinct().ToList();
            
            // get leagues and order by purple, new stars and then rising stars
            List<League> leagues = _leagueRepo.GetAll().Where(x => activeLeagueIds.Contains(x.Id)).
                OrderBy(x => x.LeagueType.Name == Constants.ClubSettings.name_purple).
                ThenBy(x => x.LeagueType.Name == Constants.ClubSettings.name_new_stars).
                ThenBy(x => x.LeagueType.Name == Constants.ClubSettings.name_rising_stars).
                Distinct().
                ToList();

            LeagueClub leagueClub = new LeagueClub();
            LeagueClubDetail leagueClubDetail = new LeagueClubDetail();
            foreach (var item in leagues)
            {
                leagueClub = new LeagueClub();
                leagueClub.Id = item.Id;
                leagueClub.Name = item.Name;
                leagueClub.LeagueType = item.LeagueType;
                leagueClub.Clubs = new List<LeagueClubDetail>();

                List<Club> clubs = _clubRepo.GetAll().Where(x => x.LeagueId == item.Id && x.IsActive == true).ToList();
                foreach (var club in clubs) {
                    leagueClubDetail = new LeagueClubDetail();
                    leagueClubDetail.Id = club.Id;
                    leagueClubDetail.UserId = club.UserId;
                    leagueClubDetail.Name = club.Name;
                    leagueClubDetail.CoachName = "Coach: " + club.User.FullName;
                    if (club.User.Id == userId)
                    {
                        leagueClubDetail.CoachName = "Coach: You";
                    }
                    leagueClubDetail.Points = 0;
                    leagueClubDetail.ClubPosition = 0;
                    leagueClub.Clubs.Add(leagueClubDetail);
                 }

                leagueClubs.Add(leagueClub);
            }

            return leagueClubs;
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

        public List<CoachingClubBase> GetAllClubsForCoach(string userId)
        {
            var secondaryText = "";
            var secondaryTextColor = "";
            var secondaryTextPriority = 0;
            var meetingAttendanceText = "";
            var meetingAttendanceColor = "";
            DateTime today = DateTime.Now;
            DateTime prevMonth = today.AddMonths(-1);
            var monthName = prevMonth.ToString("MMM");
            bool firstInLeague = false;
            double pointsEarned = 0;

            List<Club> clubs = _clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();

            List<CoachingClubBase> result = new List<CoachingClubBase>();
            foreach (var club in clubs)
            {
                List<ClubMember> members = GetClubMembers(club.Id);
                double clubAttendance = GetClubAttendancePercForMonth(club.Id, prevMonth);
                bool hasAttendanceRegister = HasAttendanceRegisterForMonth(club.Id, prevMonth);
                List<ClubLeader> clubLeaders = GetLeadersForClub(club.Id); // there can be 2 active club leaders.  One appointed and then a newly appointed one who has not accepted yet. 
                ClubLeader activeClubLeader = clubLeaders.Where(x => x.IsActive == true && x.DateAccepted.HasValue).FirstOrDefault();
                if (club.LeagueId != null)
                {
                    firstInLeague = ValidateClubFirstPositionInLeague(club, today);
                    pointsEarned = GetClubEarningsPercForMonth(club, prevMonth);
                }

                // Club Attendance - for sorting on club list view
                if (!hasAttendanceRegister)
                {
                    meetingAttendanceText =  "Missing " + monthName + Constants.ClubSettings.missing_register_for_month ;
                    meetingAttendanceColor = MetricsColorEnum.Error.ToString();
                } else
                {
                    meetingAttendanceText = clubAttendance + Constants.ClubSettings.club_attendance + monthName;
                    if (clubAttendance >= 80)
                    {
                        meetingAttendanceColor = MetricsColorEnum.Success.ToString();
                    } else if (clubAttendance >= 60 && clubAttendance <= 79)
                    {
                        meetingAttendanceColor = MetricsColorEnum.Warning.ToString();
                    } else if (clubAttendance >= 0 && clubAttendance <= 59)
                    {
                        meetingAttendanceColor = MetricsColorEnum.Error.ToString();
                    }
                }
                
                // Secondary Text in Priority Desc Order

                // Priority 16 - Club not in league->show this if the club is not currently assigned to a league(acc.to SmartLink);
                // please note that all clubs begin the year ""not in a league"" and are only assigned to leagues from 1 April."
                // TODO: need to add cronjob to remove all clubs from leagues on 1 Jan
                if (club.LeagueId != null)
                {
                    secondaryText = Constants.ClubSettings.club_not_in_league;
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                    secondaryTextPriority = 16;
                }

                // Priority 15 - Purple club->show if the club is a ""purple club""(acc.to SmartLink)
                if (club.LeagueId != null && club.League.LeagueType.Name == Constants.ClubSettings.name_purple)
                {
                    secondaryText = Constants.ClubSettings.club_purple;
                    secondaryTextColor = MetricsColorEnum.None.ToString();
                    secondaryTextPriority = 15;
                }

                // Priority 14 - Top of the league! ->show this if the club has position #1 in the league they are in.
                if (firstInLeague)
                {
                    secondaryText = Constants.ClubSettings.top_of_the_league;
                    secondaryTextColor = MetricsColorEnum.Success.ToString();
                    secondaryTextPriority = 14;
                }

                // Priority 13 - X % club attendance in Nov(green)->show if the club's meeting attendance was 80% or more in the previous month;
                // X = the attendance % for the previous month; Nov = the previous month
                if (clubAttendance >= 80)
                {
                    secondaryText = clubAttendance + Constants.ClubSettings.club_attendance + monthName;
                    secondaryTextColor = MetricsColorEnum.Success.ToString();
                    secondaryTextPriority = 13;
                }

                // Priority 12 - X points earned in Nov(green)->show if the club earned 80 % or more of the monthly max points for the club (see club points tab for detail) ;
                // X = the number of points earned in the previous month; and Nov = the previous month(ONLY show for clubs that are currently in a league)
                if (club.LeagueId != null && pointsEarned >= 80)
                {
                    secondaryText = pointsEarned + Constants.ClubSettings.points_earned + monthName;
                    secondaryTextColor = MetricsColorEnum.Success.ToString();
                    secondaryTextPriority = 12;
                }

                // Priority 11 - New club -> show if the club was created within the past 3 months
                DateTime clubAge = club.InsertedDate.AddMonths(3);
                if (clubAge.Date <= today.Date)
                {
                    secondaryText = Constants.ClubSettings.new_club;
                    secondaryTextColor = MetricsColorEnum.Success.ToString();
                    secondaryTextPriority = 11;
                }

                // Priority 10 - X % club attendance in Nov(amber)->show if the club's meeting attendance was 60 to 79%, inclusive in the previous month;
                // X = the attendance % for the previous month; Nov = the previous month
                if (clubAttendance >= 60 && clubAttendance < 80)
                {
                    secondaryText = clubAttendance + Constants.ClubSettings.club_attendance + monthName;
                    secondaryTextColor = MetricsColorEnum.Warning.ToString();
                    secondaryTextPriority = 10;
                }

                // Priority 9 - X points earned in Nov(amber)->show if the club earned less than 80 % of the max points for the club (see club points tab for detail) ;
                // X = the number of points earned in the previous month; and Nov = the previous month(ONLY show for clubs that are currently in a league)
                if (club.LeagueId != null && pointsEarned < 80)
                {
                    secondaryText = pointsEarned + Constants.ClubSettings.points_earned + monthName;
                    secondaryTextColor = MetricsColorEnum.Warning.ToString();
                    secondaryTextPriority = 9;
                }

                // Priority 8 - 2 Jan, Attend club meeting->show if the coach has not attended a club meeting for the club in 3 months(we can pull attendance information from the calendar if/ when available)
                // (using information from Funda App only; NOT SmartLink)
                // TODO: After C3 development
                // secondaryTextPriority = 8;

                // Priority 7 - 30 Jan, Attend first club meeting -> show if there is an upcoming first club meeting is scheduled in Funda App for sometime within the next 30 day;
                // show if there has never previously been a club meeting hosted by this club; 30 Jan = the date the first meeting is scheduled for (is this possible ?
                // we can restrict this only to clubs that were created within Funda App; if the club was created and a meeting was scheduled for a future date; then this secondary text becomes relevant)
                // TODO: After C3 development
                // secondaryTextPriority = 7;

                // Priority 6 - X % club attendance in Nov(red)->show if the club's meeting attendance was less than 60% in the previous month
                // where X = if the previous month's the percentage of practitioners in the club who attended the meeting in the month; Nov = the previous month
                if (clubAttendance < 60)
                {
                    secondaryText = clubAttendance + Constants.ClubSettings.club_attendance + monthName;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                    secondaryTextPriority = 6;
                }

                // Priority 5 - Missing club meeting register->attendance register was not submitted for the previous month
                if (!hasAttendanceRegister)
                {
                    secondaryText = Constants.ClubSettings.missing_register;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                    secondaryTextPriority = 5;
                }

                // Priority 4 - Choose a new club leader->If a practitioner has been a club leader of the club for more than 6 months
                if (activeClubLeader != null)
                {
                    DateTime clubLeaderLengthDate = activeClubLeader.DateAccepted.Value.AddMonths(6);
                    if (clubLeaderLengthDate.Date >= today.Date)
                    {
                        secondaryText = Constants.ClubSettings.choose_club_leader;
                        secondaryTextColor = MetricsColorEnum.Error.ToString();
                        secondaryTextPriority = 4;
                    }
                }
                // Priority 3 - Too many club members -> show if there are more than 17 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (members.Count > 17)
                {
                    secondaryText = Constants.ClubSettings.too_many_club_members;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                    secondaryTextPriority = 3;
                }
                // Priority 2 - Not enough club members->show if there are less than 4 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (members.Count <= 4)
                {
                    secondaryText = Constants.ClubSettings.not_enough_club_members;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                    secondaryTextPriority = 2;
                }
                // Priority 1 - No club leader->IF the club does not have a club leader assigned
                if (activeClubLeader == null)
                {
                    secondaryText = Constants.ClubSettings.no_club_leader;
                    secondaryTextColor = MetricsColorEnum.Error.ToString();
                    secondaryTextPriority = 1;
                }

                result.Add(
                    new CoachingClubBase()
                    {
                        Id = club.Id,
                        Name = club.Name,
                        UserId = club.UserId,
                        SecondaryText = secondaryText,
                        SecondaryTextColor = secondaryTextColor,
                        SecondaryTextPriority = secondaryTextPriority,
                        MeetingAttendance = clubAttendance,
                        MeetingAttendanceText = meetingAttendanceText,
                        MeetingAttendanceColor = meetingAttendanceColor
                    }
                );
            }

            return result;
        }

        public List<CoachingClub> GetAllClubsDetailsForCoach(string userId, string clubId = null)
        {
            int maxClubPoints = 0;
            int totalClubPoints = 0;
            DateTime today = DateTime.Now;
            DateTime prevMonth = today.AddMonths(-1);
            var monthName = prevMonth.ToString("MMM");
            bool firstInLeague = false;
            double pointsEarned = 0;
            string totalClubPointsColor = MetricsColorEnum.Error.ToString();
            int leagueRankNr = 0;

            List<Club> clubs = _clubRepo.GetAll().Where(x => x.UserId == userId && x.IsActive == true).OrderBy(x => x.Name).ToList();
            if (clubId != null) //filter if we have a specific club to filter on
                clubs = clubs.Where(c => c.Id.ToString() == clubId).ToList();

            List<CoachingClub> result = new List<CoachingClub>();
            List<IssueTask> issuesTasks = new List<IssueTask>();
            foreach (var club in clubs)
            {
                List<ClubMember> members = GetClubMembers(club.Id);
                double clubAttendance = GetClubAttendancePercForMonth(club.Id, prevMonth);
                bool hasAttendanceRegister = HasAttendanceRegisterForMonth(club.Id, prevMonth);
                ClubSupport clubSupport = GetSupportForClub(club.Id);
                Coach coach = GetCoachForClub(club.UserId);
                totalClubPoints = GetClubEarningsForYear(club.Id, today);

                List<ClubLeader> clubLeaders = GetLeadersForClub(club.Id); // there can be 2 active club leaders.  One appointed and then a newly appointed one who has not accepted yet. 
                ClubLeader activeClubLeader = clubLeaders.Where(x => x.IsActive && x.DateAccepted.HasValue && x.DateAssigned.HasValue).FirstOrDefault();
                ClubLeader pendingClubLeader = clubLeaders.Where(x => x.IsActive && !x.DateAccepted.HasValue && x.DateAssigned.HasValue).FirstOrDefault();

                if (club.LeagueId != null)
                {
                    firstInLeague = ValidateClubFirstPositionInLeague(club, today);
                    pointsEarned = GetClubEarningsPercForMonth(club, prevMonth);
                    leagueRankNr = GetClubLeagueRankPosition(club, today);
                    maxClubPoints = GetLeagueMaxPoints(club?.League?.LeagueType?.Name);
                }

                if (club.LeagueId != null && club?.League?.LeagueType?.Name == Constants.ClubSettings.name_purple)
                {
                    if (totalClubPoints > 0 && totalClubPoints < 1650)
                    {
                        totalClubPointsColor = MetricsColorEnum.Warning.ToString();
                    }
                    else if (totalClubPoints >= 1650)
                    {
                        totalClubPointsColor = MetricsColorEnum.Success.ToString();
                    }
                }
                else
                {
                    if (totalClubPoints > 0 && totalClubPoints < 1500)
                    {
                        totalClubPointsColor = MetricsColorEnum.Warning.ToString();
                    } 
                    else if (totalClubPoints >= 1500)
                    {
                        totalClubPointsColor = MetricsColorEnum.Success.ToString();
                    }
                }

                // Priority 8 - 2 Jan, Attend club meeting->show if the coach has not attended a club meeting for the club in 3 months(we can pull attendance information from the calendar if/ when available)
                // (using information from Funda App only; NOT SmartLink)
                // TODO: After C3 development
                // secondaryTextPriority = 8;

                // Priority 7 - 30 Jan, Attend first club meeting -> show if there is an upcoming first club meeting is scheduled in Funda App for sometime within the next 30 day;
                // show if there has never previously been a club meeting hosted by this club; 30 Jan = the date the first meeting is scheduled for (is this possible ?
                // we can restrict this only to clubs that were created within Funda App; if the club was created and a meeting was scheduled for a future date; then this secondary text becomes relevant)
                // TODO: After C3 development
                // secondaryTextPriority = 7;

                // Priority 6 - X % club attendance in Nov(red)->show if the club's meeting attendance was less than 60% in the previous month
                // where X = if the previous month's the percentage of practitioners in the club who attended the meeting in the month; Nov = the previous month
                if (clubAttendance < 60)
                {
                    issuesTasks.Add(new IssueTask()
                    {
                        SecondaryText = clubAttendance + Constants.ClubSettings.club_attendance + monthName,
                        SecondaryTextColor = MetricsColorEnum.Error.ToString(),
                        SecondaryDescription = Constants.ClubSettings.contact_club_members
                    });
                }

                // Priority 5 - Missing club meeting register->attendance register was not submitted for the previous month
                if (!hasAttendanceRegister)
                {
                    issuesTasks.Add(new IssueTask()
                    {
                        SecondaryText = Constants.ClubSettings.missing_register,
                        SecondaryTextColor = MetricsColorEnum.Error.ToString(),
                        SecondaryDescription = Constants.ClubSettings.contact_club_leader
                    });
                }

                // Priority 4 - Choose a new club leader->If a practitioner has been a club leader of the club for more than 6 months
                if (activeClubLeader != null)
                {
                    DateTime clubLeaderLengthDate = activeClubLeader.DateAccepted.Value.AddMonths(6);
                    if (clubLeaderLengthDate.Date >= today.Date)
                    {
                        issuesTasks.Add(new IssueTask()
                        {
                            SecondaryText = Constants.ClubSettings.choose_club_leader,
                            SecondaryTextColor = MetricsColorEnum.Warning.ToString(),
                            SecondaryDescription = activeClubLeader.Practitioner.User.FirstName + Constants.ClubSettings.club_leader_months
                        });
                    }
                }
                // Priority 3 - Too many club members -> show if there are more than 17 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (members.Count > 17)
                {
                    issuesTasks.Add(new IssueTask()
                    {
                        SecondaryText = Constants.ClubSettings.too_many_club_members,
                        SecondaryTextColor = MetricsColorEnum.Error.ToString(),
                        SecondaryDescription = Constants.ClubSettings.create_club
                    });
                }
                // Priority 2 - Not enough club members->show if there are less than 4 practitioners in the club(counting all practitioners in the club; NOT counting the coach)
                if (members.Count <= 4)
                {
                    issuesTasks.Add(new IssueTask()
                    {
                        SecondaryText = Constants.ClubSettings.not_enough_club_members,
                        SecondaryTextColor = MetricsColorEnum.Error.ToString(),
                        SecondaryDescription = Constants.ClubSettings.add_members
                    });
                }
                // Priority 1 - No club leader->IF the club does not have a club leader assigned
                if (activeClubLeader == null)
                {
                    issuesTasks.Add(new IssueTask()
                    {
                        SecondaryText = Constants.ClubSettings.no_club_leader,
                        SecondaryTextColor = MetricsColorEnum.Error.ToString(),
                        SecondaryDescription = Constants.ClubSettings.assign_club_leader
                    });

                } else
                {
                    if (pendingClubLeader != null)
                    {
                        issuesTasks.Add(new IssueTask()
                        {
                            SecondaryText = Constants.ClubSettings.not_accepted_club_leader,
                            SecondaryTextColor = MetricsColorEnum.Error.ToString(),
                            SecondaryDescription = Constants.ClubSettings.contact_club_leader_name + pendingClubLeader.Practitioner.User.FirstName
                        });
                    }
                }

                // TODO: C3 development pending
                List<ClubMeeting> clubMeetings = new List<ClubMeeting>();
                List<ClubActivity> clubActivities = new List<ClubActivity>();

                if (club.LeagueId != null)
                {
                    clubActivities = GetClubActivities(club, today.Year);
                }

                result.Add(
                    new CoachingClub()
                    {
                        Id = club.Id,
                        Name = club.Name,
                        UserId = club.UserId,
                        CurrentClubLeader = clubLeaders.Where(x => x.IsActive && x.DateAssigned.HasValue && x.DateAccepted.HasValue).FirstOrDefault(),
                        NewClubLeader = clubLeaders.Where(x => x.IsActive && x.DateAssigned.HasValue && !x.DateAccepted.HasValue).FirstOrDefault(),
                        ClubSupport = clubSupport,
                        ClubMembers = members,
                        Coach = coach,
                        League = club.League,
                        MaxClubPoints = maxClubPoints,
                        TotalClubPoints = totalClubPoints,
                        TotalClubPointsColor = totalClubPointsColor,
                        FirstInLeague = firstInLeague,
                        LeagueRankNr = leagueRankNr,
                        ClubMeetings = clubMeetings,
                        ClubActivities = clubActivities,
                        IssuesTasks = issuesTasks
                    }
                );
            }

            return result;
        }

        private List<ClubActivity> GetClubActivities(Club club, int year)
        {
            List<ClubActivity> clubActivities = new List<ClubActivity>();
            List<ClubPointsLibrary> activities = _clubPointsLibraryRepo.GetAll().OrderBy(x => x.Activity).ToList();
            List<ClubPoints> clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == club.Id && x.Year == year).ToList();
            ClubActivity activity = new ClubActivity();
            int points = 0;

            if (club.League.LeagueType.Name == Constants.ClubSettings.name_purple)
            {
                activities = activities.Where(x => x.Type == Constants.ClubSettings.name_purple).OrderBy(x => x.Activity).ToList();
                foreach (ClubPointsLibrary pl in activities)
                {
                    points = clubPoints.Where(x => x.ClubPointsLibraryId == pl.Id).Select(x => x.Points).Sum();
                    clubActivities.Add(new ClubActivity() { Name = pl.Activity, Points = points });
                }
            } 
            else
            {
                activities = activities.Where(x => x.Type != Constants.ClubSettings.name_purple).OrderBy(x => x.Activity).ToList();
                foreach (ClubPointsLibrary pl in activities)
                {
                    points = clubPoints.Where(x => x.ClubPointsLibraryId == pl.Id).Select(x => x.Points).Sum();
                    clubActivities.Add(new ClubActivity() { Name = pl.Activity, Points = points });
                }
            }

            return clubActivities;
        }

        public ActivityMeetRegular GetActivityMeetRegularDetails(Guid clubId, int month, int year)
        {
            ActivityMeetRegular activityMeetRegular = new ActivityMeetRegular();
            List<ActivityMeetRegularDetail> pastMeetings = new List<ActivityMeetRegularDetail>();
            List<ClubPoints> clubPoints = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                                         x.Year == year &&
                                                                         x.ClubPointsLibrary.Activity == Constants.ClubSettings.meet_regularly).ToList();
            List<ClubMeeting> allMeetings = _clubMeetingRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                                            x.IsActive && x.MeetingDate.HasValue &&
                                                                            x.MeetingDate.Value.Year == year &&
                                                                            x.MeetingType.Name == Constants.ClubSettings.meeting_type_club_meeting).ToList();
            List<ClubMember> clubMembers = _clubMemberRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive == true).ToList();
            List<Guid> clubMeetingIds = allMeetings.Select(x => x.Id).ToList();
            List<ClubMeetingRegister> clubMeetingRegister = _clubMeetingRegisterRepo.GetAll().Where(x => x.ClubMeeting.MeetingDate.Value.Year == year &&
                                                                                                    clubMeetingIds.Contains(x.ClubMeetingId) && x.IsActive == true).ToList();
            List<Guid> participantIds = clubMeetingRegister.Select(x => (Guid)x.PractitionerId).ToList();
            List<ClubMember> absentees = clubMembers.Where(x => !participantIds.Contains(x.PractitionerId)).ToList();

            if (month != 0)
            {
                clubPoints = clubPoints.Where(x => x.Month == month).ToList();
                allMeetings = allMeetings.Where(x => x.MeetingDate.Value.Month <= month).ToList();
            } 

            activityMeetRegular.Points = clubPoints.Select(x => x.Points).Sum();
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

            // set meetings
            foreach (var item in allMeetings)
            {
                int totalAttended = clubMeetingRegister.Where(x => x.ClubMeeting.MeetingDate == item.MeetingDate && x.Attended && x.IsActive).Count();
                double meetingAttendancePerc = 0.0;
                string meetingAttendanceColor = MetricsColorEnum.Error.ToString();
                if (clubMembers.Count > 0)
                {
                    meetingAttendancePerc = ((double)totalAttended / (double)clubMembers.Count) * 100;
                }

                if (meetingAttendancePerc >= 80)
                {
                    meetingAttendanceColor = MetricsColorEnum.Success.ToString();
                } else if (meetingAttendancePerc > 60 && meetingAttendancePerc <= 79) {
                    meetingAttendanceColor = MetricsColorEnum.Warning.ToString();
                }

                pastMeetings.Add(new ActivityMeetRegularDetail()
                {
                    MeetingDate = (DateTime)item.MeetingDate,
                    MeetingAttendancePerc = meetingAttendancePerc,
                    MeetingAttendanceColor = meetingAttendanceColor,
                    MeetingNotes = item.MeetingNotes,
                    MeetingParticipants = clubMeetingRegister.Where(x => x.Attended).OrderBy(x => x.Practitioner.User.FirstName).ToList(),
                    MeetingAbsentees = absentees.OrderBy(x => x.Practitioner.User.FirstName).ToList(),
                    Points = clubPoints.Where(x => x.Month == item.MeetingDate.Value.Month && x.Year == item.MeetingDate.Value.Year).Select(x => x.Points).Sum()
                });
            }

            activityMeetRegular.PastMeetings = pastMeetings;
            activityMeetRegular.UpcomingMeetings = allMeetings.Where(x => x.MeetingDate.HasValue && x.MeetingDate.Value.Date > DateTime.Now.Date).ToList();

            return activityMeetRegular;
        }

        public ActivityBeCreative GetActivityBeCreativeDetails(Guid clubId)
        {
            DateTime today = DateTime.Now;
            List<DateTime> yearMonths = new List<DateTime>();
            ActivityBeCreative activityBeCreative = new ActivityBeCreative();
            activityBeCreative.MonthlyRecords = new List<ActivityBeCreativeDetail>();

            int points = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.Month == today.Month &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.be_creative).Select(x => x.Points).Sum();

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

            // Populate months for year
            for (int i = 1; i <= today.Month; i++)
            {
                if (i > 4 && i < 12)
                {
                    yearMonths.Add(new DateTime(today.Year, i, 1));
                }
            }

            ClubActivityUpload clubBeCreative = new ClubActivityUpload();
            List<ClubActivityUpload> clubActivities = _clubActivityUploadRepo.GetAll().Where(x => x.ClubId == clubId && x.IsActive && x.Year == today.Year).ToList();
            foreach (DateTime date in yearMonths)
            {
                clubBeCreative = clubActivities.Where(x => x.ClubId == clubId && x.IsActive && x.Year == date.Year && x.Month == date.Month).FirstOrDefault();

                if (clubBeCreative == null)
                {
                    activityBeCreative.MonthlyRecords.Add(
                        new ActivityBeCreativeDetail()
                        {
                            MonthName = date.ToString("MMMM"),
                            DocumentStatusColor = MetricsColorEnum.Error.ToString(),
                            DocumentStatus = Constants.ClubSettings.document_no_success,
                            Points = 0
                        }
                    );
                } 
                else
                {
                    activityBeCreative.MonthlyRecords.Add(
                        new ActivityBeCreativeDetail()
                        {
                            MonthName = date.ToString("MMMM"),
                            Description = clubBeCreative?.Description,
                            DocumentName = clubBeCreative?.Document?.Name,
                            ImageApproved = clubBeCreative?.ImageApproved,
                            DocumentStatusColor = (bool)clubBeCreative?.ImageApproved ? MetricsColorEnum.Warning.ToString() : MetricsColorEnum.Error.ToString(),
                            DocumentStatus = (bool)clubBeCreative?.ImageApproved ? Constants.ClubSettings.document_success : Constants.ClubSettings.document_no_success,
                            Points = 100
                        }
                    );
                }
            }

            return activityBeCreative;
        }

        public ActivityHostFamilyDays GetActivityHostFamilyDetails(Guid clubId)
        {
            DateTime today = DateTime.Now;
            ActivityHostFamilyDays activityHostFamilyDays = new ActivityHostFamilyDays();
            int points = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.Month == today.Month &&
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

            return activityHostFamilyDays;
        }

        public ActivityLeaveNoOneBehind GetActivityLeaveNoOneBehindDetails(Guid clubId)
        {
            DateTime today = DateTime.Now;
            ActivityLeaveNoOneBehind activityLeaveNoOneBehind = new ActivityLeaveNoOneBehind();
            int points = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.Month == today.Month &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.leave_no_one_behind).Select(x => x.Points).Sum();

            activityLeaveNoOneBehind.Points = points;
            activityLeaveNoOneBehind.PointsColor = MetricsColorEnum.Error.ToString();
            // set the color for points
            if (points > 0 && points <= 74)
            {
                activityLeaveNoOneBehind.PointsColor = MetricsColorEnum.Warning.ToString();
            }
            else if (points > 75 && points <= 100)
            {
                activityLeaveNoOneBehind.PointsColor = MetricsColorEnum.Success.ToString();
            }

            return activityLeaveNoOneBehind;
        }

        public ActivityChildAttendance GetActivityChildAttendance(Guid clubId)
        {
            DateTime today = DateTime.Now;
            ActivityChildAttendance activityChildAttendance = new ActivityChildAttendance();
            int points = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.Month == today.Month &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.capture_child_attendance).Select(x => x.Points).Sum();

            activityChildAttendance.Points = points;
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

            return activityChildAttendance;
        }

        public ActivityChildProgress GetActivityChildProgress(Guid clubId)
        {
            DateTime today = DateTime.Now;
            ActivityChildProgress activityChildProgress = new ActivityChildProgress();
            int points = _clubPointsRepo.GetAll().Where(x => x.ClubId == clubId &&
                                                        x.Year == today.Year &&
                                                        x.Month == today.Month &&
                                                        x.ClubPointsLibrary.Activity == Constants.ClubSettings.child_progress_reports).Select(x => x.Points).Sum();

            activityChildProgress.Points = points;
            activityChildProgress.PointsColor = MetricsColorEnum.Error.ToString();
            // set the color for points
            if (activityChildProgress.Points >= Constants.ClubSettings.warning_start_800 && activityChildProgress.Points <= Constants.ClubSettings.warning_end_800)
            {
                activityChildProgress.PointsColor = MetricsColorEnum.Warning.ToString();
            }
            else if (activityChildProgress.Points >= Constants.ClubSettings.success_start_800 && activityChildProgress.Points <= Constants.ClubSettings.success_end_800)
            {
                activityChildProgress.PointsColor = MetricsColorEnum.Success.ToString();
            }

            return activityChildProgress;
        }

        public ClubModel GetClubForUser(string userId)
        {
            // Get practitioner since we need the practitioner id (TODO remove this once we are set up to use userId everywhere)
            var practitioner = _practitionerRepo.GetByUserId(userId);

            var club = _clubMemberRepo.GetAll()
                .Where(x => x.PractitionerId == practitioner.Id && x.IsActive) // Do we need to check the club is active too?
                //Points
                .Include(x => x.Club)
                .ThenInclude(x => x.ClubPoints.Where(x => x.Year == DateTime.Now.Year))
                //League
                .Include(x => x.Club)
                .ThenInclude(x => x.League)
                .ThenInclude(x => x.LeagueType)
                //Club Members
                .Include(x => x.Club)
                .ThenInclude(x => x.ClubMembers.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                //Club leaders
                .Include(x => x.Club)
                .ThenInclude(x => x.ClubLeaders.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                // Club Support
                .Include(x => x.Club)
                .ThenInclude(x => x.ClubSupport.Where(x => x.IsActive))
                .ThenInclude(x => x.Practitioner)
                .ThenInclude(x => x.User)
                .Select(x => x.Club)
                .FirstOrDefault();

            if (club == null) return null;

            // Get points total for club
            var pointsTotal = club.ClubPoints.Select(x => x.Points).Sum();

            var maxPointsTotal = club.League == null
                ? 0
                : club.League?.LeagueType?.Name == Constants.ClubSettings.name_purple
                    ? Constants.ClubSettings.purple_club_max_points
                    : Constants.ClubSettings.non_purple_club_max_points;

            return new ClubModel(club, pointsTotal, maxPointsTotal, GetClubLeagueRankPosition(club, DateTime.Now));
        }

        public bool AddBeCreativeActivity(BeCreativeUpload input)
        {
            string fileName = input.DateUploaded.Date.ToString("MMM_yyyy") + "_be_creative" + input.FileType;
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
                _clubActivityUploadRepo.Insert(new ClubActivityUpload()
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
                return true;
            }

            return false;
        }
    }
}
