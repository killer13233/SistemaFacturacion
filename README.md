 # Sistema de Facturación - Microservicios

## Descripción
Sistema de facturación desarrollado con arquitectura de microservicios, 
compuesto por dos APIs independientes en ASP.NET Core y un frontend en React.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Backend | ASP.NET Core 10, C#, Entity Framework Core |
| Base de datos | SQL Server 2025 |
| Frontend | React 19, Vite 8 |
| Documentación API | Swagger (Swashbuckle) |

---

## Arquitectura

El sistema está dividido en 2 microservicios independientes:

- **API_Clientes** → gestiona clientes
- **API_Productos** → gestiona productos y facturación

Cada microservicio tiene su propia base de datos (DB_Clientes y DB_Productos).
La comunicación entre microservicios se realiza a través de referencias por ID,
sin Foreign Keys entre bases de datos.

---

## Estructura del proyecto
SistemaFacturacion/
├── backend/
│   ├── API_Clientes/
│   │   ├── Controllers/
│   │   │   └── ClienteController.cs
│   │   ├── Models/
│   │   │   └── Cliente.cs
│   │   ├── Data/
│   │   │   └── AppDbContext.cs
│   │   ├── Services/
│   │   │   └── ClienteService.cs
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── API_Clientes.csproj
│   ├── API_Productos/
│   │   ├── Controllers/
│   │   │   ├── ProductoController.cs
│   │   │   └── FacturaController.cs
│   │   ├── Models/
│   │   │   ├── Producto.cs
│   │   │   ├── MaestroFactura.cs
│   │   │   └── DetalleFactura.cs
│   │   ├── Data/
│   │   │   └── AppDbContext.cs
│   │   ├── Services/
│   │   │   ├── ProductoService.cs
│   │   │   └── FacturaService.cs
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── API_Productos.csproj
│   └── SistemaFacturacion.sln
└── frontend/
├── src/
│   ├── components/
│   │   ├── FormCliente.jsx
│   │   ├── FormFactura.jsx
│   │   └── TablaProductos.jsx
│   ├── pages/
│   │   ├── Clientes.jsx
│   │   ├── Facturas.jsx
│   │   └── Productos.jsx
│   ├── services/
│   │   ├── clienteService.js
│   │   ├── facturaService.js
│   │   └── productoService.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
---

## Bases de datos

### DB_Clientes

**Tabla: Clientes**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | int (PK) | Identificador único |
| Nombre | nvarchar | Nombre del cliente |
| Apellido | nvarchar | Apellido del cliente |
| Email | nvarchar | Correo electrónico |
| Telefono | nvarchar | Número de teléfono |
| Direccion | nvarchar | Dirección del cliente |

---

### DB_Productos

**Tabla: Productos**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | int (PK) | Identificador único |
| Nombre | nvarchar | Nombre del producto |
| Descripcion | nvarchar | Descripción del producto |
| Precio | decimal | Precio unitario |
| Stock | int | Cantidad disponible |

**Tabla: MaestroFactura**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | int (PK) | Identificador único |
| NumeroDocumento | nvarchar | Número de factura |
| IdCliente | int | Referencia al cliente (sin FK) |
| Fecha | datetime | Fecha de emisión |
| Total | decimal | Total de la factura |

**Tabla: DetalleFactura**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | int (PK) | Identificador único |
| IdFactura | int (FK) | Referencia a MaestroFactura |
| IdProducto | int (FK) | Referencia a Productos |
| Cantidad | int | Cantidad de productos |
| PrecioUnitario | decimal | Precio al momento de la venta |
| Subtotal | decimal | Cantidad × PrecioUnitario |

---

## Endpoints API

### API_Clientes — puerto 5141

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/Cliente | Obtener todos los clientes |
| GET | /api/Cliente/{id} | Obtener cliente por ID |
| POST | /api/Cliente | Crear nuevo cliente |
| PUT | /api/Cliente/{id} | Actualizar cliente |
| DELETE | /api/Cliente/{id} | Eliminar cliente |

### API_Productos — puerto 5057

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/Producto | Obtener todos los productos |
| GET | /api/Producto/{id} | Obtener producto por ID |
| POST | /api/Producto | Crear nuevo producto |
| PUT | /api/Producto/{id} | Actualizar producto |
| DELETE | /api/Producto/{id} | Eliminar producto |
| GET | /api/Factura | Obtener todas las facturas |
| GET | /api/Factura/{id} | Obtener factura por ID |
| POST | /api/Factura | Crear nueva factura |
| DELETE | /api/Factura/{id} | Eliminar factura |

---

## Funcionalidades del frontend

- Navegación entre módulos: Facturación, Clientes, Productos
- Formulario de facturación con búsqueda de cliente por ID
- Autocompletado de datos del cliente al encontrarlo
- Registro automático de cliente nuevo si no existe en la BD
- Modal de selección de productos con precio y stock
- Edición de cantidad por doble clic en la tabla
- Cálculo automático de subtotal, IVA 15% y total
- Botones de limpiar y guardar factura

---

## Cómo ejecutar el proyecto

### Requisitos previos
- .NET 10 SDK
- Node.js 18+
- SQL Server 2025
- SQL Server Management Studio (SSMS)

### Iniciar el sistema
Ejecutar el archivo `iniciar.bat` en la raíz del proyecto.
Esto levanta automáticamente los 3 servicios:

| Servicio | URL |
|----------|-----|
| API_Clientes | http://localhost:5141 |
| API_Productos | http://localhost:5057 |
| Frontend | http://localhost:5174 |

### Swagger (documentación interactiva de las APIs)
- API_Clientes: http://localhost:5141/swagger
- API_Productos: http://localhost:5057/swagger

---

## Decisiones de diseño

**¿Por qué microservicios?**
Cada servicio es independiente, puede desplegarse, escalarse y 
mantenerse por separado sin afectar al otro.

**¿Por qué las facturas están en DB_Productos?**
El microservicio de productos gestiona todo el proceso de venta,
incluyendo la emisión de facturas y el control de inventario.

**¿Por qué no hay FK entre bases de datos?**
En microservicios cada base de datos es independiente. 
La integridad referencial entre servicios se maneja a nivel de aplicación,
no a nivel de base de datos.
