import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'mascotas',
    loadComponent: () => import('./pages/mascotas/mascotas.page').then( m => m.MascotasPage)
  },
  {
    path: 'vacunas',
    loadComponent: () => import('./pages/vacunas/vacunas.page').then( m => m.VacunasPage)
  },
  {
    path: 'paseos',
    loadComponent: () => import('./pages/paseos/paseos.page').then(m => m.PaseosPage)
  },
  {
    path: 'adopciones',
    loadComponent: () => import('./pages/adopciones/adopciones.page').then(m => m.AdopcionesPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'tienda',
    loadComponent: () => import('./pages/tienda/tienda.page').then(m => m.TiendaPage)
  }
];

