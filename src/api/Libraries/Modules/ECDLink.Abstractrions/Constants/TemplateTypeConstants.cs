namespace ECDLink.Abstractrions.Constants
{
    public static class TemplateTypeConstants
    {
        public const string ForgotPassword = "forgot-password";
        public const string AuthCode = "auth-code";
        public const string OAWLAuthCode = "oa-wl-auth-code";
        public const string PasswordChangedByAdmin = "password-changed-by-admin";
        public const string PasswordChangedBySelf = "password-changed-by-self";
        public const string VerifyEmailAddress = "verify-email-address";
        public const string SuperadminNotifyEmailChanged = "superadmin-notify-email-changed";
        public const string ForgotPasswordPortal = "forgot-password-portal";
        public const string VerifyCellphoneNumber = "verify-cellphone-number";
        public const string GenericMessage = "generic-message";
        public const string Invitation = "invitation";
        public const string AdminPortalInvitation = "admin-portal-invitation";

        // help
        public const string AdminUserHelpForm = "admin-user-help-form";
        // Tenant Setup Info
        public const string NewTenantSetupInfoReceived = "new-tenant-setup-info-received";
        public const string WelcomeEmailToNewSuperAdmin = "welcome-email-to-new-super-admin";
        // Community to portal notification 
        public const string NotifyAdminOnCoachFeedback = "notify-admin-on-coach-feedback";

        // sheet
        // https://docs.google.com/spreadsheets/d/1X7dypn21NyxGwYHjnqbDebhmTPokV4x3LY_KjNdPi5g/edit?gid=1532194419#gid=1532194419

        // row 4
        public const string PrincipalInvitation = "principal-invitation"; // sms
        public const string ProgrammeInvitation = "ProgrammeInvitation"; // sms, hub, push
        public const string MultipleProgrammeInvitation = "multiple-programme-invitation"; // sms, hub, push
        // row 5
        public const string PreSchoolInvitation = "pre-school-invitation"; //sms
        // row 8
        public const string RemovedFromProgramme = "removed-from-programme";// hub, push
        // row 9
        public const string PromotedToPrincipalOrFAA = "promoted-to-prinicpal-or-faa"; // hub, push
        // row 10
        public const string RejectedInvitation = "rejected-invitation"; // sms, hub, push
        // row 11
        public const string FourWeekNotLoggedOn = "four-week-notification"; // sms (RequestLogOnNotification)
        // row 12
        public const string ThreeWeekNotLoggedOn = "three-week-notification"; // sms in back-end (RequestLogOnNotification), hub & push in FE
        // row 14
        public const string PractitionerJoinedWithPreschoolCode = "practitioner-joined-with-preschool-code"; // hub, push
        // row 15
        public const string UnassignedClasses = "unassigned-classes"; // hub, push
        // row 16
        public const string PractitionerMarkedOnLeave = "marked-onleave"; // push
        // row 19
        public const string ChildNotAssignedToClass = "child-unassigned-to-class"; // hub, push
        // row 20
        public const string SubmitWeeksAttendance = "submit-weekly-attendance"; // hub, push
        // row 27
        public const string Statements60DaysNotification = "statements-60-days-notification";// hub, push
        // row 28
        public const string Statements30DaysNotification = "statements-30-days-notification";// hub, push
        // row 29
        public const string CalendarInvitation = "calendar-invitation"; // push
        // row 32
        public const string ReassignedToNewClass = "reassigned-to-new-class";// hub, push
        // row 33
        public const string CoachRemovePractitioner = "coach-remove-practitioner"; // sms
        // row 35
        public const string OpenCommunityConnections = "open-community-connections"; // push
        // row 38
        public const string FeedbackNotification = "feedback-notification";// hub, push


        // Uncertain
        public const string PractitionerRemovedFromProgramme = "practitioner-removed-from-programme";
        public const string PractitionerMarkedAbsent = "marked-absent";  


        // With GG also removed this will be +- 105 messages/notifications removed
        /* public const string DemotedFromPrincipalOrFAA = "demoted-from-principal-faa";
            public const string ProgressreportsNotCreated = "progressreports-not-created";
            public const string AllProgressReportsCompletedForClass = "all-progress-reports-completed-for-class";
            public const string ReassignedToNewClassFromOld = "reassigned-to-new-class-from-old";
            public const string PractitionerNotLinkedToProgramme = "not-linked-to-programme";
            public const string ChildRegistrationIncomplete = "child-reg-incomplete";
            public const string MonthlyPointsReminderA = "monthly-points-reminder-a";  // was implemented for clubs
            public const string ReportDeadlinePassed = "report-deadline-passed";
         public const string AttendanceWeekly = "attendance-weekly";
         public const string PrincipalFAAChanged = "principal-changed";
         public const string PrincipalMovedToProgramme = "reassigned-to-new-programme";
         public const string UpdatePreschoolFee = "update-preschool-fee";
         // public const string FillInSelfAsessmentForm = "fillin-self-asessment-form";
         // public const string TeamLeadInvitation = "team-lead-portal-invitation";
         // public const string EmailChangedByAdmin = "email-changed-by-admin";
         // public const string TraineeOverdueTasks = "trainee-overdue-tasks";
         // public const string TraineeSetupVenue = "trainee-setup-venue";
         // public const string TwoOnboardingStepsLeft = "two-more-steps-to-complete";
         // public const string RegisterThreeChildren = "trainee-register-children";
         // public const string TraineeSignAgreement = "trainee-sign-agreement";
         // public const string TraineeSignStartupSupportAgreement = "trainee-sign-startup-agreement";
         // public const string IncomeStatementIncompleteBy1st = "income-statement-not-complete-by-1st";
         // public const string ClubLeaderRoleAssigned = "clubleader-role-assigned";
         // public const string GainCommunitySupport = "gain-community-support";
         // public const string SLChildDocumentFlagged = "child-document-flagged";
         // public const string RecordCaregiverMeeting = "record-caregiver-meeting";
         // public const string UserAddedToClub = "user-added-to-club";
         // public const string SubmitDailyAttendance = "submit-daily-attendance";
         // public const string StartupSupportEndingIn2Months = "startup-support-ending-in-2months";
         // public const string TopSmartStarterPoints = "top-smartstarter-points";
         // public const string PlanYourProgrammes = "plan-your-programmes";
         // public const string EndofyearPointsEarned = "endofyear-points-earned";
         // public const string MonthlyPointsReminderB = "monthly-points-reminder-b";
         // public const string PrincipalReportDeadlinePassed = "principal-report-deadline-passed";
         // public const string PrincipalAllReportsDone = "principal-all-reports-done";
         // public const string PrincipalMovedToNewProgramme = "report-deadline-passed";
         // public const string TraineeJourneyStartSelf = "start-trainee-journey";
         // public const string Offline30Days = "30days-offline";
         // public const string Offline21Days = "21days-offline";
         // public const string CoachVisitsOverdue = "coach-visits-overdue";
         // public const string CoachRemoveTrainee = "coach-remove-trainee";
         // public const string LeagueSetupUnassignedClinics = "league-setup-unassigned-clinics";
         //  public const string UnassignedClinics = "unassigned-clinics";
         //  public const string DuplicateMotherAdded = "duplicate-mother-added";
         //  public const string DuplicateChildAdded = "duplicate-child-added";
         //  public const string NextMonthMeetingTopicNotAdded = "next-month-meeting-topic-not-added";
         //  public const string HealthCareWorkersOptedOut = "health-care-worker-opted-out";
         //  public const string ClinicMissingTeamLead = "clinic-missing-team-lead";
         //  public const string NoMeetingReportSubmittedForClinic = "no-meeting-report-submitted-for-clinic";
         // public const string Trainee2WeekOnboardingWarning = "trainee-two-week-onboarding-warning";
         // public const string NewClubleader = "new-clubleader";
         // public const string CoachNewTrainees = "coach-new-trainees";
         // public const string CoachVisitRequested = "coach-visit-requested";
         // public const string CoachAddresUpdatedScheduleVisit = "coach-address-updated-schedule-visit";
         // public const string CoachNewPractitionersLinked = "coach-new-practitioners-linked";
         // public const string CoachTraineeReadySmartspaceCheck = "coach-trainee-ready-smartspace-check";
         // public const string CoachSelfAssessmentFormReminder = "coach-fillin-self-asessment-form";
         */
    }
}
