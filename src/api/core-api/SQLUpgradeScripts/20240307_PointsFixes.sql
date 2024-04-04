ALTER TABLE public."PointsActivity" ALTER COLUMN "Points" SET NOT NULL;
ALTER TABLE public."PointsUserSummary" ALTER COLUMN "PointsLibraryId" DROP NOT NULL;