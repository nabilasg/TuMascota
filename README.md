# TuMascota

TuMascota es una app que hice con Ionic + Angular para tener en un solo sitio todo lo importante de mis mascotas: datos, vacunas, paseos, adopciones y perfil.

## Que incluye

- Registro e inicio de sesion
- Gestion de mascotas (crear, editar y eliminar)
- Control de vacunas
- Registro de paseos
- Publicaciones de adopcion
- Perfil de usuario
- Tienda demo dentro de la app

## Tecnologias usadas

- Ionic 8
- Angular 20
- Capacitor 8
- TypeScript
- HTML + SCSS
- Backend en PHP
- Base de datos MySQL

## Estructura del repositorio

```text
src/                  -> frontend Ionic/Angular
backend/TuMascotaAPI/ -> API en PHP
database/             -> export SQL de la base de datos
android/              -> proyecto Android (Capacitor)
```

## Requisitos

- Node.js 18 o superior
- npm
- Ionic CLI (`npm i -g @ionic/cli`)
- XAMPP o entorno PHP + MySQL similar
- Android Studio (si quieres APK)

## Como ejecutarlo en local

1) Clonar el repo

```bash
git clone https://github.com/nabilasg/TuMascota.git
cd TuMascota
```

2) Instalar dependencias del frontend

```bash
npm install
```

3) Levantar backend y base de datos

- Copia `backend/TuMascotaAPI` a tu servidor local (por ejemplo `C:/xampp/htdocs/`).
- Importa `database/tuMascota_export_ok.sql` en phpMyAdmin.
- Verifica que en `backend/TuMascotaAPI/conexion.php` tengas bien host, usuario, password y nombre de BD.

4) Ajustar URL de la API en el frontend

Archivo:
- `src/app/services/api.ts`

Variable:
- `API_URL`

Ejemplo:

```ts
private API_URL = this.normalizarBaseUrl('http://127.0.0.1/TuMascotaAPI/');
```

5) Ejecutar frontend

```bash
npm start
```

Para probar desde movil en la misma red:

```bash
npm run start:lan
```

## APK Android

```bash
npm run android:prepare
npm run android:open
```

Luego en Android Studio puedes generar APK debug o release.

## Nota importante

Si la API esta en local (`localhost` o IP privada), la app solo funcionara en esa red.  
Si quieres que funcione fuera de casa/instituto, tienes que publicar el backend en un servidor accesible desde internet y cambiar `API_URL`.

## Estado del proyecto

Proyecto academico (TFG), funcional y orientado a demostracion completa frontend + backend + base de datos.

