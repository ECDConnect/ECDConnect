alter table "Mother" 
add column if not exists "ClickedVisitTab" bool NULL DEFAULT false,
add column if not exists "ClickedProgressTab" bool NULL DEFAULT false,
add column if not exists "ClickedReferralsTab" bool NULL DEFAULT false,
add column if not exists "ClickedContactTab" bool NULL DEFAULT false,
add column if not exists "ClickedDashboardClientsTab" bool NULL DEFAULT false;

alter table "Infant" 
add column if not exists "ClickedVisitTab" bool NULL DEFAULT false,
add column if not exists "ClickedProgressTab" bool NULL DEFAULT false,
add column if not exists "ClickedReferralsTab" bool NULL DEFAULT false,
add column if not exists "ClickedContactTab" bool NULL DEFAULT false,
add column if not exists "ClickedDashboardClientsTab" bool NULL DEFAULT false;

alter table "HealthCareWorker"
add column if not exists "ClickedVisitTab" bool NULL DEFAULT false,
add column if not exists "ClickedProgressTab" bool NULL DEFAULT false,
add column if not exists "ClickedReferralsTab" bool NULL DEFAULT false,
add column if not exists "ClickedContactTab" bool NULL DEFAULT false,
add column if not exists "ClickedDashboardClientsTab" bool NULL DEFAULT false,
add column if not exists "ClickedDashboardHighlightsTab" bool NULL DEFAULT false,
add column if not exists "ClickedDashboardVisitsTab" bool NULL DEFAULT false;