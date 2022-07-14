using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace ECDLink.DataAccessLayer.Migrations
{
    public partial class CoachesPractitionersFranchisorsPrincipals : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
             name: "Franchisor",
             columns: table => new
             {
                 Id = table.Column<Guid>(type: "uuid", nullable: false),
                 IsActive = table.Column<bool>(type: "boolean", nullable: false),
                 InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                 UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                 UpdatedBy = table.Column<string>(type: "text", nullable: true),
                 UserId = table.Column<string>(type: "text", nullable: true),
                 AreaOfOperation = table.Column<string>(type: "text", nullable: true),
                 SecondaryAreaOfOperation = table.Column<string>(type: "text", nullable: true),
                 StartDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                 SiteAddressId = table.Column<Guid>(type: "uuid", nullable: true),
             },
             constraints: table =>
             {
                 table.PrimaryKey("PK_Franchisor", x => x.Id);
                 table.ForeignKey(
                     name: "FK_Franchisor_AspNetUsers_UserId",
                     column: x => x.UserId,
                     principalTable: "AspNetUsers",
                     principalColumn: "Id",
                     onDelete: ReferentialAction.Restrict);
                 table.ForeignKey(
                        name: "FK_Franchisor_SiteAddress_SiteAddressId",
                        column: x => x.SiteAddressId,
                        principalTable: "SiteAddress",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
             });

            migrationBuilder.CreateTable(
                 name: "Signatures",
                 columns: table => new
                 {
                     Id = table.Column<Guid>(type: "uuid", nullable: false),
                     IsActive = table.Column<bool>(type: "boolean", nullable: false),
                     InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                     UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                     UpdatedBy = table.Column<string>(type: "text", nullable: true),
                     Signature = table.Column<string>(type: "text", nullable: true)
                 });

            migrationBuilder.AddColumn<string>("CoachHierarchy", "Practitioner", "text", nullable: true);
            migrationBuilder.AddColumn<string>("PrincipalHierarchy", "Practitioner", "text", nullable: true);
            migrationBuilder.AddColumn<string>("IsPrincipal", "Practitioner", "bool", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<string>("IsFundaAppAdmin", "Practitioner", "bool", nullable: true, defaultValue: false);
            migrationBuilder.AddColumn<string>("IsTrainee", "Practitioner", "bool", nullable: true, defaultValue: false);
            migrationBuilder.AddColumn<string>("NotInvitedYet", "Practitioner", "bool", nullable: true, defaultValue: false);

            migrationBuilder.AddColumn<Guid>("SiteAddressId", "Coach", "uuid", nullable: true);

            migrationBuilder.AddColumn<string>("NickFirstName", "AspNetUsers", "text", nullable: true);
            migrationBuilder.AddColumn<string>("NickSurname", "AspNetUsers", "text", nullable: true);
            migrationBuilder.AddColumn<string>("NickFullName", "AspNetUsers", "text", nullable: true);

            migrationBuilder.CreateTable(
            name: "Absentees",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                IsActive = table.Column<bool>(type: "boolean", nullable: false),
                InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                UpdatedBy = table.Column<string>(type: "text", nullable: true),
                UserId = table.Column<string>(type: "text", nullable: true),
                Reason = table.Column<string>(type: "text", nullable: true),
                AbsentDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                LoggedBy = table.Column<string>(type: "text", nullable: true),
                ReassignedClass = table.Column<string>(type: "text", nullable: true),
                ReassignedToPractitioner = table.Column<string>(type: "text", nullable: true),
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Absentees", x => x.Id);
                table.ForeignKey(
                    name: "FK_Absentees_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });

            //migrationBuilder.DropPrimaryKey("PK_Learner", "Learner");
            //migrationBuilder.AddPrimaryKey("PK_Learner", "Learner", x => new { x.ClassroomGroupId, x.UserId, x.Id });                      
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Franchisor");
            migrationBuilder.DropTable(
                name: "Signatures");

            migrationBuilder.DropColumn("CoachHierarchy", "Practitioner");
            migrationBuilder.DropColumn("PrincipalHierarchy", "Practitioner");
            migrationBuilder.DropColumn("IsPrincipal", "Practitioner");
            migrationBuilder.DropColumn("IsFundaAppAdmin", "Practitioner");
            migrationBuilder.DropColumn("IsTrainee", "Practitioner");
            migrationBuilder.DropColumn("SiteAddressId", "Coach");
        }
    }
}
