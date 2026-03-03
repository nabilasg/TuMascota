import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
// registro de usuario nuevo
// valido el formulario y si todo ok creo la cuenta
export class RegistroPage {

  nombre = "";
  email = "";
  telefono = "";
  ciudad = "";
  pais = "";
  password = "";
  passwordConfirm = "";

  constructor(
    private api: Api,
    private router: Router,
    private alertController: AlertController
  ) {}

  register() {
    this.nombre = this.nombre.trim();
    this.email = this.email.trim();
    this.telefono = this.telefono.trim();
    this.ciudad = this.ciudad.trim();
    this.pais = this.pais.trim();
    this.password = this.password.trim();
    this.passwordConfirm = this.passwordConfirm.trim();

    if (!this.nombre || !this.email || !this.password) {
      this.mostrarAlerta("Todos los campos obligatorios deben rellenarse.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mostrarAlerta("Por favor, introduce un email vÃ¡lido (ejemplo: nombre@dominio.com).");
      return;
    }

    if (this.telefono) {
      const telRegex = /^[0-9 +()-]{6,20}$/;
      if (!telRegex.test(this.telefono)) {
        this.mostrarAlerta("El telÃ©fono no tiene un formato vÃ¡lido.");
        return;
      }
    }

    if (this.password !== this.passwordConfirm) {
      this.mostrarAlerta("Las contraseÃ±as no coinciden. Por favor, verifica que ambas contraseÃ±as sean iguales.");
      return;
    }

    const body = {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      ciudad: this.ciudad,
      pais: this.pais,
      password: this.password
    };

    this.api.register(body).subscribe({
      next: (res: any) => {
        if (res && res.status === "ok") {
          this.mostrarAlerta("Cuenta creada con Ã©xito. Ahora inicia sesiÃ³n.", true, false);
        } else {
          const mensaje = (res && res.mensaje) ? res.mensaje : "Error al registrar usuario";
          this.mostrarAlerta(mensaje, false, true);
        }
      },
      error: (err) => {
        console.error('Error en registro:', err);
        const mensaje = err.error?.mensaje || "Error al conectar con el servidor";
        this.mostrarAlerta(mensaje, false, true);
      }
    });
  }

  async mostrarAlerta(msg: string, redirect: boolean = false, isError: boolean = false) {
    const alert = await this.alertController.create({
      header: isError ? 'Error' : 'InformaciÃ³n',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();

    if (redirect) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      this.router.navigate(['/login']);
    }
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

