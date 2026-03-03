# Instrucciones para Agregar Headers CORS en los Archivos PHP

## Ubicación de los archivos
Todos los archivos PHP están en: `C:\xampp\htdocs\TuMascotaAPI\`

## Solución Rápida: Agregar headers al inicio de cada archivo PHP

### Opción 1: Agregar directamente en cada archivo (Método simple)

Abre cada archivo PHP y agrega estas líneas **al inicio del archivo**, justo después de `<?php`:

```php
<?php
// Headers CORS
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Responder a peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// ... resto del código del archivo
```

### Opción 2: Usar un archivo común (Recomendado - Más eficiente)

1. Crea un archivo llamado `cors.php` en `C:\xampp\htdocs\TuMascotaAPI\` con este contenido:

```php
<?php
// Headers CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Responder a las peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
```

2. Luego, en cada archivo PHP, agrega esta línea al inicio (justo después de `<?php`):

```php
<?php
require_once 'cors.php';
// ... resto del código
```

### Archivos que necesitan los headers CORS:

Agrega los headers CORS en estos archivos:
- ✅ `vacuna_delete.php` (IMPORTANTE - este es el que está fallando)
- ✅ `login.php`
- ✅ `register.php`
- ✅ `mascotas_list.php`
- ✅ `mascota_add.php`
- ✅ `mascota_detalle.php`
- ✅ `mascota_update.php`
- ✅ `mascota_delete.php`
- ✅ `vacunas_list.php`
- ✅ `vacuna_add.php`
- ✅ `vacuna_detalle.php`
- ✅ `vacuna_update.php`
- ✅ `vacunas_disponibles.php`

### Ejemplo de cómo debería quedar `vacuna_delete.php`:

```php
<?php
// Headers CORS
header("Access-Control-Allow-Origin: http://localhost:8100");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Responder a peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Tu código actual aquí...
require_once 'conexion.php';
// ... resto del código
?>
```

## Verificación

Después de agregar los headers:

1. Guarda el archivo
2. Reinicia Apache en XAMPP (si es necesario)
3. Prueba eliminar una vacuna desde tu aplicación
4. El error de CORS debería desaparecer

## Nota

Si después de agregar los headers aún hay problemas, verifica que:
- Apache está corriendo en XAMPP
- No hay espacios o salidas antes de `<?php`
- Los headers se agregaron ANTES de cualquier `echo`, `print` o salida HTML
