namespace ECDLink.Abstractrions.Constants
{
    public static class TemplateTypeConstants
    {
        //sms/email
        public const string ForgotPassword = "forgot-password";
        public const string AuthCode = "auth-code";
        public const string Invitation = "invitation";
        public const string ThreeWeekNotLoggedOn = "three-week-notification";
        public const string FourWeekNotLoggedOn = "four-week-notification";
        public const string AttendanceWeekly = "attendance-weekly";
        public const string PasswordChangedByAdmin = "password-changed-by-admin";
        public const string PasswordChangedBySelf = "password-changed-by-self";
        public const string EmailChangedByAdmin = "email-changed-by-admin";
        public const string VerifyEmailAddress = "verify-email-address";
        public const string SuperadminNotifyEmailChanged = "superadmin-notify-email-changed";
        public const string AdminPortalInvitation = "admin-portal-invitation";
        public const string TeamLeadInvitation = "team-lead-portal-invitation";
        public const string ForgotPasswordPortal = "forgot-password-portal";
        public const string VerifyCellphoneNumber = "verify-cellphone-number";

        //app notifications
        public const string StartTraineeJourney = "start-trainee-journey";
        public const string ProgrammeInvitation = "ProgrammeInvitation";
        public const string DemotedFromPrincipalOrFAA = "demoted-from-principal-faa";
        public const string PromotedToPrincipalOrFAA = "promoted-to-prinicpal-or-faa";
        public const string ReassignedToNewClassFromOld = "reassigned-to-new-class-from-old";
        public const string ReassignedToNewClass = "reassigned-to-new-class";
        public const string TraineeOverdueTasks = "trainee-overdue-tasks";
        public const string TraineeSetupVenue = "trainee-setup-venue";
        public const string TwoOnboardingStepsLeft = "two-more-steps-to-complete";
        public const string RegisterThreeChildren = "trainee-register-children";
        public const string TraineeSignAgreement = "trainee-sign-agreement";
        public const string TraineeSignStartupSupportAgreement = "trainee-sign-startup-agreement";
        public const string UnassignedClasses = "unassigned-classes";
        public const string RejectedInvitation = "rejected-invitation";
        public const string RemovedFromProgramme = "removed-from-programme";
        public const string PrincipalFAAChanged = "principal-changed";
        public const string PrincipalMovedToProgramme = "reassigned-to-new-programme";
        public const string PractitionerRemovedFromProgramme = "practitioner-removed-from-programme";
        public const string UpdatePreschoolFee = "update-preschool-fee";
        public const string IncomeStatementIncompleteBy1st = "income-statement-not-complete-by-1st";
        public const string PractitionerNotLinkedToProgramme = "not-linked-to-programme";
        public const string ChildRegistrationIncomplete = "child-reg-incomplete";
        public const string ThreeWeekLoginNotification = "three-week-notification";
        public const string ChildNotAssignedToClass = "child-unassigned-to-class";
        public const string ClubLeaderRoleAssigned = "clubleader-role-assigned";
        public const string GainCommunitySupport = "gain-community-support";
        public const string SLChildDocumentFlagged = "child-document-flagged";
        public const string ProgressreportsNotCreated = "progressreports-not-created";
        public const string RecordCaregiverMeeting = "record-caregiver-meeting";
        public const string UserAddedToClub = "user-added-to-club";
        public const string SubmitDailyAttendance = "submit-daily-attendance";
        public const string SubmitWeeksAttendance = "submit-weekly-attendance";
        public const string PractitionerMarkedAbsent = "marked-absent";
        public const string PractitionerMarkedOnLeave = "marked-onleave";
        public const string StartupSupportEndingIn2Months = "startup-support-ending-in-2months";
        public const string AllProgressReportsCompletedForClass = "all-progress-reports-completed-for-class";
        public const string TopSmartStarterPoints = "top-smartstarter-points";
        public const string PlanYourProgrammes = "plan-your-programmes";
        public const string EndofyearPointsEarned = "endofyear-points-earned";
        public const string MonthlyPointsReminderA = "monthly-points-reminder-a";
        public const string MonthlyPointsReminderB = "monthly-points-reminder-b";
        public const string PrincipalReportDeadlinePassed = "principal-report-deadline-passed";
        public const string PrincipalAllReportsDone = "principal-all-reports-done";
        public const string ReportDeadlinePassed = "report-deadline-passed";
        public const string PrincipalMovedToNewProgramme = "report-deadline-passed";
        public const string FillInSelfAsessmentForm = "fillin-self-asessment-form";
        public const string TraineeJourneyStartSelf = "start-trainee-journey";


