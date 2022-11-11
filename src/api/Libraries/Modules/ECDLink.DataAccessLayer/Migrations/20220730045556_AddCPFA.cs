using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ECDLink.DataAccessLayer.Migrations
{
    public partial class AddCPFA : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Practitioner_UserId",
                table: "Practitioner");

            migrationBuilder.DropIndex(
                name: "IX_Coach_UserId",
                table: "Coach");

            migrationBuilder.DropIndex(
                name: "IX_Child_UserId",
                table: "Child");

            migrationBuilder.AddColumn<string>(
                name: "CoachHierarchy",
                table: "Practitioner",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFundaAppAdmin",
                table: "Practitioner",
                type: "boolean",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPrincipal",
                table: "Practitioner",
                type: "boolean",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsTrainee",
                table: "Practitioner",
                type: "boolean",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRegistered",
                table: "Practitioner",
                type: "boolean",
                nullable: true,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PrincipalHierarchy",
                table: "Practitioner",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FranchisorId",
                table: "Coach",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SiteAddressId",
                table: "Coach",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NickFirstName",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NickFullName",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NickSurname",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactFirstName",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
                        migrationBuilder.AddColumn<string>(
                name: "EmergencyContactSurname",
                table: "AspNetUsers",
                type: "text",
                nullable: true);
                        migrationBuilder.AddColumn<string>(
                name: "EmergencyContactPhoneNumber",
                table: "AspNetUsers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SigningSignature",
                table: "Practitioner",
                type: "text",
                nullable: true);


            migrationBuilder.AddColumn<string>(
                name: "SigningSignature",
                table: "Coach",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "ClassroomGroup",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShareInfo",
                table: "Practitioner",
                type: "boolean",
                nullable: true,
                defaultValue: false);

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
                    PractitionerId = table.Column<Guid>(type: "text", nullable: true),
                    ProgramId = table.Column<Guid>(type: "text", nullable: true)
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
                    table.ForeignKey(
                        name: "FK_Absentees_Practitioner_PractitionerId",
                        column: x => x.PractitionerId,
                        principalTable: "Practitioner",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Absentees_Programme_ProgramId",
                        column: x => x.ProgramId,
                        principalTable: "Programme",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClassroomHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    InsertedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),                    
                    ReassignedClass = table.Column<string>(type: "text", nullable: true),
                    ToPractitionerId = table.Column<string>(type: "text", nullable: true),
                    FromPractitionerId = table.Column<Guid>(type: "text", nullable: true),
                    ProgramId = table.Column<Guid>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassroomHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassroomHistory_FromPractitionerId_Practitioner_PractitionerId",
                        column: x => x.FromPractitionerId,
                        principalTable: "Practitioner",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClassroomHistory_ToPractitionerId_Practitioner_PractitionerId",
                        column: x => x.ToPractitionerId,
                        principalTable: "Practitioner",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

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
                    SigningSignature = table.Column<string>(type: "text", nullable: true),
                    Hierarchy = table.Column<string>(type: "text", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_Practitioner_UserId",
                table: "Practitioner",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Coach_SiteAddressId",
                table: "Coach",
                column: "SiteAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Coach_UserId",
                table: "Coach",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Child_UserId",
                table: "Child",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Absentees_PractitionerId",
                table: "Absentees",
                column: "PractitionerId");

            migrationBuilder.CreateIndex(
                name: "IX_Absentees_ProgramId",
                table: "Absentees",
                column: "ProgramId");

            migrationBuilder.CreateIndex(
                name: "IX_Absentees_UserId",
                table: "Absentees",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Franchisor_SiteAddressId",
                table: "Franchisor",
                column: "SiteAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Coach_FranchisorId",
                table: "Coach",
                column: "FranchisorId");

            migrationBuilder.CreateIndex(
                name: "IX_Franchisor_UserId",
                table: "Franchisor",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Coach_SiteAddress_SiteAddressId",
                table: "Coach",
                column: "SiteAddressId",
                principalTable: "SiteAddress",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coach_SiteAddress_SiteAddressId",
                table: "Coach");

            migrationBuilder.DropTable(
                name: "Absentees");

            migrationBuilder.DropTable(
                name: "Franchisor");

            migrationBuilder.DropIndex(
                name: "IX_Practitioner_UserId",
                table: "Practitioner");

            migrationBuilder.DropIndex(
                name: "IX_Coach_SiteAddressId",
                table: "Coach");

            migrationBuilder.DropIndex(
                name: "IX_Coach_UserId",
                table: "Coach");

            migrationBuilder.DropIndex(
                name: "IX_Child_UserId",
                table: "Child");

            migrationBuilder.DropColumn(
                name: "CoachHierarchy",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "IsFundaAppAdmin",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "IsPrincipal",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "IsTrainee",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "IsRegistered",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "PrincipalHierarchy",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "Signature",
                table: "Practitioner");

            migrationBuilder.DropColumn(
                name: "Signature",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "SiteAddressId",
                table: "Coach");

            migrationBuilder.DropColumn(
                name: "NickFirstName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NickFullName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "NickSurname",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactFirstName",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactSurname",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "EmergencyContactPhoneNumber",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "IsPrinciple",
                table: "Classroom",
                newName: "isPrinciple");

            migrationBuilder.AlterColumn<Guid>(
                name: "FranchisorId",
                table: "Coach",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Practitioner_UserId",
                table: "Practitioner",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Coach_UserId",
                table: "Coach",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Child_UserId",
                table: "Child",
                column: "UserId");
        }
    }
}
