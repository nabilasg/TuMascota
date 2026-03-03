import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ]
})
// pantalla principal despues del login
// desde aqui voy navegando al resto y cierro sesion
export class HomePage {

  nombreUsuario = "";

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.nombreUsuario = localStorage.getItem("nombreUsuario") || "";
  }

  cerrarSesion() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  irAVacunas() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    localStorage.removeItem('idMascotaActual');
    this.router.navigate(['/vacunas']);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

}

