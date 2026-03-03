import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { Api } from '../../services/api';
import { RouterLink, Router } from '@angular/router';
import { MascotaDetalleModalComponent } from '../mascota-detalle-modal/mascota-detalle-modal.component';
import { MascotaAddModalComponent } from '../mascota-add-modal/mascota-add-modal.component';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.page.html',
  styleUrls: ['./mascotas.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
// aqui saco el listado de mis mascotas
// tambien abro modales y paso a la seccion de vacunas
export class MascotasPage {

  mascotas: any[] = [];
  idUsuario = 0;
  fotosUrl: string;

  constructor(
    private api: Api,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.fotosUrl = this.api.FOTOS_URL;
  }

  ionViewWillEnter() {
    this.idUsuario = Number(localStorage.getItem("idUsuario"));
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.api.getMascotas(this.idUsuario).subscribe((res: any) => {
      this.mascotas = res;
    });
  }

  async nuevaMascota() {
    const modal = await this.modalCtrl.create({
      component: MascotaAddModalComponent,
      componentProps: { idUsuario: this.idUsuario },
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95
    });

    modal.onDidDismiss().then((res) => {
      if (res.data === true) {
        this.cargarMascotas();
      }
    });

    await modal.present();
  }

  async verDetalles(mascota: any) {
    const modal = await this.modalCtrl.create({
      component: MascotaDetalleModalComponent,
      componentProps: { idMascota: mascota.idMascota },
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.8
    });
  
    modal.onDidDismiss().then(res => {
      if (res.data === true) {
        this.cargarMascotas();
      }
    });
  
    await modal.present();
  }

  irAVacunas(mascota: any) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    localStorage.setItem("idMascotaActual", mascota.idMascota.toString());
    this.router.navigate(['/vacunas']);
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}

