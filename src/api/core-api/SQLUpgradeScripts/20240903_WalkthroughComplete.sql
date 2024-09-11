
alter table "Practitioner" 
add column if not exists "ProgressWalkthroughComplete" boolean not null default false;