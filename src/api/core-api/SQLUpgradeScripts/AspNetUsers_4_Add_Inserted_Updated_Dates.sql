alter table "AspNetUsers" add column "InsertedDate" TIMESTAMP not null DEFAULT NOW();
alter table "AspNetUsers" add column "UpdatedDate" TIMESTAMP null;