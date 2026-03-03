import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';
import { PaseoAddModalComponent } from '../paseo-add-modal/paseo-add-modal.component';
import { PaseoDetalleModalComponent } from '../paseo-detalle-modal/paseo-detalle-modal.component';

@Component({
  selector: 'app-paseos',
  standalone: true,
  templateUrl: './paseos.page.html',
  styleUrls: ['./paseos.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink]
})
// lista de paseos del usuario
// tambien calculo resumen de km y minutos totales
export class PaseosPage {

  paseos: any[] = [];
  paseosCargados = false;
  totalKm = 0;
  totalMinutos = 0;

  constructor(private api: Api, private modalCtrl: ModalController) {}

  ionViewWillEnter() {
    this.cargarPaseos();
  }

  cargarPaseos() {
    const idUsuario = Number(localStorage.getItem("idUsuario"));
    if (idUsuario > 0) {
      this.api.getPaseos(idUsuario).subscribe({
        next: (res) => {
          this.paseos = res || [];
          this.totalKm = 0;
          this.totalMinutos = 0;
          for (let p of this.paseos) {
            this.totalKm += Number(p.distanciaKm) || 0;
            this.totalMinutos += Number(p.duracionMinutos) || 0;
          }
          this.totalKm = Math.round(this.totalKm * 10) / 10;
          this.paseosCargados = true;
        },
        error: () => { this.paseos = []; this.paseosCargados = true; }
      });
    } else {
      this.paseosCargados = true;
    }
  }

  async nuevoPaseo() {
    const modal = await this.modalCtrl.create({
      component: PaseoAddModalComponent,
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95
    });
    modal.onDidDismiss().then(r => { if (r.data === true) this.cargarPaseos(); });
    await modal.present();
  }

  async verDetalles(p: any) {
    const modal = await this.modalCtrl.create({
      component: PaseoDetalleModalComponent,
      componentProps: { idPaseo: p.idPaseo },
      breakpoints: [0, 0.95, 1],
      initialBreakpoint: 0.95
    });
    modal.onDidDismiss().then(r => { if (r.data === true) this.cargarPaseos(); });
    await modal.present();
  }

}

