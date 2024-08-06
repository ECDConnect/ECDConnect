alter table "ChildProgressReport" 
add column if not exists "IsAllObservationsComplete" bool NULL DEFAULT false,
add column if not exists "ObservationsCompleteDate" timestamp NULL;