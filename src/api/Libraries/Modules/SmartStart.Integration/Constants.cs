namespace SmartStart.Integration;

public static class Constants
{
    public static class ApplicationSettings
    {
        public const string DefaultTenant = "258a15e6-3736-45ea-875c-48d9377de4c8";
    }


    public static class SSIntegrationSettings
    {
        //Franchisee Queries
        public const string SSPractitioner = "Practitioner";
        public const string SLPractitioner = "Franchisee";
        public const string SLPractitionerQueryAll = SLPractitioner + QueryAll;
        public const string SLPractitionerQueryByGuid = SLPractitioner + QueryByGuid;
        public const string SLPractitionerUpdate = SLPractitioner + UpdateSingular;
        //Coach Queries
        public const string SSCoach = "Coach";
        public const string SLCoach = "Coach";
        //Franchisor Queries
        public const string SSFranchisor = "Franchisor";
        public const string SLFranchisor = "Franchisor";
        //Child Queries
        public const string SSChild = "Child";
        public const string SLChild = "Child";
        //Caregiver Queries
        public const string SSCaregiver = "Caregiver";
        public const string SLCaregiver = "Caregiver";
        //Trainee Queries
        public const string SSTrainee = "Trainee";
        public const string SLTrainee = "Trainee";
        //Address Queries
        public const string SSAddress = "SiteAddress";
        public const string SLAddress = "Address";
        //Record Queries
        public const string SSRecordChange = "";
        public const string SLRecordChange = "RecordChange";
        //Column Queries
        public const string SSColumnChange = "";            
        public const string SLColumnChange = "ColumnChange";
        //Document Queries
        public const string SSDocument = "Document";
        public const string SLDocument = "Document";
        //DocumentType Queries
        public const string SSDocumentType = "DocumentType";
        public const string SLDocumentType = "DocumentType";
        //IncomeStatement Queries
        public const string SSIncomeStatementIncome = "StatementsIncome";
        public const string SLIncomeStatementIncome = "IncomeStatement";
        public const string SSIncomeStatementExpense = "StatementsExpense";
        public const string SLIncomeStatementExpense = "IncomeStatement";
        //ChildAttendanceRegister Queries
        public const string SSChildAttendanceRegister = "Attendance";
        public const string SLChildAttendanceRegister = "ChildAttendanceRegister";
        //Note Queries
        public const string SSNote = "Note";
        public const string SLNote = "Note";
        //Club data Queries
        public const string SSClub = "Club";
        public const string SLClub = "Club";
        public const string SSClubMeeting = "ClubMeeting";
        public const string SLClubMeeting = "ClubMeeting";
        public const string SSClubMeetingRegister = "ClubMeetingRegister";
        public const string SLClubMeetingRegister = "ClubMeetingRegister";
        //PQA
        public const string SSPQA = "PQA";
        public const string SLPQA = "PQA";
        //SmartSpaceVisits
        public const string SSSmartSpaceVisit = "SmartSpaceVisit";
        public const string SLSmartSpaceVisit = "SmartSpaceVisit";

        //Additional API Switches
        public const string QueryAll = "/Query";
        public const string Singular = "/{{Guid}}";
        public const string QueryByGuid = "/Query/{{Guid}}";
        public const string ColumnsMetadata = "/Columns";
        public const string UpdateMultiple = "/Multiple";
        public const string UpdateSingular = "/{{Guid}}";
        public const string CreateMultiple = "/Multiple";
        public const string CreateSingular = "/";
        public const string DocumentSendLength = "20";
        public const string IntegrationSystem = "Smartlink";

    }
}

