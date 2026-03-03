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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
// aqui hago el login del usuario
// si todo va bien guardo datos en localStorage y entro al home
export class LoginPage {

  email = "";
  password = "";

  constructor(
    private api: Api,
    private router: Router,
    private alertController: AlertController
  ) {}

  login() {
    this.email = this.email.trim();
    this.password = this.password.trim();

    if (!this.email || !this.password) {
      this.mostrarAlerta("Completa todos los campos");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mostrarAlerta("Por favor, introduce un email vÃ¡lido (ejemplo: nombre@dominio.com).");
      return;
    }

    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.status === "ok") {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          localStorage.setItem("idUsuario", res.idUsuario);
          if (res.nombre) {
            localStorage.setItem("nombreUsuario", res.nombre);
          } else if (res.nombreUsuario) {
            localStorage.setItem("nombreUsuario", res.nombreUsuario);
          }
          this.router.navigate(['/home']);
        } else {
          this.mostrarAlerta(res.mensaje || "Error al iniciar sesiÃ³n");
        }
      },
      error: (err) => {
        console.error('Error login:', err);
        const mensaje = err.error?.mensaje || "Error al conectar con el servidor";
        this.mostrarAlerta(mensaje);
      }
    });
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  async mostrarAlerta(msg: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}

