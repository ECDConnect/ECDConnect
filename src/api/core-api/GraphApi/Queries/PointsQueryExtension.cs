using EcdLink.Api.CoreApi.GraphApi.Models.SmartStart;
using ECDLink.Abstractrions.GraphQL.Enums;
using ECDLink.Core.Services.Interfaces;
using ECDLink.DataAccessLayer.Entities.PointsEngine;
using ECDLink.EGraphQL.Authorization;
using ECDLink.Security;
using HotChocolate;
using HotChocolate.Types;
using System;
using System.Collections.Generic;

namespace EcdLink.Api.CoreApi.GraphApi.Queries
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class PointsQueryExtension
    {
        public PointsQueryExtension() 
        {
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsUserSummary> GetPointsSummaryForUser(
            [Service] IPointsEngineService pointsService,
            string userId,
            DateTime startDate,
            DateTime? endDate)
        {
            var pointsSummary = pointsService.GetSummaryUserPoints(Guid.Parse(userId), startDate, endDate);

            return pointsSummary;
        }

        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public List<PointsLibrary> GetPointsLibrary(
            [Service] IPointsEngineService pointsService)
        {
            var pointsLibrary = pointsService.GetPointsLibraryForTenant();

            return pointsLibrary;
        }
        
        [Permission(PermissionGroups.USER, GraphActionEnum.View)]
        public UserClubStandingModel GetUserClubStanding(
            [Service] IPointsEngineService pointsService,
            string userId)
        {
            var userStanding = pointsService.GetUserClubStanding(userId);

            return userStanding;
        }

        //
        // TESTING
        // 
        public bool TestCalculateConnectWithAnotherUser(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateConnectWithAnotherUser(userId);
            return true;
        }

        public bool TestCalculateChildAttendanceRegisterSaved(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateChildAttendanceRegisterSaved(userId);
            return true;
        }

        public bool TestCalculateChildRegistrationComplete(
            [Service] IWLPointsEngineService pointsService,
            Guid childUserId)
        {
            pointsService.CalculateChildRegistrationComplete(childUserId);
            return true;
        }

        public bool TestCalculateAddNewPractitionerToPreschool(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateAddNewPractitionerToPreschool(userId);
            return true;
        }
        public bool TestCalculateAddNewClassToPreschool(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateAddNewClassToPreschool(userId);
            return true;
        }

        public bool TestCalculateDownloadIncomeStatement(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateDownloadIncomeStatement(userId);
            return true;
        }

        public bool TestCalculateAddExpenseOrIncomeToStatement(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateAddExpenseOrIncomeToStatement(userId);
            return true;
        }

        public bool TestCalculatePreschoolFeesGreaterThan0ForEachChild(
            [Service] IWLPointsEngineService pointsService)
        {
            pointsService.CalculatePreschoolFeesGreaterThan0ForEachChild();
            return true;
        }

        public bool TestCalculateThemePlanned(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateThemePlanned(userId);
            return true;
        }

        public bool TestCalculateNoThemePlanned(
            [Service] IWLPointsEngineService pointsService,
            Guid userId)
        {
            pointsService.CalculateNoThemePlanned(userId);
            return true;
        }
    }
}
