update "ReasonForPractitionerLeavingProgramme" set "Description" = 'Moving to another preschool' where "Description" = 'Moving to another Smart Start programme';

update "ReasonForPractitionerLeavingProgramme" set "IsActive" = false where "Description" = 'Moving to a non-Smart Start programme';

update "ReasonForPractitionerLeaving" set "Description" = 'Found other employment' where "Description" = 'Moved to other CWP';
update "ReasonForPractitionerLeaving" set "IsActive" = false where "Description" = 'Delicensed';
update "ReasonForPractitionerLeaving" set "IsActive" = false where "Description" = 'Did not complete onboarding';