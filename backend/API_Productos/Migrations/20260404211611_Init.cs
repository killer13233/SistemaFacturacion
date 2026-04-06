using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_Productos.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFacturas_MaestroFacturas_MaestroFacturaId",
                table: "DetalleFacturas");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFacturas_Productos_ProductoId",
                table: "DetalleFacturas");

            migrationBuilder.DropColumn(
                name: "IdFactura",
                table: "DetalleFacturas");

            migrationBuilder.DropColumn(
                name: "IdProducto",
                table: "DetalleFacturas");

            migrationBuilder.AlterColumn<int>(
                name: "ProductoId",
                table: "DetalleFacturas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MaestroFacturaId",
                table: "DetalleFacturas",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFacturas_MaestroFacturas_MaestroFacturaId",
                table: "DetalleFacturas",
                column: "MaestroFacturaId",
                principalTable: "MaestroFacturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFacturas_Productos_ProductoId",
                table: "DetalleFacturas",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFacturas_MaestroFacturas_MaestroFacturaId",
                table: "DetalleFacturas");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFacturas_Productos_ProductoId",
                table: "DetalleFacturas");

            migrationBuilder.AlterColumn<int>(
                name: "ProductoId",
                table: "DetalleFacturas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "MaestroFacturaId",
                table: "DetalleFacturas",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "IdFactura",
                table: "DetalleFacturas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "IdProducto",
                table: "DetalleFacturas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFacturas_MaestroFacturas_MaestroFacturaId",
                table: "DetalleFacturas",
                column: "MaestroFacturaId",
                principalTable: "MaestroFacturas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFacturas_Productos_ProductoId",
                table: "DetalleFacturas",
                column: "ProductoId",
                principalTable: "Productos",
                principalColumn: "Id");
        }
    }
}
