alter table "Practitioner" 
add column if not exists "ClickedCommunityTab" bool NULL DEFAULT false;

alter table "Coach" 
add column if not exists "ClickedCommunityTab" bool NULL DEFAULT false;