alter table "Content" 
add column if not exists "Sections" text null,
add column if not exists "IsReadOnly" bool null;