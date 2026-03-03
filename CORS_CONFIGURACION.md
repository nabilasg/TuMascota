# Configuración CORS para el Backend PHP

## Para Desarrollo (ya configurado)

El proyecto ya está configurado con un **proxy de desarrollo** que evita problemas de CORS durante el desarrollo. El proxy redirige las peticiones desde `http://localhost:8100` a `http://localhost/TuMascotaAPI/`.

**No necesitas hacer nada en desarrollo**, simplemente ejecuta:
```bash
npm start
```

## Para Producción

Para que la aplicación funcione correctamente en producción, necesitas configurar los headers CORS en tus archivos PHP del servidor.

### Solución: Agregar Headers CORS en todos los archivos PHP

Crea un archivo `cors.php` en la carpeta `TuMascotaAPI/` con el siguiente contenido:

```php
<?php
// Permitir peticiones desde cualquier origen (en producción, cambia * por tu dominio específico)
header("Access-Control-Allow-Origin: *");
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

### Opción 1: Incluir en cada archivo PHP (Recomendado)

Agrega al inicio de cada archivo PHP (antes de cualquier otra salida):

```php
<?php
require_once 'cors.php';
// ... resto del código del archivo
?>
```

### Opción 2: Configurar en .htaccess (Más eficiente)

Si tu servidor usa Apache, crea o edita el archivo `.htaccess` en la carpeta `TuMascotaAPI/`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>

# Responder a peticiones OPTIONS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>
```

### Opción 3: Configurar en php.ini (Para servidor completo)

Si tienes acceso a la configuración del servidor, puedes configurar CORS globalmente. Pero esto es menos común.

## Archivos PHP que necesitan CORS

Asegúrate de que estos archivos tengan los headers CORS:
- `login.php`
- `register.php`
- `mascotas_list.php`
- `mascota_add.php`
- `mascota_detalle.php`
- `mascota_update.php`
- `mascota_delete.php`
- `vacunas_list.php`
- `vacuna_add.php`
- `vacuna_detalle.php`
- `vacuna_update.php`
- `vacuna_delete.php`
- `vacunas_disponibles.php`

## Verificación

Para verificar que los headers CORS están configurados correctamente:

1. Abre las herramientas de desarrollo del navegador (F12)
2. Ve a la pestaña "Network" (Red)
3. Intenta hacer una petición desde tu aplicación
4. Haz clic en la petición y verifica los headers de respuesta
5. Deberías ver `Access-Control-Allow-Origin` en los headers

## Nota de Seguridad

En producción, es recomendable cambiar:
```php
header("Access-Control-Allow-Origin: *");
```

Por tu dominio específico:
```php
header("Access-Control-Allow-Origin: https://tudominio.com");
```

Esto restringe las peticiones solo desde tu dominio.
