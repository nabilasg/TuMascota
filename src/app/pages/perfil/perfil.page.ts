import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
// pantalla de perfil del usuario
// cargo sus datos, lo dejo editar y tambien puede borrar la cuenta
export class PerfilPage {

  usuario: any = {
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    pais: ''
  };
  
  cantidadMascotas = 0;
  especies: any = {};
  especiesArray: any[] = [];
  vacunasProximas = 0;
  vacunasVencidas = 0;
  cargando = false;
  editando = false;
  usuarioEdit: any = {};

  constructor(
    private router: Router,
    private api: Api,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.cargarDatosPerfil();
  }

  async cargarDatosPerfil() {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargando = true;
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
      backdropDismiss: false
    });
    await loading.present();

    this.api.getUsuarioPerfil(parseInt(idUsuario)).subscribe({
      next: (res: any) => {
        loading.dismiss();
        this.cargando = false;
        if (res.status === 'ok' && res.usuario) {
          this.usuario = res.usuario;
          this.cantidadMascotas = res.cantidadMascotas || 0;
          this.especies = res.especies || {};
          this.especiesArray = this.getEspeciesArray();
          this.vacunasProximas = res.vacunasProximas || 0;
          this.vacunasVencidas = res.vacunasVencidas || 0;
        }
      },
      error: (err) => {
        loading.dismiss();
        this.cargando = false;
        console.error('Error al cargar perfil:', err);
      }
    });
  }

  volver() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.router.navigate(['/home']);
  }

  getEspeciesArray() {
    return Object.keys(this.especies).map(key => ({
      nombre: key,
      cantidad: this.especies[key]
    }));
  }

  activarEdicion() {
    this.editando = true;
    this.usuarioEdit = {
      nombre: this.usuario.nombre || '',
      telefono: this.usuario.telefono || '',
      ciudad: this.usuario.ciudad || '',
      pais: this.usuario.pais || ''
    };
  }

  cancelarEdicion() {
    this.editando = false;
    this.usuarioEdit = {};
  }

  async guardarEdicion() {
    this.usuarioEdit.nombre = (this.usuarioEdit.nombre || '').trim();
    this.usuarioEdit.telefono = (this.usuarioEdit.telefono || '').trim();
    this.usuarioEdit.ciudad = (this.usuarioEdit.ciudad || '').trim();
    this.usuarioEdit.pais = (this.usuarioEdit.pais || '').trim();

    if (!this.usuarioEdit.nombre) {
      this.mostrarAlerta('El nombre es obligatorio.', true);
      return;
    }

    if (this.usuarioEdit.nombre.length > 50) {
      this.mostrarAlerta('El nombre es demasiado largo (mÃ¡ximo 50 caracteres).', true);
      return;
    }

    if (this.usuarioEdit.telefono) {
      const telRegex = /^[0-9 +()-]{6,20}$/;
      if (!telRegex.test(this.usuarioEdit.telefono)) {
        this.mostrarAlerta('El telÃ©fono no tiene un formato vÃ¡lido.', true);
        return;
      }
    }

    if (this.usuarioEdit.ciudad.length > 100 || this.usuarioEdit.pais.length > 100) {
      this.mostrarAlerta('Ciudad y paÃ­s no pueden superar los 100 caracteres.', true);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando cambios...',
      backdropDismiss: false
    });
    await loading.present();

    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      loading.dismiss();
      return;
    }

    const datosActualizados = {
      nombre: this.usuarioEdit.nombre,
      telefono: this.usuarioEdit.telefono || null,
      ciudad: this.usuarioEdit.ciudad || null,
      pais: this.usuarioEdit.pais || null
    };

    this.api.actualizarUsuario(parseInt(idUsuario), datosActualizados).subscribe({
      next: (res: any) => {
        loading.dismiss();
        if (res.status === 'ok') {
          this.usuario.nombre = datosActualizados.nombre;
          this.usuario.telefono = datosActualizados.telefono;
          this.usuario.ciudad = datosActualizados.ciudad;
          this.usuario.pais = datosActualizados.pais;
          if (datosActualizados.nombre) {
            localStorage.setItem('nombreUsuario', datosActualizados.nombre);
          }
          
          this.editando = false;
          this.usuarioEdit = {};
          this.mostrarAlerta('InformaciÃ³n actualizada correctamente.', false);
        } else {
          this.mostrarAlerta(res.mensaje || 'Error al actualizar la informaciÃ³n.', true);
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al actualizar:', err);
        let mensaje = 'Error al actualizar la informaciÃ³n.';
        if (err.error && err.error.mensaje) {
          mensaje = err.error.mensaje;
        }
        this.mostrarAlerta(mensaje, true);
      }
    });
  }

  async eliminarCuenta() {
    const alert = await this.alertController.create({
      header: 'Eliminar cuenta',
      message: 'Â¿EstÃ¡s seguro de que deseas eliminar tu cuenta? Esta acciÃ³n no se puede deshacer y se eliminarÃ¡n todas tus mascotas y datos asociados.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: 'danger-button',
          handler: async () => {
            await this.procesarEliminacion();
          }
        }
      ]
    });
    await alert.present();
  }

  async procesarEliminacion() {
    const loading = await this.loadingController.create({
      message: 'Eliminando cuenta...',
      backdropDismiss: false
    });
    await loading.present();

    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      loading.dismiss();
      return;
    }

    this.api.eliminarUsuario(parseInt(idUsuario)).subscribe({
      next: (res: any) => {
        loading.dismiss();
        if (res.status === 'ok') {
          this.mostrarAlerta('Tu cuenta ha sido eliminada correctamente.', false, true);
          localStorage.clear();
          this.router.navigate(['/login']);
        } else {
          this.mostrarAlerta(res.mensaje || 'Error al eliminar la cuenta.', true);
        }
      },
      error: (err) => {
        loading.dismiss();
        console.error('Error al eliminar cuenta:', err);
        let mensaje = 'Error al eliminar la cuenta.';
        if (err.error && err.error.mensaje) {
          mensaje = err.error.mensaje;
        }
        this.mostrarAlerta(mensaje, true);
      }
    });
  }

  async mostrarAlerta(msg: string, isError: boolean = false, redirect: boolean = false) {
    const alert = await this.alertController.create({
      header: isError ? 'Error' : 'InformaciÃ³n',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
    
    if (redirect) {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