        //coach notifications
        public const string CoachVisitsOverdue = "coach-visits-overdue";
        public const string CoachRemoveTrainee = "coach-remove-trainee";
        public const string Trainee2WeekOnboardingWarning = "trainee-two-week-onboarding-warning";
        public const string NewClubleader = "new-clubleader";
        public const string CoachNewTrainees = "coach-new-trainees";
        public const string CoachVisitRequested = "coach-visit-requested";
        public const string CoachAddresUpdatedScheduleVisit = "coach-address-updated-schedule-visit";
        public const string CoachNewPractitionersLinked = "coach-new-practitioners-linked";
        public const string CoachTraineeReadySmartspaceCheck = "coach-trainee-ready-smartspace-check";
        public const string CoachSelfAssessmentFormReminder = "coach-fillin-self-asessment-form";

        //GG notifications
        public const string GGWalkthroughNotificationInfant = "gg-walkthrough-notification-infant";
        public const string GGWalkthroughNotificationMother = "gg-walkthrough-notification-mother";
        public const string GGUploadRTHNotification = "gg-upload-rth";
        public const string GGExpectedMomDeliveryDateApproaching = "gg-expected-moms-delivery-date-approaching";
        public const string GGRedAlertMaternalDistressMother = "gg-redalert-maternal-distress-mother";
        public const string GGRedAlertMaternalDistressInfant = "gg-redalert-maternal-distress-infant";
        public const string GGMaternalDistress = "gg-maternal-distress";

        public const string GGVisitOverdue = "gg-visit-overdue";
        public const string GGChildMUAC = "gg-child-muac";
        public const string GGChildGrowthIssue = "gg-child-growth-issue"; 
        public const string GGMultipleReferrals = "gg-multiple-referrals";
        public const string GGReferralDangerSignsMother = "gg-referral-danger-signs-mother";
        public const string GGReferralDangerSignsInfant = "gg-referral-danger-signs-infant";
        public const string GGTwoVisitsMissed = "gg-two-visits-missed";
        public const string GGChildOlderThanFive = "gg-child-older-than-five";
        public const string GGReferDOHA = "gg-refer-home-affairs";
        public const string GGReferSASSA = "gg-refer-sassa";
        public const string GGClinicVisitsNotUpToDate = "gg-clinic-visits-not-uptodate";
        public const string GGPregnantMomLowMUAC = "gg-pregnant-low-muac";
        public const string GGChildMUACMalnutrition = "gg-child-muac-malnutrution";
        public const string GGyoungerthan20 = "gg-younger-than-20";
        public const string GGXVisitsMissed = "gg-x-visits-missed";
        public const string GGLowBirthWeight = "gg-low-birth-weight";
        public const string GGSubstanceAbuse = "gg-substance-abuse";
        public const string GGAddBreastfeedingClub = "gg-breastfeeding-club";
        public const string GGAddedABreastfeedingClub = "gg-added-breastfeeding-club";
        public const string GGVisitsNotCompleted14days = "gg-visits-not-completed-14days";

        //GG points and ranking
        public const string GGEarningPoints = "gg-earning-points";
        public const string GGPointsYearlySummary = "gg-points-yearly-summary";
        public const string GGEarningXPoints = "gg-earning-x-points";
        public const string GGTopPointsEarner = "gg-top-points-earner";
        public const string GGTopPointsTeam = "gg-top-points-team";
        public const string GGTop25PercPointsTeam = "gg-top-25-perc-points-team";
        public const string GGBottom75PercPointsTeam = "gg-bottom-75-perc-points-team";
        public const string GGGoldTierPointsTeam = "gg-points-gold-tier-team";
        public const string GGSilverTierPointsTeam = "gg-points-silver-tier-team";
        public const string GGBronzeTierPointsTeam = "gg-points-bronze-tier-team";
        public const string GGPointsTeamPlacement = "gg-points-placement-team";
        public const string GGPointsTeamPlacementNotTop3 = "gg-points-placement-team-top-25-perc-not-top-three";
        public const string GGPointsTeamPlacementBottom75Perc = "gg-points-placement-team-bottom-75perc";


        //Bulk messaging
        public const string GenericMessage = "generic-message";

        //SMS messaging
        public const string Offline30Days = "30days-offline";
        public const string Offline21Days = "21days-offline";

        // GG portal notifications
        public const string LeagueSetupUnassignedClinics = "league-setup-unassigned-clinics";
        public const string UnassignedClinics = "unassigned-clinics";
    }
}
