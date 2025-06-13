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
        public const string FourWeekNotLoggedOn = "four-week-notification"; // sms (DailyUserOfflineNotification)
        // row 12
        public const string ThreeWeekNotLoggedOn = "three-week-notification"; // sms in back-end (DailyUserOfflineNotification), hub & push in FE
        public const string TwoWeekNotLoggedOn = "two-week-notification"; // sms in back-end (DailyUserOfflineNotification), hub & push in FE
        // row 14
        public const string PractitionerJoinedWithPreschoolCode = "practitioner-joined-with-preschool-code"; // hub, push
        // row 15
        public const string UnassignedClasses = "unassigned-classes"; // hub, push
        // row 16
        public const string PrincipalMarkedOnLeave = "marked-onleave"; // push
        // row 17
        public const string PractitionerMarkedOnLeave = "practitioner-marked-onleave"; // push, hub
        // row 19
        public const string ChildNotAssignedToClass = "child-unassigned-to-class"; // hub, push
        // row 20
        public const string SubmitWeeksAttendance = "submit-weekly-attendance"; // hub, push
        // row 22
        public const string FinishProgressReport = "finish-progress-report"; // hub, push
        // row 23
        public const string AllProgressReportsCreated = "all-progress-reports-created"; // hub, push
        // row 25
        public const string ProgressSummaryReport = "progress-summary-report"; // hub, push
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

        // Coaches
        // row 4
        public const string CoachNewPractitionersLinked = "coach-new-practitioners-linked";
        // row 5
        public const string FourteenDaysNotLoggedOn = "four-teen-days-notification"; // sms (DailyUserOfflineNotification)


        // Uncertain
        public const string PractitionerRemovedFromProgramme = "practitioner-removed-from-programme";
        public const string PractitionerMarkedAbsent = "marked-absent";  
    }
}
