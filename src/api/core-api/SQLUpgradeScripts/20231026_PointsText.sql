update "PointsLibrary" set "Description" = 'New children registered'
where "Id" = '13a6e446-d011-407a-aebb-2a398915d6ae';

update "PointsLibrary" set "Description" = 'Children removed from programme'
where "Id" = 'd38885e1-a822-4dd9-af3a-252681b27dbb';

update "PointsLibrary" set "Description" = 'Yearly preschool fee added'
where "Id" = 'f7307227-2ff7-4b85-8851-27c2af79be28';

update "PointsLibrary" set "Description" = 'Caregivers paid preschool fees or contributions'
where "Id" = '1aea269b-db0b-4cc6-b052-c4eaa5d89b05';

update "PointsLibrary" set "Description" = 'Attendance registeres submitted'
where "Id" = 'aad9c9aa-f76f-466b-bffe-fd9119efac31';

update "PointsLibrary" set "Description" = 'Income statement Submitted'
where "Id" = '8021a70d-3267-48aa-8acc-33a22736004d';

update "PointsLibrary" set "Description" = 'Monthly income statements submitted in a row'
where "Id" = '4d49baed-8fff-49ad-883f-d60d62a58d16';



alter table "PointsLibrary" add column "TodoDescription" text;

update "PointsLibrary" set "TodoDescription" = 'Update your monthly preschool fee'
where "Id" = 'f7307227-2ff7-4b85-8851-27c2af79be28';

update "PointsLibrary" set "TodoDescription" = 'Add preschool fees to your income statement'
where "Id" = '1aea269b-db0b-4cc6-b052-c4eaa5d89b05';

update "PointsLibrary" set "TodoDescription" = 'Submit your attendance registers!'
where "Id" = 'aad9c9aa-f76f-466b-bffe-fd9119efac31';

update "PointsLibrary" set "TodoDescription" = 'Submit your income statement this month'
where "Id" = '8021a70d-3267-48aa-8acc-33a22736004d';